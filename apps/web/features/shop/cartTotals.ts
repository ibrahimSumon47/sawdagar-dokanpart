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
 * rows; the taka arithmetic here is integer poisha and never floats.
 */
export function summariseCart(items: readonly CartLine[]): CartSummary {
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalMinor = items.reduce((total, item) => total + item.priceMinor * item.quantity, 0);
  const deliveryMinor =
    items.length > 0 && subtotalMinor < FREE_DELIVERY_THRESHOLD_MINOR ? DELIVERY_FEE_MINOR : 0;

  return {
    items: [...items],
    groups: groupByVendor(items),
    count,
    subtotalMinor,
    deliveryMinor,
    totalMinor: subtotalMinor + deliveryMinor,
    freeDeliveryRemainingMinor: Math.max(0, FREE_DELIVERY_THRESHOLD_MINOR - subtotalMinor),
  };
}
