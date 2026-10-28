'use server';

import { getViewer } from '../auth/session';
import { addToCart, removeFromCart, setCartQuantity } from './cartMutations';
import { clearCompareForVisitor, toggleCompareForVisitor } from './compareMutations';
import { productIdSchema, quantitySchema, variantIdSchema } from './inputs';
import type { CartResult, IdsResult } from './types';
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

/** Clears every compared product. */
export async function clearCompare(): Promise<IdsResult> {
  await clearCompareForVisitor();
  return { ok: true, ids: [] };
}
