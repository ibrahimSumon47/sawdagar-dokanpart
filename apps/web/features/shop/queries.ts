import {
  couponScopes,
  couponTypes,
  evaluateCoupon,
  type CouponRule,
  type CouponScope,
  type CouponType,
} from '@sd/domain';
import { cookies } from 'next/headers';
import type { CatalogProduct } from '../catalog/queries';
import { normaliseProductTone, toCatalogProduct } from '../catalog/queries';
import { getPrisma } from '../../lib/prisma';
import { summariseCart } from './cartTotals';
import { CART_COOKIE, COMPARE_COOKIE, parseCompareIds } from './cookieState';
import type { CartLine, CompareProduct } from './types';

const cartInclude = {
  items: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      variant: {
        include: {
          product: {
            include: {
              organization: { select: { name: true, slug: true, district: true } },
            },
          },
        },
      },
    },
  },
};

/** Reads the rows of one cart in the order they were added. */
export async function readCartItems(cartId: string): Promise<CartLine[]> {
  const cart = await getPrisma().cart.findUnique({
    where: { id: cartId },
    include: cartInclude,
  });

  if (!cart) return [];

  return cart.items.flatMap<CartLine>((item) => {
    const product = item.variant.product;
    if (product.status !== 'active') return [];

    return [
      {
        variantId: item.variant.id,
        productId: product.id,
        productSlug: product.slug,
        title: { en: product.titleEn, bn: product.titleBn },
        variantName: { en: item.variant.nameEn, bn: item.variant.nameBn },
        priceMinor: item.variant.priceMinor,
        compareAtMinor: item.variant.compareAtMinor ?? undefined,
        quantity: item.quantity,
        stock: item.variant.stock,
        tone: normaliseProductTone(product.tone),
        vendor: {
          name: product.organization.name,
          slug: product.organization.slug,
          district: product.organization.district,
        },
      },
    ];
  });
}

/** Finds the signed-in or guest cart that belongs to this visitor. */
export async function getCartId(viewerId: string | null): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;

  if (viewerId) {
    const cart = await getPrisma().cart.findUnique({
      where: { userId: viewerId },
      select: { id: true },
    });
    return cart?.id ?? null;
  }

  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) return null;

  const cart = await getPrisma().cart.findUnique({
    where: { guestToken: token },
    select: { id: true, expiresAt: true },
  });
  if (!cart || cart.expiresAt <= new Date()) return null;

  return cart.id;
}

/** Cart rows for a signed-in viewer or the guest token in the cookie. */
export async function getCartItems(viewerId: string | null): Promise<CartLine[]> {
  const cartId = await getCartId(viewerId);
  return cartId ? readCartItems(cartId) : [];
}

/** Product ids saved by a signed-in buyer. */
export async function getWishlistIds(viewerId: string | null): Promise<string[]> {
  if (!viewerId || !process.env.DATABASE_URL) return [];

  const rows = await getPrisma().wishlistItem.findMany({
    where: { userId: viewerId },
    select: { productId: true },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((row) => row.productId);
}

/** Wishlist products in newest-saved order, ready for the product grid. */
export async function getWishlistProducts(viewerId: string): Promise<CatalogProduct[]> {
  if (!process.env.DATABASE_URL) return [];

  const rows = await getPrisma().wishlistItem.findMany({
    where: { userId: viewerId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        include: { organization: { select: { name: true, slug: true } } },
      },
    },
  });

  return rows
    .filter((row) => row.product.status === 'active')
    .map((row) => toCatalogProduct(row.product));
}

function normaliseCouponType(value: string): CouponType | null {
  return (couponTypes as readonly string[]).includes(value) ? (value as CouponType) : null;
}

function normaliseCouponScope(value: string): CouponScope | null {
  return (couponScopes as readonly string[]).includes(value) ? (value as CouponScope) : null;
}

interface CouponRecord {
  code: string;
  type: string;
  value: number;
  scope: string;
  minSubtotalMinor: number;
  maxDiscountMinor: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  organization: { slug: string } | null;
}

function toCouponRule(coupon: CouponRecord): CouponRule | null {
  const type = normaliseCouponType(coupon.type);
  const scope = normaliseCouponScope(coupon.scope);
  if (!type || !scope) return null;

  return {
    code: coupon.code,
    type,
    value: coupon.value,
    scope,
    vendorSlug: coupon.organization?.slug,
    minSubtotalMinor: coupon.minSubtotalMinor,
    maxDiscountMinor: coupon.maxDiscountMinor ?? undefined,
    startsAt: coupon.startsAt?.toISOString(),
    endsAt: coupon.endsAt?.toISOString(),
  };
}

/** Loads an active coupon by code, ready for pricing or a cart write. */
export async function findCouponRule(code: string): Promise<CouponRule | null> {
  if (!process.env.DATABASE_URL) return null;

  const coupon = await getPrisma().coupon.findUnique({
    where: { code },
    include: { organization: { select: { slug: true } } },
  });
  if (!coupon || !coupon.active) return null;

  return toCouponRule(coupon);
}

/** The coupon saved on a cart, but only while it still reduces this cart. */
export async function getCartCoupon(
  cartId: string | null,
  items: readonly CartLine[],
): Promise<CouponRule | null> {
  if (!cartId || !process.env.DATABASE_URL || items.length === 0) return null;

  const cart = await getPrisma().cart.findUnique({
    where: { id: cartId },
    select: { couponCode: true },
  });
  if (!cart?.couponCode) return null;

  const rule = await findCouponRule(cart.couponCode);
  if (!rule) return null;

  const base = summariseCart(items);
  const evaluation = evaluateCoupon(
    rule,
    items.map((item) => ({
      priceMinor: item.priceMinor,
      quantity: item.quantity,
      vendorSlug: item.vendor.slug,
    })),
    base.deliveryMinor,
  );

  return evaluation.ok ? rule : null;
}

/** Product ids in the comparison cookie. */
export async function getCompareIds(): Promise<string[]> {
  return parseCompareIds((await cookies()).get(COMPARE_COOKIE)?.value);
}

/** Comparison rows in the same order as the cookie, skipping stale products. */
export async function getCompareProducts(ids: readonly string[]): Promise<CompareProduct[]> {
  if (ids.length === 0 || !process.env.DATABASE_URL) return [];

  const products = await getPrisma().product.findMany({
    where: { id: { in: [...ids] }, status: 'active' },
    include: {
      organization: { select: { name: true } },
      category: { select: { nameEn: true, nameBn: true } },
      variants: { select: { id: true } },
    },
  });

  const byId = new Map(products.map((product) => [product.id, product]));

  return ids.flatMap<CompareProduct>((id) => {
    const product = byId.get(id);
    if (!product) return [];

    return [
      {
        id: product.id,
        slug: product.slug,
        title: { en: product.titleEn, bn: product.titleBn },
        vendorName: product.organization.name,
        priceMinor: product.priceMinor,
        compareAtMinor: product.compareAtMinor ?? undefined,
        rating: product.rating,
        reviewCount: product.reviewCount,
        totalStock: product.totalStock,
        tone: normaliseProductTone(product.tone),
        categoryName: { en: product.category.nameEn, bn: product.category.nameBn },
        variantCount: product.variants.length,
      },
    ];
  });
}

export interface ShopState {
  cartItems: CartLine[];
  cartCoupon: CouponRule | null;
  wishlistIds: string[];
  compareIds: string[];
}

/** Everything the shell and the shop provider need on first render. */
export async function getShopState(viewerId: string | null): Promise<ShopState> {
  const cartId = await getCartId(viewerId);
  const [cartItems, wishlistIds, compareIds] = await Promise.all([
    cartId ? readCartItems(cartId) : Promise.resolve([]),
    getWishlistIds(viewerId),
    getCompareIds(),
  ]);
  const cartCoupon = await getCartCoupon(cartId, cartItems);

  return { cartItems, cartCoupon, wishlistIds, compareIds };
}
