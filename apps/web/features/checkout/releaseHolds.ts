import { randomUUID } from 'node:crypto';
import { getPrisma } from '../../lib/prisma';

/** Result of one sweep, reported back to the scheduler for its log line. */
export interface ReleaseHoldsResult {
  released: number;
  orders: number;
}

/**
 * Releases guest stock holds whose 15-minute window has passed. Each guest
 * order still awaiting payment is cancelled, its unpaid payment is failed so a
 * late callback cannot confirm it, and the held quantity returns to variant and
 * product stock. The conditional status update on each reservation makes a
 * repeated sweep, or one racing a payment, a no-op for rows that already moved on.
 */
export async function releaseExpiredGuestHolds(
  now: Date = new Date(),
): Promise<ReleaseHoldsResult> {
  const prisma = getPrisma();
  const expired = await prisma.stockReservation.findMany({
    where: { status: 'held', expiresAt: { lt: now }, order: { userId: null } },
    select: {
      id: true,
      orderId: true,
      variantId: true,
      quantity: true,
      variant: { select: { productId: true } },
    },
  });

  const orderIds = new Set<string>();
  let released = 0;
  for (const hold of expired) {
    const didRelease = await prisma.$transaction(async (tx) => {
      const claimed = await tx.stockReservation.updateMany({
        where: { id: hold.id, status: 'held' },
        data: { status: 'released' },
      });
      if (claimed.count === 0) return false;

      await tx.productVariant.update({
        where: { id: hold.variantId },
        data: { stock: { increment: hold.quantity } },
      });
      await tx.product.update({
        where: { id: hold.variant.productId },
        data: { totalStock: { increment: hold.quantity } },
      });
      return true;
    });
    if (didRelease) {
      released += 1;
      orderIds.add(hold.orderId);
    }
  }

  for (const orderId of orderIds) {
    await prisma.$transaction([
      prisma.order.updateMany({
        where: { id: orderId, status: 'pending_payment' },
        data: { status: 'cancelled', paymentStatus: 'failed', cancelledAt: now },
      }),
      prisma.subOrder.updateMany({
        where: { orderId, status: 'pending' },
        data: { status: 'cancelled', cancelledAt: now },
      }),
      prisma.payment.updateMany({
        where: { orderId, status: { in: ['pending', 'failed'] } },
        data: { status: 'failed', failureCode: 'hold-expired' },
      }),
      prisma.auditLog.create({
        data: {
          id: randomUUID(),
          actorUserId: null,
          actorEmail: 'system@sawdagar.test',
          action: 'order.hold_released',
          targetType: 'order',
          targetId: orderId,
          metadata: { reason: 'guest-hold-expired' },
        },
      }),
    ]);
  }

  return { released, orders: orderIds.size };
}
