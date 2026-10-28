import { describe, expect, it } from 'vitest';
import { calculateCheckoutTotals, allocateAmount } from './checkoutTotals';
import type { CouponRule } from '../shop/coupons';

const now = new Date('2026-10-28T12:00:00.000Z');

const items = [
  { vendorId: 'org_1', vendorSlug: 'rupsha-tangail-weavers', unitPriceMinor: 490_000, quantity: 1 },
  { vendorId: 'org_2', vendorSlug: 'dhamrai-pottery-house', unitPriceMinor: 250_000, quantity: 2 },
];

function coupon(overrides: Partial<CouponRule> = {}): CouponRule {
  return {
    code: 'BOISHAKH10',
    type: 'percent',
    value: 1_000,
    scope: 'global',
    minSubtotalMinor: 0,
    ...overrides,
  };
}

describe('checkout totals', () => {
  it('charges shipping once per seller and applies the Dhaka zone', () => {
    const totals = calculateCheckoutTotals(items, null, 'Dhaka', now);

    expect(totals.subtotalMinor).toBe(990_000);
    expect(totals.shippingMinor).toBe(12_000);
    expect(totals.totalMinor).toBe(1_002_000);
    expect(totals.vendors).toHaveLength(2);
    expect(totals.vendors.every((vendor) => vendor.shippingMinor === 6_000)).toBe(true);
  });

  it('uses the outside and remote rates for other districts', () => {
    const outside = calculateCheckoutTotals(items, null, 'Chattogram', now);
    expect(outside.shippingMinor).toBe(24_000);

    const remote = calculateCheckoutTotals(items, null, 'Rangamati', now);
    expect(remote.shippingMinor).toBe(36_000);
  });

  it('waives every seller fee at the free-delivery threshold', () => {
    const totals = calculateCheckoutTotals(
      [
        {
          vendorId: 'org_1',
          vendorSlug: 'rupsha-tangail-weavers',
          unitPriceMinor: 900_000,
          quantity: 1,
        },
        {
          vendorId: 'org_2',
          vendorSlug: 'dhamrai-pottery-house',
          unitPriceMinor: 100_000,
          quantity: 1,
        },
      ],
      null,
      'Rangamati',
      now,
    );

    expect(totals.subtotalMinor).toBe(1_000_000);
    expect(totals.shippingMinor).toBe(0);
    expect(totals.totalMinor).toBe(1_000_000);
  });

  it('allocates a global percentage discount across sellers without losing a poisha', () => {
    const totals = calculateCheckoutTotals(items, coupon(), 'Dhaka', now);

    expect(totals.discountMinor).toBe(99_000);
    expect(totals.vendors.reduce((sum, vendor) => sum + vendor.discountMinor, 0)).toBe(99_000);
    expect(totals.vendors[0].discountMinor).toBe(49_000);
    expect(totals.vendors[1].discountMinor).toBe(50_000);
    expect(totals.totalMinor).toBe(1_002_000 - 99_000);
  });

  it('gives a vendor coupon only to that seller', () => {
    const totals = calculateCheckoutTotals(
      items,
      coupon({ scope: 'vendor', vendorSlug: 'dhamrai-pottery-house', value: 2_000 }),
      'Dhaka',
      now,
    );

    expect(totals.discountMinor).toBe(100_000);
    expect(totals.vendors[0].discountMinor).toBe(0);
    expect(totals.vendors[1].discountMinor).toBe(100_000);
  });

  it('waives shipping for a global free-shipping coupon', () => {
    const totals = calculateCheckoutTotals(
      items,
      coupon({ type: 'free_shipping', value: 0 }),
      'Dhaka',
      now,
    );

    expect(totals.shippingMinor).toBe(0);
    expect(totals.discountMinor).toBe(0);
    expect(totals.couponSavingsMinor).toBe(12_000);
    expect(totals.totalMinor).toBe(990_000);
  });

  it('reports an ineligible coupon without changing the total', () => {
    const totals = calculateCheckoutTotals(
      items,
      coupon({ minSubtotalMinor: 2_000_000 }),
      'Dhaka',
      now,
    );

    expect(totals.couponError).toBe('min-subtotal');
    expect(totals.discountMinor).toBe(0);
    expect(totals.totalMinor).toBe(1_002_000);
  });

  it('adds the included VAT share back from the discounted goods subtotal', () => {
    const totals = calculateCheckoutTotals(items, coupon(), 'Dhaka', now);
    expect(totals.vatMinor).toBe(Math.round((891_000 * 1_500) / 11_500));
  });
});

describe('discount allocation', () => {
  it('splits an amount exactly and keeps ties deterministic', () => {
    expect(allocateAmount(100, [1, 1, 1])).toEqual([34, 33, 33]);
    expect(allocateAmount(101, [1, 1, 1])).toEqual([34, 34, 33]);
    expect(allocateAmount(0, [1, 2])).toEqual([0, 0]);
    expect(allocateAmount(10, [0, 0])).toEqual([0, 0]);
  });
});
