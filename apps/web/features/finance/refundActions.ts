'use server';

import { commissionFor } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { auditFinance, financeFail, requireFinance } from './guards';
import { postRefundLedger } from './ledgerService';

/** Refunds one approved return line and reverses its commission in the ledger. */
export async function refundReturnAction(formData: FormData): Promise<void> {
  const actor = await requireFinance();
  const returnRequestId = String(formData.get('returnRequestId') ?? '');
  if (!returnRequestId) financeFail('/admin/finance', 'invalid');

  const prisma = getPrisma();
  const request = await prisma.returnRequest.findFirst({
    where: { id: returnRequestId, status: 'approved', refund: null },
    include: {
      orderItem: {
        select: {
          lineTotalMinor: true,
          orderId: true,
          subOrder: {
            select: {
              organizationId: true,
              order: { select: { number: true } },
              organization: { select: { commissionRateBps: true } },
            },
          },
        },
      },
    },
  });
  if (!request) financeFail('/admin/finance', 'invalid');

  const amountMinor = request.orderItem.lineTotalMinor;
  const organizationId = request.orderItem.subOrder.organizationId;
  const commissionMinor = commissionFor(
    amountMinor,
    request.orderItem.subOrder.organization.commissionRateBps,
  );
  const refundId = randomUUID();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.refund.create({
        data: {
          id: refundId,
          orderId: request.orderItem.orderId,
          returnRequestId: request.id,
          organizationId,
          amountMinor,
          commissionMinor,
          status: 'paid',
          processedAt: new Date(),
        },
      });
      await tx.returnRequest.update({
        where: { id: request.id },
        data: { status: 'refunded' },
      });
      await postRefundLedger(tx, {
        refundId,
        orderNumber: request.orderItem.subOrder.order.number,
        amountMinor,
        commissionMinor,
        organizationId,
      });
    });
  } catch {
    financeFail('/admin/finance', 'failed');
  }

  await auditFinance(actor, 'refund.paid', 'refund', refundId, { amountMinor });
  revalidatePath('/admin/finance');
  revalidatePath('/seller/finance');
  revalidatePath('/seller/returns');
  revalidatePath('/account/returns');
  redirect('/admin/finance?refunded=1');
}
