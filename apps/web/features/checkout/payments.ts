import { randomUUID } from 'node:crypto';
import { getPrisma } from '../../lib/prisma';
import { verifyMockPayToken } from './mockPayToken';

export interface PaymentCompletion {
  ok: boolean;
  code?: 'invalid-token' | 'not-found' | 'invalid-state';
  orderNumber?: string;
  alreadyPaid?: boolean;
}

/**
 * Marks a MockPay payment as paid and confirms its order inside one
 * transaction. The conditional payment update is the idempotency guard: a
 * repeated callback finds no pending row and returns the completed result
 * instead of confirming twice or touching stock.
 */
export async function completeMockPayment(
  paymentId: string,
  token: string,
): Promise<PaymentCompletion> {
  if (!verifyMockPayToken(paymentId, token)) return { ok: false, code: 'invalid-token' };

  const prisma = getPrisma();
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        select: {
          id: true,
          number: true,
          status: true,
          userId: true,
          user: { select: { email: true } },
        },
      },
    },
  });
  if (!payment) return { ok: false, code: 'not-found' };

  if (payment.status === 'paid') {
    return { ok: true, orderNumber: payment.order.number, alreadyPaid: true };
  }
  if (payment.status !== 'pending' && payment.status !== 'failed') {
    return { ok: false, code: 'invalid-state' };
  }

  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { id: paymentId, status: { in: ['pending', 'failed'] } },
      data: { status: 'paid', paidAt: now, failureCode: null },
    });

    if (claimed.count === 0) {
      const current = await tx.payment.findUnique({
        where: { id: paymentId },
        select: { status: true },
      });
      return current?.status === 'paid'
        ? { ok: true, orderNumber: payment.order.number, alreadyPaid: true }
        : { ok: false, code: 'invalid-state' };
    }

    await tx.order.updateMany({
      where: { id: payment.order.id, status: 'pending_payment' },
      data: { status: 'confirmed', paymentStatus: 'paid', confirmedAt: now },
    });
    await tx.order.updateMany({
      where: { id: payment.order.id, status: 'confirmed' },
      data: { paymentStatus: 'paid' },
    });
    await tx.subOrder.updateMany({
      where: { orderId: payment.order.id, status: 'pending' },
      data: { status: 'confirmed' },
    });
    await tx.stockReservation.updateMany({
      where: { orderId: payment.order.id, status: 'held' },
      data: { status: 'confirmed' },
    });

    await tx.paymentAttempt.create({
      data: {
        id: randomUUID(),
        paymentId,
        provider: 'mockpay',
        status: 'paid',
        message: 'MockPay sandbox payment captured.',
      },
    });
    await tx.auditLog.create({
      data: {
        id: randomUUID(),
        actorUserId: payment.order.userId,
        actorEmail: payment.order.user.email,
        action: 'payment.paid',
        targetType: 'order',
        targetId: payment.order.number,
        metadata: { amountMinor: payment.amountMinor, provider: 'mockpay' },
      },
    });

    return { ok: true, orderNumber: payment.order.number };
  });
}

/** Marks a pending MockPay attempt as failed; the buyer may try again. */
export async function failMockPayment(paymentId: string, token: string): Promise<boolean> {
  if (!verifyMockPayToken(paymentId, token)) return false;

  const prisma = getPrisma();
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { id: true, status: true },
  });
  if (!payment) return false;
  if (payment.status === 'failed') return true;
  if (payment.status !== 'pending') return false;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'failed', failureCode: 'demo-declined' },
    }),
    prisma.paymentAttempt.create({
      data: {
        id: randomUUID(),
        paymentId,
        provider: 'mockpay',
        status: 'failed',
        message: 'The demo gateway declined this attempt.',
      },
    }),
  ]);
  return true;
}
