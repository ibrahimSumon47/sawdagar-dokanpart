'use server';

import { canRequestPayout } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { auditSeller } from '../seller/actionHelpers';
import { requireSellerAction } from '../seller/session';
import { auditFinance, financeFail, requireFinance } from './guards';
import { postPayoutLedger } from './ledgerService';
import { getSellerFinance } from './queries';

/** Requests a withdrawal from the store's available ledger balance. */
export async function requestPayoutAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/finance');
  const amount = Number(formData.get('amount') ?? 0);
  const amountMinor = Math.round(amount * 100);
  if (!Number.isFinite(amount) || amount <= 0) financeFail('/seller/finance', 'invalid');

  const finance = await getSellerFinance(access.organizationId);
  const check = canRequestPayout(amountMinor, finance.availableMinor);
  if (!check.ok) financeFail('/seller/finance', check.code);

  const now = new Date();
  const number = `PO-${now.toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID()
    .slice(0, 6)
    .toUpperCase()}`;

  await getPrisma().payout.create({
    data: {
      id: randomUUID(),
      number,
      organizationId: access.organizationId,
      amountMinor,
      status: 'requested',
      note:
        String(formData.get('note') ?? '')
          .trim()
          .slice(0, 200) || null,
      requestedByUserId: access.viewer.id,
    },
  });
  await auditSeller(access, 'seller.payout.requested', 'payout', number, { amountMinor });

  revalidatePath('/seller/finance');
  revalidatePath('/admin/finance');
  redirect('/seller/finance?requested=1');
}

/** Approves, pays or rejects one payout in the finance queue. */
export async function processPayoutAction(formData: FormData): Promise<void> {
  const actor = await requireFinance();
  const payoutId = String(formData.get('payoutId') ?? '');
  const decision = String(formData.get('decision') ?? '');
  if (!payoutId || !['approve', 'pay', 'reject'].includes(decision)) {
    financeFail('/admin/finance', 'invalid');
  }

  const prisma = getPrisma();
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    select: {
      id: true,
      number: true,
      status: true,
      amountMinor: true,
      organizationId: true,
    },
  });
  if (!payout) financeFail('/admin/finance', 'invalid');

  const allowed =
    (decision === 'approve' && payout.status === 'requested') ||
    (decision === 'pay' && payout.status === 'approved') ||
    (decision === 'reject' && (payout.status === 'requested' || payout.status === 'approved'));
  if (!allowed) financeFail('/admin/finance', 'invalid');

  try {
    await prisma.$transaction(async (tx) => {
      if (decision === 'pay') {
        await postPayoutLedger(tx, {
          payoutId: payout.id,
          number: payout.number,
          amountMinor: payout.amountMinor,
          organizationId: payout.organizationId,
        });
      }
      await tx.payout.update({
        where: { id: payout.id },
        data: {
          status: decision === 'approve' ? 'approved' : decision === 'pay' ? 'paid' : 'rejected',
          processedAt:
            decision === 'pay' ? new Date() : payout.status === 'approved' ? new Date() : null,
          processedByUserId: actor.id,
        },
      });
    });
  } catch {
    financeFail('/admin/finance', 'failed');
  }

  await auditFinance(actor, `payout.${decision}`, 'payout', payout.id, {
    amountMinor: payout.amountMinor,
  });
  revalidatePath('/admin/finance');
  revalidatePath('/seller/finance');
  redirect('/admin/finance?saved=1');
}
