import { cookies } from 'next/headers';
import type { CatalogProduct } from '../catalog/queries';
import { normaliseProductTone, toCatalogProduct } from '../catalog/queries';
import { getPrisma } from '../../lib/prisma';
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

/** Cart rows for a signed-in viewer or the guest token in the cookie. */
export async function getCartItems(viewerId: string | null): Promise<CartLine[]> {
  if (!process.env.DATABASE_URL) return [];

  if (viewerId) {
    const cart = await getPrisma().cart.findUnique({
      where: { userId: viewerId },
      select: { id: true },
    });
    return cart ? readCartItems(cart.id) : [];
  }

  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) return [];

  const cart = await getPrisma().cart.findUnique({
    where: { guestToken: token },
    select: { id: true, expiresAt: true },
  });
  if (!cart || cart.expiresAt <= new Date()) return [];

  return readCartItems(cart.id);
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
  wishlistIds: string[];
  compareIds: string[];
}

/** Everything the shell and the shop provider need on first render. */
export async function getShopState(viewerId: string | null): Promise<ShopState> {
  const [cartItems, wishlistIds, compareIds] = await Promise.all([
    getCartItems(viewerId),
    getWishlistIds(viewerId),
    getCompareIds(),
  ]);

  return { cartItems, wishlistIds, compareIds };
}
