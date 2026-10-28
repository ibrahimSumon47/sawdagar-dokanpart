import { describe, expect, it } from 'vitest';
import {
  MIN_PAYOUT_MINOR,
  PLATFORM_CASH,
  PLATFORM_COMMISSION_REVENUE,
  availableForPayout,
  canRequestPayout,
  commissionFor,
  deliveryEntries,
  isBalanced,
  payoutEntries,
  refundEntries,
  sellerNetFor,
  sellerPayableAccount,
  signedBalance,
} from './ledger';

const store = 'org_test';

describe('finance ledger', () => {
  it('calculates commission in whole poisha and rounds down', () => {
    expect(commissionFor(10_000, 800)).toBe(800);
    expect(commissionFor(9_999, 800)).toBe(799);
    expect(commissionFor(1_000, 0)).toBe(0);
  });

  it('pays the seller goods after commission plus shipping', () => {
    expect(sellerNetFor(10_000, 1_000, 600, 800)).toEqual({
      commissionMinor: 720,
      netMinor: 8_880,
    });
  });

  it('balances a delivery transaction and posts the right accounts', () => {
    const entries = deliveryEntries(10_600, 800, store);
    expect(isBalanced(entries)).toBe(true);
    expect(signedBalance(entries, PLATFORM_CASH)).toBe(10_600);
    expect(signedBalance(entries, PLATFORM_COMMISSION_REVENUE)).toBe(-800);
    expect(signedBalance(entries, sellerPayableAccount(store))).toBe(-9_800);
  });

  it('balances payout and refund transactions', () => {
    expect(isBalanced(payoutEntries(5_000, store))).toBe(true);
    expect(isBalanced(refundEntries(3_000, 240, store))).toBe(true);
    expect(signedBalance(refundEntries(3_000, 240, store), PLATFORM_CASH)).toBe(-3_000);
    expect(signedBalance(refundEntries(3_000, 240, store), sellerPayableAccount(store))).toBe(
      2_760,
    );
  });

  it('subtracts payouts already in flight from the available balance', () => {
    expect(availableForPayout(-10_000, 0)).toBe(10_000);
    expect(availableForPayout(-10_000, 4_000)).toBe(6_000);
    expect(availableForPayout(500, 0)).toBe(0);
  });

  it('requires the payout threshold and an available balance', () => {
    expect(canRequestPayout(MIN_PAYOUT_MINOR, MIN_PAYOUT_MINOR)).toEqual({ ok: true });
    expect(canRequestPayout(MIN_PAYOUT_MINOR - 1, 500_000)).toEqual({
      ok: false,
      code: 'below_minimum',
    });
    expect(canRequestPayout(200_000, 150_000)).toEqual({ ok: false, code: 'above_available' });
    expect(canRequestPayout(1.5, 500_000)).toEqual({ ok: false, code: 'invalid' });
  });
});
