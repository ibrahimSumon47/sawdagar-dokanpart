import { describe, expect, it } from 'vitest';
import { evaluateCoupon, type CouponRule, type CouponCartItem } from './coupons';

const now = new Date('2026-10-28T12:00:00.000Z');

const items: CouponCartItem[] = [
  { priceMinor: 500_000, quantity: 1, vendorSlug: 'rupsha-tangail-weavers' },
  { priceMinor: 250_000, quantity: 2, vendorSlug: 'dhamrai-pottery-house' },
];

function rule(overrides: Partial<CouponRule> = {}): CouponRule {
  return {
    code: 'BOISHAKH10',
    type: 'percent',
    value: 1_000,
    scope: 'global',
    minSubtotalMinor: 0,
    ...overrides,
  };
}

describe('coupon rules', () => {
  it('takes a percentage of the eligible subtotal', () => {
    expect(evaluateCoupon(rule(), items, 12_000, now)).toEqual({
      ok: true,
      discountMinor: 100_000,
      freeShipping: false,
      eligibleSubtotalMinor: 1_000_000,
    });
  });

  it('caps a percentage at the coupon maximum', () => {
    const result = evaluateCoupon(rule({ maxDiscountMinor: 50_000 }), items, 12_000, now);
    expect(result.ok && result.discountMinor).toBe(50_000);
  });

  it('discounts only the vendor items and refuses an unrelated vendor', () => {
    const result = evaluateCoupon(
      rule({ scope: 'vendor', vendorSlug: 'dhamrai-pottery-house', value: 2_000 }),
      items,
      12_000,
      now,
    );
    expect(result.ok && result.discountMinor).toBe(100_000);

    const unrelated = evaluateCoupon(
      rule({ scope: 'vendor', vendorSlug: 'sylhet-handloom-house' }),
      items,
      12_000,
      now,
    );
    expect(unrelated).toEqual({ ok: false, code: 'not-eligible' });
  });

  it('refuses below the minimum subtotal and reports the threshold', () => {
    const result = evaluateCoupon(rule({ minSubtotalMinor: 2_000_000 }), items, 12_000, now);
    expect(result).toEqual({
      ok: false,
      code: 'min-subtotal',
      minSubtotalMinor: 2_000_000,
    });
  });

  it('waives delivery for global free shipping and for a single-vendor cart', () => {
    const global = evaluateCoupon(rule({ type: 'free_shipping', value: 0 }), items, 12_000, now);
    expect(global.ok && global.discountMinor).toBe(12_000);

    const vendorOnly = evaluateCoupon(
      rule({
        type: 'free_shipping',
        value: 0,
        scope: 'vendor',
        vendorSlug: 'rupsha-tangail-weavers',
      }),
      items,
      12_000,
      now,
    );
    expect(vendorOnly.ok && vendorOnly.discountMinor).toBe(0);
  });

  it('rejects expired and not-yet-started coupons', () => {
    expect(
      evaluateCoupon(rule({ endsAt: '2026-10-27T00:00:00.000Z' }), items, 12_000, now),
    ).toEqual({ ok: false, code: 'expired' });
    expect(
      evaluateCoupon(rule({ startsAt: '2026-10-29T00:00:00.000Z' }), items, 12_000, now),
    ).toEqual({ ok: false, code: 'invalid' });
  });

  it('caps a fixed discount at the eligible subtotal', () => {
    const result = evaluateCoupon(rule({ type: 'fixed', value: 2_000_000 }), items, 12_000, now);
    expect(result.ok && result.discountMinor).toBe(1_000_000);
  });
});
