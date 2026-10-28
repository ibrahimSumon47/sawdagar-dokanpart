import { evaluateCoupon, type CouponRule } from '@sd/domain';
import type { CartGroup, CartLine, CartSummary } from './types';

/** Flat demo delivery fee for orders below the free-delivery threshold. */
export const DELIVERY_FEE_MINOR = 12_000;

/** Free delivery starts at ৳10,000. */
export const FREE_DELIVERY_THRESHOLD_MINOR = 1_000_000;

function groupByVendor(items: readonly CartLine[]): CartGroup[] {
  const groups = new Map<string, CartGroup>();

  for (const item of items) {
    const group = groups.get(item.vendor.slug) ?? {
      vendor: item.vendor,
      items: [],
      subtotalMinor: 0,
    };
    group.items.push(item);
    group.subtotalMinor += item.priceMinor * item.quantity;
    groups.set(item.vendor.slug, group);
  }

  return [...groups.values()];
}

/**
 * Turns cart rows into grouped totals. Prices come from server-side variant
 * rows; the taka arithmetic here is integer poisha and never floats. An
 * applied coupon is re-evaluated against the current rows, so a coupon that
 * no longer qualifies simply stops discounting.
 */
export function summariseCart(
  items: readonly CartLine[],
  coupon: CouponRule | null = null,
  now: Date = new Date(),
): CartSummary {
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalMinor = items.reduce((total, item) => total + item.priceMinor * item.quantity, 0);
  const deliveryMinor =
    items.length > 0 && subtotalMinor < FREE_DELIVERY_THRESHOLD_MINOR ? DELIVERY_FEE_MINOR : 0;

  const evaluation = coupon
    ? evaluateCoupon(
        coupon,
        items.map((item) => ({
          priceMinor: item.priceMinor,
          quantity: item.quantity,
          vendorSlug: item.vendor.slug,
        })),
        deliveryMinor,
        now,
      )
    : null;
  const discountMinor = evaluation?.ok ? evaluation.discountMinor : 0;

  return {
    items: [...items],
    groups: groupByVendor(items),
    count,
    subtotalMinor,
    deliveryMinor,
    discountMinor,
    totalMinor: Math.max(0, subtotalMinor + deliveryMinor - discountMinor),
    freeDeliveryRemainingMinor: Math.max(0, FREE_DELIVERY_THRESHOLD_MINOR - subtotalMinor),
    couponCode: coupon?.code,
  };
}
