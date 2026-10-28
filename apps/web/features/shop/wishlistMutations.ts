import { randomUUID } from 'node:crypto';
import { getPrisma } from '../../lib/prisma';
import type { IdsResult } from './types';

const WISHLIST_LIMIT = 100;

async function wishlistIds(userId: string): Promise<string[]> {
  const rows = await getPrisma().wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((row) => row.productId);
}

/** Adds or removes one active product from the buyer's saved list. */
export async function toggleWishlistForUser(userId: string, productId: string): Promise<IdsResult> {
  const prisma = getPrisma();
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { ok: true, ids: await wishlistIds(userId) };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { status: true },
  });
  if (!product || product.status !== 'active') return { ok: false, code: 'unavailable' };

  const count = await prisma.wishlistItem.count({ where: { userId } });
  if (count >= WISHLIST_LIMIT) return { ok: false, code: 'limit-reached' };

  await prisma.wishlistItem.create({
    data: { id: randomUUID(), userId, productId },
  });

  return { ok: true, ids: await wishlistIds(userId) };
}
