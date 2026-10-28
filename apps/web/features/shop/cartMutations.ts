import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { getPrisma } from '../../lib/prisma';
import { CART_COOKIE, SHOP_COOKIE_MAX_AGE, shopCookieOptions } from './cookieState';
import { readCartItems } from './queries';
import type { CartResult } from './types';

const CART_LIFETIME_MS = SHOP_COOKIE_MAX_AGE * 1000;

function nextExpiry(): Date {
  return new Date(Date.now() + CART_LIFETIME_MS);
}

interface ResolvedCart {
  id: string;
}

async function createGuestCart(): Promise<ResolvedCart> {
  const prisma = getPrisma();
  const store = await cookies();
  const existingToken = store.get(CART_COOKIE)?.value;
  const now = new Date();

  if (existingToken) {
    const existing = await prisma.cart.findUnique({
      where: { guestToken: existingToken },
      select: { id: true, expiresAt: true },
    });

    if (existing && existing.expiresAt > now) {
      await prisma.cart.update({ where: { id: existing.id }, data: { expiresAt: nextExpiry() } });
      return { id: existing.id };
    }

    if (existing) {
      await prisma.cart.delete({ where: { id: existing.id } });
    }
  }

  const token = randomUUID();
  const cart = await prisma.cart.create({
    data: { id: randomUUID(), guestToken: token, expiresAt: nextExpiry() },
    select: { id: true },
  });

  store.set(CART_COOKIE, token, shopCookieOptions);
  return { id: cart.id };
}

/**
 * Merges the guest cookie cart into the signed-in cart and clears the cookie.
 * Called after sign-in and before the first signed-in cart write.
 */
export async function mergeGuestCartIntoUser(userId: string): Promise<void> {
  const prisma = getPrisma();
  const store = await cookies();
  const token = store.get(CART_COOKIE)?.value;
  if (!token) return;

  const guest = await prisma.cart.findUnique({
    where: { guestToken: token },
    include: { items: { include: { variant: { select: { stock: true } } } } },
  });

  if (!guest || guest.expiresAt <= new Date()) {
    if (guest) await prisma.cart.delete({ where: { id: guest.id } });
    store.delete(CART_COOKIE);
    return;
  }

  const userCart = await prisma.cart.upsert({
    where: { userId },
    create: { id: randomUUID(), userId, expiresAt: nextExpiry() },
    update: { expiresAt: nextExpiry() },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    for (const item of guest.items) {
      const existing = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
        select: { quantity: true },
      });
      const quantity = Math.min(item.variant.stock, (existing?.quantity ?? 0) + item.quantity);
      if (quantity <= 0) continue;

      await tx.cartItem.upsert({
        where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
        create: { id: randomUUID(), cartId: userCart.id, variantId: item.variantId, quantity },
        update: { quantity },
      });
    }

    await tx.cart.delete({ where: { id: guest.id } });
  });

  store.delete(CART_COOKIE);
}

async function resolveCart(userId: string | null): Promise<ResolvedCart> {
  if (!userId) return createGuestCart();

  await mergeGuestCartIntoUser(userId);
  const prisma = getPrisma();
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { id: randomUUID(), userId, expiresAt: nextExpiry() },
    update: { expiresAt: nextExpiry() },
    select: { id: true },
  });

  return { id: cart.id };
}

async function findVariant(variantId: string) {
  return getPrisma().productVariant.findUnique({
    where: { id: variantId },
    include: { product: { select: { status: true } } },
  });
}

/** Adds a quantity of one variant, refusing to go past current stock. */
export async function addToCart(
  userId: string | null,
  variantId: string,
  quantity: number,
): Promise<CartResult> {
  const variant = await findVariant(variantId);
  if (!variant || variant.product.status !== 'active') {
    return { ok: false, code: 'unavailable' };
  }
  if (variant.stock <= 0) return { ok: false, code: 'out-of-stock', available: 0 };

  const cart = await resolveCart(userId);
  const prisma = getPrisma();
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    select: { quantity: true },
  });
  const nextQuantity = (existing?.quantity ?? 0) + quantity;

  if (nextQuantity > variant.stock) {
    return { ok: false, code: 'stock-limit', available: variant.stock };
  }

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    create: { id: randomUUID(), cartId: cart.id, variantId, quantity: nextQuantity },
    update: { quantity: nextQuantity },
  });
  await prisma.cart.update({ where: { id: cart.id }, data: { expiresAt: nextExpiry() } });

  return { ok: true, items: await readCartItems(cart.id) };
}

/** Sets an exact quantity; zero removes the row. */
export async function setCartQuantity(
  userId: string | null,
  variantId: string,
  quantity: number,
): Promise<CartResult> {
  if (quantity === 0) return removeFromCart(userId, variantId);

  const variant = await findVariant(variantId);
  if (!variant || variant.product.status !== 'active') {
    return { ok: false, code: 'unavailable' };
  }
  if (quantity > variant.stock) {
    return { ok: false, code: 'stock-limit', available: variant.stock };
  }

  const cart = await resolveCart(userId);
  const prisma = getPrisma();
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    select: { id: true },
  });
  if (!existing) return { ok: false, code: 'unavailable' };

  await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } });
  await prisma.cart.update({ where: { id: cart.id }, data: { expiresAt: nextExpiry() } });

  return { ok: true, items: await readCartItems(cart.id) };
}

/** Removes one variant from the viewer's cart. */
export async function removeFromCart(
  userId: string | null,
  variantId: string,
): Promise<CartResult> {
  const variant = await findVariant(variantId);
  if (!variant) return { ok: false, code: 'unavailable' };

  const cart = await resolveCart(userId);
  const prisma = getPrisma();
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
  await prisma.cart.update({ where: { id: cart.id }, data: { expiresAt: nextExpiry() } });

  return { ok: true, items: await readCartItems(cart.id) };
}
