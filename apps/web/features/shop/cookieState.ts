/** Cookie that identifies a guest cart; the value is a random UUID. */
export const CART_COOKIE = 'sd_cart';

/** Cookie that holds up to four compared product ids. */
export const COMPARE_COOKIE = 'sd_compare';

export const COMPARE_LIMIT = 4;

/** Cookie lifetime used for guest carts and the comparison list. */
export const SHOP_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Shared attributes for the guest cart and comparison cookies. */
export const shopCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SHOP_COOKIE_MAX_AGE,
};

const compareIdPattern = /^[A-Za-z0-9_-]{1,120}$/;

/** Narrows one stored value to a product id the comparison can use. */
export function isCompareId(value: unknown): value is string {
  return typeof value === 'string' && compareIdPattern.test(value);
}

/** Reads the comparison cookie, dropping duplicates, invalid ids and overflow. */
export function parseCompareIds(raw: string | undefined): string[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return [...new Set(parsed.filter(isCompareId))].slice(0, COMPARE_LIMIT);
  } catch {
    return [];
  }
}

/** Serialises the comparison list for the cookie. */
export function serialiseCompareIds(ids: readonly string[]): string {
  return JSON.stringify(ids.filter(isCompareId).slice(0, COMPARE_LIMIT));
}

export interface CompareToggle {
  ids: string[];
  added: boolean;
  limitReached: boolean;
}

/** Adds or removes one product while enforcing the four-product limit. */
export function toggleCompareId(ids: readonly string[], productId: string): CompareToggle {
  if (ids.includes(productId)) {
    return { ids: ids.filter((id) => id !== productId), added: false, limitReached: false };
  }

  if (ids.length >= COMPARE_LIMIT) {
    return { ids: [...ids], added: false, limitReached: true };
  }

  return { ids: [...ids, productId], added: true, limitReached: false };
}
