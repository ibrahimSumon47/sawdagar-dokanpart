import {
  commissionFor,
  deliveryEntries,
  payoutEntries,
  refundEntries,
  type LedgerEntryDraft,
} from '@sd/domain';
import { randomUUID } from 'node:crypto';
import type { Prisma } from '../../generated/prisma/client';

export interface LedgerTransactionInput {
  kind: 'delivery' | 'payout' | 'refund';
  referenceId: string;
  memo?: string;
  entries: LedgerEntryDraft[];
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

/**
 * Writes one balanced transaction inside the caller's database transaction.
 * The unique kind and reference make a retry idempotent: an existing
 * transaction is left untouched and reported with `false`.
 */
export async function postLedgerTransaction(
  tx: Prisma.TransactionClient,
  input: LedgerTransactionInput,
): Promise<boolean> {
  try {
    await tx.ledgerTransaction.create({
      data: {
        id: randomUUID(),
        kind: input.kind,
        referenceId: input.referenceId,
        memo: input.memo,
        entries: {
          create: input.entries.map((entry) => ({
            id: randomUUID(),
            accountCode: entry.accountCode,
            direction: entry.direction,
            amountMinor: entry.amountMinor,
          })),
        },
      },
    });
    return true;
  } catch (error) {
    if (isUniqueViolation(error)) return false;
    throw error;
  }
}

/** Posts the sale when a seller's sub-order is marked delivered. */
export async function postDeliveryLedger(
  tx: Prisma.TransactionClient,
  input: {
    subOrderId: string;
    number: string;
    totalMinor: number;
    goodsMinor: number;
    organizationId: string;
    commissionRateBps: number;
  },
): Promise<boolean> {
  const commissionMinor = commissionFor(input.goodsMinor, input.commissionRateBps);
  return postLedgerTransaction(tx, {
    kind: 'delivery',
    referenceId: input.subOrderId,
    memo: `Delivered sub-order ${input.number}`,
    entries: deliveryEntries(input.totalMinor, commissionMinor, input.organizationId),
  });
}

/** Posts a paid payout: the store's payable is settled in cash. */
export async function postPayoutLedger(
  tx: Prisma.TransactionClient,
  input: { payoutId: string; number: string; amountMinor: number; organizationId: string },
): Promise<boolean> {
  return postLedgerTransaction(tx, {
    kind: 'payout',
    referenceId: input.payoutId,
    memo: `Payout ${input.number}`,
    entries: payoutEntries(input.amountMinor, input.organizationId),
  });
}

/** Posts a refund for one returned line, reversing commission proportionally. */
export async function postRefundLedger(
  tx: Prisma.TransactionClient,
  input: {
    refundId: string;
    orderNumber: string;
    amountMinor: number;
    commissionMinor: number;
    organizationId: string;
  },
): Promise<boolean> {
  return postLedgerTransaction(tx, {
    kind: 'refund',
    referenceId: input.refundId,
    memo: `Refund for ${input.orderNumber}`,
    entries: refundEntries(input.amountMinor, input.commissionMinor, input.organizationId),
  });
}
