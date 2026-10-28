/** The three coupon kinds the demo supports. */
export const couponTypes = ['percent', 'fixed', 'free_shipping'] as const;

export type CouponType = (typeof couponTypes)[number];

/** A coupon applies to the whole cart or to one vendor's items. */
export const couponScopes = ['global', 'vendor'] as const;

export type CouponScope = (typeof couponScopes)[number];

/**
 * A coupon reduced to the fields pricing needs. Dates are ISO strings so the
 * same object can cross the server/client boundary.
 */
export interface CouponRule {
  code: string;
  type: CouponType;
  /** Percent in basis points (1000 = 10%) or fixed poisha; zero for free shipping. */
  value: number;
  scope: CouponScope;
  /** Vendor slug when the coupon is vendor-scoped. */
  vendorSlug?: string;
  minSubtotalMinor: number;
  maxDiscountMinor?: number;
  startsAt?: string;
  endsAt?: string;
}

/** The cart fields coupon eligibility and discount math need. */
export interface CouponCartItem {
  priceMinor: number;
  quantity: number;
  vendorSlug: string;
}

export type CouponErrorCode = 'invalid' | 'expired' | 'not-eligible' | 'min-subtotal';

export interface CouponEvaluation {
  ok: true;
  discountMinor: number;
  freeShipping: boolean;
  /** Subtotal of the items the coupon could discount. */
  eligibleSubtotalMinor: number;
}

export interface CouponRejection {
  ok: false;
  code: CouponErrorCode;
  /** Present for `min-subtotal`, in poisha. */
  minSubtotalMinor?: number;
}

/**
 * Evaluates one coupon against the cart. Money is integer poisha and percent
 * values are basis points, so no floating-point rounding enters a total.
 */
export function evaluateCoupon(
  rule: CouponRule,
  items: readonly CouponCartItem[],
  deliveryMinor: number,
  now: Date = new Date(),
): CouponEvaluation | CouponRejection {
  if (items.length === 0) return { ok: false, code: 'not-eligible' };

  const eligible =
    rule.scope === 'vendor'
      ? items.filter((item) => item.vendorSlug === rule.vendorSlug)
      : [...items];

  if (eligible.length === 0) return { ok: false, code: 'not-eligible' };

  if (rule.startsAt) {
    const startsAt = new Date(rule.startsAt);
    if (Number.isFinite(startsAt.valueOf()) && now < startsAt)
      return { ok: false, code: 'invalid' };
  }

  if (rule.endsAt) {
    const endsAt = new Date(rule.endsAt);
    if (Number.isFinite(endsAt.valueOf()) && now > endsAt) return { ok: false, code: 'expired' };
  }

  const eligibleSubtotalMinor = eligible.reduce(
    (total, item) => total + item.priceMinor * item.quantity,
    0,
  );

  if (eligibleSubtotalMinor < rule.minSubtotalMinor) {
    return {
      ok: false,
      code: 'min-subtotal',
      minSubtotalMinor: rule.minSubtotalMinor,
    };
  }

  if (rule.type === 'free_shipping') {
    const freeShipping = rule.scope === 'global' || eligible.length === items.length;
    return {
      ok: true,
      discountMinor: freeShipping ? Math.max(0, deliveryMinor) : 0,
      freeShipping,
      eligibleSubtotalMinor,
    };
  }

  if (rule.type === 'percent') {
    const raw = Math.floor((eligibleSubtotalMinor * Math.max(0, rule.value)) / 10_000);
    const capped = rule.maxDiscountMinor === undefined ? raw : Math.min(raw, rule.maxDiscountMinor);
    return {
      ok: true,
      discountMinor: Math.min(capped, eligibleSubtotalMinor),
      freeShipping: false,
      eligibleSubtotalMinor,
    };
  }

  const fixed =
    rule.maxDiscountMinor === undefined ? rule.value : Math.min(rule.value, rule.maxDiscountMinor);
  return {
    ok: true,
    discountMinor: Math.min(Math.max(0, fixed), eligibleSubtotalMinor),
    freeShipping: false,
    eligibleSubtotalMinor,
  };
}
