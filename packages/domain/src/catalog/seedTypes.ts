import type { LocalisedName } from './categories';

/** Visual tones a product card can use until photography lands. */
export const productTones = ['accent', 'secondary', 'highlight', 'ink'] as const;

export type ProductTone = (typeof productTones)[number];

/** One category row, including its materialized path. */
export interface SeedCategory {
  id: string;
  slug: string;
  parentSlug?: string;
  path: string;
  depth: number;
  sortOrder: number;
  name: LocalisedName;
  description: LocalisedName;
}

/** One vendor store, mapped to an Organization row. */
export interface SeedVendor {
  id: string;
  slug: string;
  name: string;
  district: string;
  description: LocalisedName;
  verified: boolean;
  rating: number;
  reviewCount: number;
  followers: number;
}

/** One sellable SKU. */
export interface SeedVariant {
  id: string;
  sku: string;
  name: LocalisedName;
  priceMinor: number;
  compareAtMinor?: number;
  stock: number;
  isDefault: boolean;
  sortOrder: number;
}

/** One product with its display aggregates and variants. */
export interface SeedProduct {
  id: string;
  slug: string;
  title: LocalisedName;
  description: LocalisedName;
  categorySlug: string;
  vendorSlug: string;
  tone: ProductTone;
  priceMinor: number;
  compareAtMinor?: number;
  totalStock: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  variants: SeedVariant[];
}

/** Everything the catalog seed writes, built deterministically from curated data. */
export interface CatalogSeed {
  categories: SeedCategory[];
  vendors: SeedVendor[];
  products: SeedProduct[];
}
