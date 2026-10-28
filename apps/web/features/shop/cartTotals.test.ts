import { describe, expect, it } from 'vitest';
import { DELIVERY_FEE_MINOR, FREE_DELIVERY_THRESHOLD_MINOR, summariseCart } from './cartTotals';
import type { CartLine } from './types';

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    variantId: 'var_1',
    productId: 'prd_1',
    productSlug: 'jamdani-saree',
    title: { en: 'Jamdani saree', bn: 'জামদানি শাড়ি' },
    variantName: { en: 'Free size', bn: 'ফ্রি সাইজ' },
    priceMinor: 500_000,
    quantity: 1,
    stock: 8,
    tone: 'accent',
    vendor: { name: 'Padma Jamdani Studio', slug: 'padma-jamdani-studio', district: 'Narayanganj' },
    ...overrides,
  };
}

describe('cart totals', () => {
  it('returns an empty summary for an empty cart', () => {
    expect(summariseCart([])).toEqual({
      items: [],
      groups: [],
      count: 0,
      subtotalMinor: 0,
      deliveryMinor: 0,
      totalMinor: 0,
      freeDeliveryRemainingMinor: FREE_DELIVERY_THRESHOLD_MINOR,
    });
  });

  it('groups lines by vendor and sums quantity and price', () => {
    const items = [
      line({ quantity: 2 }),
      line({ variantId: 'var_2', priceMinor: 250_000 }),
      line({
        variantId: 'var_3',
        productId: 'prd_2',
        vendor: { name: 'Dhamrai Pottery House', slug: 'dhamrai-pottery-house', district: 'Dhaka' },
        priceMinor: 180_000,
      }),
    ];

    const summary = summariseCart(items);

    expect(summary.count).toBe(4);
    expect(summary.subtotalMinor).toBe(1_430_000);
    expect(summary.groups).toHaveLength(2);
    expect(summary.groups[0].items).toHaveLength(2);
    expect(summary.groups[0].subtotalMinor).toBe(1_250_000);
    expect(summary.groups[1].subtotalMinor).toBe(180_000);
  });

  it('adds delivery below the threshold and removes it at the threshold', () => {
    const below = summariseCart([line({ priceMinor: 500_000 })]);
    expect(below.deliveryMinor).toBe(DELIVERY_FEE_MINOR);
    expect(below.totalMinor).toBe(500_000 + DELIVERY_FEE_MINOR);
    expect(below.freeDeliveryRemainingMinor).toBe(500_000);

    const atThreshold = summariseCart([
      line({ priceMinor: FREE_DELIVERY_THRESHOLD_MINOR - 100_000 }),
      line({ variantId: 'var_2', priceMinor: 100_000 }),
    ]);
    expect(atThreshold.deliveryMinor).toBe(0);
    expect(atThreshold.totalMinor).toBe(FREE_DELIVERY_THRESHOLD_MINOR);
    expect(atThreshold.freeDeliveryRemainingMinor).toBe(0);
  });
});
