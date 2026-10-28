/**
 * Double-entry bookkeeping for the marketplace demo.
 *
 * Every money movement is a balanced transaction: the sum of debits equals the
 * sum of credits. Account codes are stable strings so the finance pages can
 * group balances without a second lookup table. Debits are positive and credits
 * negative in `signedBalance`; liability and revenue accounts therefore show a
 * credit balance as a negative number, and the seller available balance is its
 * negation.
 */

export type LedgerDirection = 'debit' | 'credit';

/** One line of a balanced transaction. */
export interface LedgerEntryDraft {
  accountCode: string;
  direction: LedgerDirection;
  amountMinor: number;
}

/** Cash received and paid by the platform. */
export const PLATFORM_CASH = 'platform:cash';

/** Commission earned by the marketplace. */
export const PLATFORM_COMMISSION_REVENUE = 'platform:commission_revenue';

/** Default take rate when a store has no override, in basis points. */
export const DEFAULT_COMMISSION_RATE_BPS = 800;

/** Smallest payout a seller may request, ৳1,000. */
export const MIN_PAYOUT_MINOR = 100_000;

/** Ledger account that holds what the marketplace owes one store. */
export function sellerPayableAccount(organizationId: string): string {
  return `seller:${organizationId}:payable`;
}

/** Commission in poisha, rounded down so the platform never overcharges. */
export function commissionFor(goodsMinor: number, rateBps: number): number {
  if (!Number.isSafeInteger(goodsMinor) || goodsMinor < 0) {
    throw new RangeError('Goods amount must be a non-negative integer.');
  }
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 10_000) {
    throw new RangeError('Commission rate must be between 0 and 10,000 basis points.');
  }
  return Math.floor((goodsMinor * rateBps) / 10_000);
}

/** Seller payout for one delivered sub-order: goods after commission, plus shipping. */
export function sellerNetFor(
  subtotalMinor: number,
  discountMinor: number,
  shippingMinor: number,
  rateBps: number,
): { commissionMinor: number; netMinor: number } {
  const goodsMinor = Math.max(0, subtotalMinor - discountMinor);
  const commissionMinor = commissionFor(goodsMinor, rateBps);
  return {
    commissionMinor,
    netMinor: goodsMinor - commissionMinor + shippingMinor,
  };
}

/** Entries for a delivered sub-order: cash in, seller payable and commission. */
export function deliveryEntries(
  totalMinor: number,
  commissionMinor: number,
  organizationId: string,
): LedgerEntryDraft[] {
  if (!Number.isSafeInteger(totalMinor) || totalMinor < 0) {
    throw new RangeError('Order total must be a non-negative integer.');
  }
  if (
    !Number.isSafeInteger(commissionMinor) ||
    commissionMinor < 0 ||
    commissionMinor > totalMinor
  ) {
    throw new RangeError('Commission must fit inside the order total.');
  }
  return [
    { accountCode: PLATFORM_CASH, direction: 'debit', amountMinor: totalMinor },
    {
      accountCode: sellerPayableAccount(organizationId),
      direction: 'credit',
      amountMinor: totalMinor - commissionMinor,
    },
    {
      accountCode: PLATFORM_COMMISSION_REVENUE,
      direction: 'credit',
      amountMinor: commissionMinor,
    },
  ];
}

/** Entries for a payout: the store's payable falls and cash leaves. */
export function payoutEntries(amountMinor: number, organizationId: string): LedgerEntryDraft[] {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new RangeError('Payout must be a positive integer.');
  }
  return [
    {
      accountCode: sellerPayableAccount(organizationId),
      direction: 'debit',
      amountMinor,
    },
    { accountCode: PLATFORM_CASH, direction: 'credit', amountMinor },
  ];
}

/**
 * Entries for a refund of one returned line: the seller's payable and the
 * platform's commission reverse, and cash leaves to the buyer.
 */
export function refundEntries(
  amountMinor: number,
  commissionMinor: number,
  organizationId: string,
): LedgerEntryDraft[] {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new RangeError('Refund must be a positive integer.');
  }
  if (
    !Number.isSafeInteger(commissionMinor) ||
    commissionMinor < 0 ||
    commissionMinor > amountMinor
  ) {
    throw new RangeError('Commission reversal must fit inside the refund.');
  }
  return [
    {
      accountCode: sellerPayableAccount(organizationId),
      direction: 'debit',
      amountMinor: amountMinor - commissionMinor,
    },
    {
      accountCode: PLATFORM_COMMISSION_REVENUE,
      direction: 'debit',
      amountMinor: commissionMinor,
    },
    { accountCode: PLATFORM_CASH, direction: 'credit', amountMinor },
  ];
}

/** True when total debits equal total credits. */
export function isBalanced(entries: readonly LedgerEntryDraft[]): boolean {
  let debits = 0;
  let credits = 0;
  for (const entry of entries) {
    if (entry.direction === 'debit') debits += entry.amountMinor;
    else credits += entry.amountMinor;
  }
  return debits === credits;
}

/** Net debit balance for one account; credits are negative. */
export function signedBalance(
  entries: readonly Pick<LedgerEntryDraft, 'accountCode' | 'direction' | 'amountMinor'>[],
  accountCode: string,
): number {
  return entries
    .filter((entry) => entry.accountCode === accountCode)
    .reduce(
      (total, entry) =>
        total + (entry.direction === 'debit' ? entry.amountMinor : -entry.amountMinor),
      0,
    );
}

/** What a store can withdraw after subtracting payouts already in flight. */
export function availableForPayout(
  sellerPayableSignedBalance: number,
  outstandingPayoutsMinor: number,
): number {
  const balance = -sellerPayableSignedBalance - outstandingPayoutsMinor;
  return balance > 0 ? balance : 0;
}

/** Payout requests must clear the threshold and stay inside the available balance. */
export function canRequestPayout(
  amountMinor: number,
  availableMinor: number,
): { ok: true } | { ok: false; code: 'below_minimum' | 'above_available' | 'invalid' } {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    return { ok: false, code: 'invalid' };
  }
  if (amountMinor < MIN_PAYOUT_MINOR) return { ok: false, code: 'below_minimum' };
  if (amountMinor > availableMinor) return { ok: false, code: 'above_available' };
  return { ok: true };
}
