import { z } from 'zod';

export const catalogSorts = ['newest', 'price-asc', 'price-desc', 'rating'] as const;

export type CatalogSort = (typeof catalogSorts)[number];

/** The filters the catalog supports; every value is reflected in the URL. */
export interface CatalogFilters {
  q: string;
  category?: string;
  vendor?: string;
  /** Minimum price in whole taka. */
  minPrice?: number;
  /** Maximum price in whole taka. */
  maxPrice?: number;
  /** Minimum average rating, either 4 or 4.5. */
  rating?: number;
  inStock: boolean;
  sort: CatalogSort;
  page: number;
}

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

const slug = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]+$/)
  .optional()
  .catch(undefined);

const price = z
  .preprocess(
    (value) => (value === '' ? undefined : value),
    z.coerce.number().int().min(0).max(10_000_000).optional(),
  )
  .catch(undefined);

const querySchema = z.object({
  q: z.string().trim().max(80).catch(''),
  category: slug,
  vendor: slug,
  minPrice: price,
  maxPrice: price,
  rating: z.coerce
    .number()
    .refine((value) => value === 4 || value === 4.5)
    .optional()
    .catch(undefined),
  inStock: z.boolean(),
  sort: z.enum(catalogSorts).catch('newest'),
  page: z.coerce.number().int().min(1).max(500).catch(1),
});

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isTruthy(value: string | undefined): boolean {
  return value === '1' || value === 'on' || value === 'true';
}

/** Reads the URL into a validated filter object; bad values fall back safely. */
export function parseCatalogFilters(params: CatalogSearchParams): CatalogFilters {
  const parsed = querySchema.parse({
    q: first(params.q),
    category: first(params.category),
    vendor: first(params.vendor),
    minPrice: first(params.minPrice),
    maxPrice: first(params.maxPrice),
    rating: first(params.rating),
    inStock: isTruthy(first(params.inStock)),
    sort: first(params.sort),
    page: first(params.page),
  });

  let { minPrice, maxPrice } = parsed;
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return { ...parsed, minPrice, maxPrice };
}

/**
 * Builds a catalog URL from the current filters and a change. Any change other
 * than the page resets pagination, matching how faceted search normally works.
 */
export function catalogHref(
  filters: CatalogFilters,
  overrides: Partial<CatalogFilters> = {},
): string {
  const changed = Object.keys(overrides).some((key) => key !== 'page');
  const next: CatalogFilters = {
    ...filters,
    ...overrides,
    page: overrides.page ?? (changed ? 1 : filters.page),
  };

  const params = new URLSearchParams();
  if (next.q) params.set('q', next.q);
  if (next.category) params.set('category', next.category);
  if (next.vendor) params.set('vendor', next.vendor);
  if (next.minPrice !== undefined) params.set('minPrice', String(next.minPrice));
  if (next.maxPrice !== undefined) params.set('maxPrice', String(next.maxPrice));
  if (next.rating !== undefined) params.set('rating', String(next.rating));
  if (next.inStock) params.set('inStock', '1');
  if (next.sort !== 'newest') params.set('sort', next.sort);
  if (next.page > 1) params.set('page', String(next.page));

  const query = params.toString();
  return query ? `/catalog?${query}` : '/catalog';
}

/** The unfiltered catalog URL. */
export const catalogResetHref = '/catalog';
