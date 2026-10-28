'use server';

import { evaluateCoupon } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';
import { getViewer } from '../auth/session';
import { summariseCart } from './cartTotals';
import { addToCart, removeFromCart, setCartQuantity } from './cartMutations';
import { clearCompareForVisitor, toggleCompareForVisitor } from './compareMutations';
import { couponCodeSchema, productIdSchema, quantitySchema, variantIdSchema } from './inputs';
import { findCouponRule, getCartId, readCartItems } from './queries';
import type { CartResult, CouponApplyResult, IdsResult } from './types';
import { toggleWishlistForUser } from './wishlistMutations';

const invalid: CartResult = { ok: false, code: 'failed' };

/** Adds a variant to the viewer's cart, creating a guest cart when needed. */
export async function addCartItem(variantId: string, quantity: number): Promise<CartResult> {
  const parsedVariant = variantIdSchema.safeParse(variantId);
  const parsedQuantity = quantitySchema.safeParse(quantity);
  if (!parsedVariant.success || !parsedQuantity.success) return invalid;

  const viewer = await getViewer();
  return addToCart(viewer?.id ?? null, parsedVariant.data, parsedQuantity.data);
}

/** Sets a new quantity for one cart row; stock is checked on the server. */
export async function updateCartItem(variantId: string, quantity: number): Promise<CartResult> {
  const parsedVariant = variantIdSchema.safeParse(variantId);
  const parsedQuantity = quantitySchema.safeParse(quantity);
  if (!parsedVariant.success || !parsedQuantity.success) return invalid;

  const viewer = await getViewer();
  return setCartQuantity(viewer?.id ?? null, parsedVariant.data, parsedQuantity.data);
}

/** Removes one variant from the viewer's cart. */
export async function removeCartItem(variantId: string): Promise<CartResult> {
  const parsed = variantIdSchema.safeParse(variantId);
  if (!parsed.success) return invalid;

  const viewer = await getViewer();
  return removeFromCart(viewer?.id ?? null, parsed.data);
}

/** Toggles one product in the signed-in buyer's wishlist. */
export async function toggleWishlist(productId: string): Promise<IdsResult> {
  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success) return { ok: false, code: 'failed' };

  const viewer = await getViewer();
  if (!viewer) return { ok: false, code: 'unauthenticated' };

  return toggleWishlistForUser(viewer.id, parsed.data);
}

/** Toggles one product in the cookie-backed comparison list. */
export async function toggleCompare(productId: string): Promise<IdsResult> {
  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success) return { ok: false, code: 'failed' };

  return toggleCompareForVisitor(parsed.data);
}

/** Applies one coupon to the current guest or user cart after server checks. */
export async function applyCartCoupon(code: string): Promise<CouponApplyResult> {
  const parsed = couponCodeSchema.safeParse(code);
  if (!parsed.success) return { ok: false, code: 'invalid' };

  const viewer = await getViewer();
  const cartId = await getCartId(viewer?.id ?? null);
  if (!cartId) return { ok: false, code: 'empty' };

  const items = await readCartItems(cartId);
  if (items.length === 0) return { ok: false, code: 'empty' };

  const coupon = await findCouponRule(parsed.data);
  if (!coupon) return { ok: false, code: 'invalid' };

  const base = summariseCart(items);
  const evaluation = evaluateCoupon(
    coupon,
    items.map((item) => ({
      priceMinor: item.priceMinor,
      quantity: item.quantity,
      vendorSlug: item.vendor.slug,
    })),
    base.deliveryMinor,
  );
  if (!evaluation.ok) {
    return {
      ok: false,
      code: evaluation.code,
      minSubtotalMinor: evaluation.minSubtotalMinor,
    };
  }

  await getPrisma().cart.update({ where: { id: cartId }, data: { couponCode: coupon.code } });
  return { ok: true, coupon };
}

/** Removes the coupon saved on the current cart. */
export async function clearCartCoupon(): Promise<{ ok: boolean }> {
  const viewer = await getViewer();
  const cartId = await getCartId(viewer?.id ?? null);
  if (!cartId) return { ok: true };

  await getPrisma().cart.update({ where: { id: cartId }, data: { couponCode: null } });
  return { ok: true };
}

/** Clears every compared product. */
export async function clearCompare(): Promise<IdsResult> {
  await clearCompareForVisitor();
  return { ok: true, ids: [] };
}
