import { cookies } from 'next/headers';
import { getPrisma } from '../../lib/prisma';
import {
  COMPARE_COOKIE,
  parseCompareIds,
  serialiseCompareIds,
  shopCookieOptions,
  toggleCompareId,
} from './cookieState';
import type { IdsResult } from './types';

async function writeCompare(ids: string[]): Promise<void> {
  const store = await cookies();
  if (ids.length === 0) {
    store.delete(COMPARE_COOKIE);
    return;
  }
  store.set(COMPARE_COOKIE, serialiseCompareIds(ids), shopCookieOptions);
}

/** Adds or removes one product, keeping at most four active products. */
export async function toggleCompareForVisitor(productId: string): Promise<IdsResult> {
  const store = await cookies();
  const ids = parseCompareIds(store.get(COMPARE_COOKIE)?.value);

  // Removing a stale product must still work, so removal skips the catalog check.
  if (ids.includes(productId)) {
    const next = toggleCompareId(ids, productId);
    await writeCompare(next.ids);
    return { ok: true, ids: next.ids };
  }

  const product = await getPrisma().product.findUnique({
    where: { id: productId },
    select: { status: true },
  });
  if (!product || product.status !== 'active') return { ok: false, code: 'unavailable' };

  const next = toggleCompareId(ids, productId);
  if (next.limitReached) return { ok: false, code: 'limit-reached' };

  await writeCompare(next.ids);
  return { ok: true, ids: next.ids };
}

/** Empties the comparison cookie. */
export async function clearCompareForVisitor(): Promise<void> {
  const store = await cookies();
  store.delete(COMPARE_COOKIE);
}
