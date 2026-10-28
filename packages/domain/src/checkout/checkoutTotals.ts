import { evaluateCoupon, type CouponErrorCode, type CouponRule } from '../shop/coupons';
import {
  FREE_DELIVERY_THRESHOLD_MINOR,
  shippingFeeForZone,
  shippingZoneForDistrict,
} from './shipping';

/** One checkout row: a variant, its seller and the server-side unit price. */
export interface CheckoutItem {
  vendorId: string;
  vendorSlug: string;
  unitPriceMinor: number;
  quantity: number;
}

/** Totals for one seller's shipment within an order. */
export interface CheckoutVendorTotal {
  vendorId: string;
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  totalMinor: number;
}

export interface CheckoutTotals {
  subtotalMinor: number;
  /** Shipping actually charged, after a free-shipping coupon. */
  shippingMinor: number;
  /** Goods discount; shipping waived by a coupon is reported separately. */
  discountMinor: number;
  /** Goods discount plus shipping waived, used on the coupon redemption row. */
  couponSavingsMinor: number;
  /** VAT already contained in the goods prices, shown for transparency. */
  vatMinor: number;
  totalMinor: number;
  vendors: CheckoutVendorTotal[];
  couponError?: CouponErrorCode;
}

/** VAT rate shown at checkout, in basis points (15%). */
export const VAT_RATE_BASIS_POINTS = 1_500;

/**
 * Splits an integer amount across weights so the shares add up exactly. The
 * largest fractional remainders receive the extra poisha, with the earlier
 * seller winning ties, which keeps repeated totals deterministic.
 */
export function allocateAmount(amountMinor: number, weights: readonly number[]): number[] {
  const totalWeight = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);
  if (amountMinor <= 0 || totalWeight <= 0) return weights.map(() => 0);

  const shares = weights.map((weight) =>
    Math.floor((amountMinor * Math.max(0, weight)) / totalWeight),
  );
  const assigned = shares.reduce((sum, share) => sum + share, 0);
  const remainders = weights.map((weight, index) => ({
    index,
    remainder: amountMinor * Math.max(0, weight) - shares[index] * totalWeight,
  }));
  remainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (let offset = 0; offset < amountMinor - assigned; offset += 1) {
    shares[remainders[offset].index] += 1;
  }

  return shares;
}

/**
 * Prices an order from server-side rows. Every seller ships separately, so
 * shipping is charged once per seller until the free-delivery threshold. A
 * coupon is evaluated before it is allocated, and a rejected coupon returns
 * its error instead of silently changing the total.
 */
export function calculateCheckoutTotals(
  items: readonly CheckoutItem[],
  coupon: CouponRule | null,
  destinationDistrict: string,
  now: Date = new Date(),
): CheckoutTotals {
  const sellerSubtotals = new Map<string, number>();
  let subtotalMinor = 0;

  for (const item of items) {
    const lineMinor = item.unitPriceMinor * item.quantity;
    subtotalMinor += lineMinor;
    sellerSubtotals.set(item.vendorId, (sellerSubtotals.get(item.vendorId) ?? 0) + lineMinor);
  }

  const vendors = [...sellerSubtotals.entries()].map(([vendorId, vendorSubtotal]) => ({
    vendorId,
    subtotalMinor: vendorSubtotal,
  }));
  const sellerCount = vendors.length;
  const freeDelivery = subtotalMinor >= FREE_DELIVERY_THRESHOLD_MINOR;
  const feePerSeller = freeDelivery
    ? 0
    : shippingFeeForZone(shippingZoneForDistrict(destinationDistrict));

  const rawShippingMinor = feePerSeller * sellerCount;
  const evaluation = coupon
    ? evaluateCoupon(
        coupon,
        items.map((item) => ({
          priceMinor: item.unitPriceMinor,
          quantity: item.quantity,
          vendorSlug: item.vendorSlug,
        })),
        rawShippingMinor,
        now,
      )
    : null;

  if (evaluation && !evaluation.ok) {
    return {
      subtotalMinor,
      shippingMinor: rawShippingMinor,
      discountMinor: 0,
      couponSavingsMinor: 0,
      vatMinor: Math.round(
        (subtotalMinor * VAT_RATE_BASIS_POINTS) / (10_000 + VAT_RATE_BASIS_POINTS),
      ),
      totalMinor: subtotalMinor + rawShippingMinor,
      vendors: vendors.map((vendor) => ({
        ...vendor,
        shippingMinor: feePerSeller,
        discountMinor: 0,
        totalMinor: vendor.subtotalMinor + feePerSeller,
      })),
      couponError: evaluation.code,
    };
  }

  let shippingDiscounts = vendors.map(() => 0);
  let itemDiscounts = vendors.map(() => 0);
  let discountMinor = 0;
  let couponSavingsMinor = 0;

  if (evaluation?.ok) {
    if (evaluation.freeShipping) {
      shippingDiscounts = vendors.map(() => feePerSeller);
      couponSavingsMinor = rawShippingMinor;
    } else {
      const weights =
        coupon?.scope === 'vendor'
          ? vendors.map((vendor) =>
              items.some(
                (item) =>
                  item.vendorId === vendor.vendorId && item.vendorSlug === coupon.vendorSlug,
              )
                ? vendor.subtotalMinor
                : 0,
            )
          : vendors.map((vendor) => vendor.subtotalMinor);
      itemDiscounts = allocateAmount(evaluation.discountMinor, weights);
      discountMinor = evaluation.discountMinor;
      couponSavingsMinor = evaluation.discountMinor;
    }
  }

  const pricedVendors = vendors.map((vendor, index) => {
    const shippingMinor = Math.max(0, feePerSeller - shippingDiscounts[index]);
    return {
      ...vendor,
      shippingMinor,
      discountMinor: itemDiscounts[index],
      totalMinor: vendor.subtotalMinor + shippingMinor - itemDiscounts[index],
    };
  });

  const shippingMinor = pricedVendors.reduce((sum, vendor) => sum + vendor.shippingMinor, 0);

  return {
    subtotalMinor,
    shippingMinor,
    discountMinor,
    couponSavingsMinor,
    vatMinor: Math.round(
      (Math.max(0, subtotalMinor - itemDiscounts.reduce((sum, value) => sum + value, 0)) *
        VAT_RATE_BASIS_POINTS) /
        (10_000 + VAT_RATE_BASIS_POINTS),
    ),
    totalMinor: Math.max(0, subtotalMinor + shippingMinor - discountMinor),
    vendors: pricedVendors,
  };
}
