import { describe, expect, it } from 'vitest';
import { buildCatalogSeed, slugify } from './catalogSeed';

describe('catalog seed', () => {
  const seed = buildCatalogSeed();

  it('is deterministic across builds', () => {
    expect(JSON.stringify(buildCatalogSeed())).toBe(JSON.stringify(seed));
  });

  it('builds the curated category tree and vendor list', () => {
    expect(seed.categories).toHaveLength(84);
    expect(seed.vendors).toHaveLength(24);
    expect(seed.categories.filter((category) => category.depth === 0)).toHaveLength(12);
    expect(seed.categories.filter((category) => category.depth === 1)).toHaveLength(72);
  });

  it('builds a product with three variants for every style and colour combination', () => {
    expect(seed.products).toHaveLength(432);
    expect(seed.products.flatMap((product) => product.variants)).toHaveLength(1296);
  });

  it('keeps ids, slugs and SKUs unique', () => {
    const slugs = seed.products.map((product) => product.slug);
    const skus = seed.products.flatMap((product) => product.variants.map((variant) => variant.sku));

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(skus).size).toBe(skus.length);
    expect(new Set(seed.vendors.map((vendor) => vendor.slug)).size).toBe(seed.vendors.length);
  });

  it('prices every variant in whole taka and keeps stock totals consistent', () => {
    for (const product of seed.products) {
      expect(product.priceMinor).toBeGreaterThan(0);
      expect(product.priceMinor % 100).toBe(0);
      expect(product.variants).toHaveLength(3);
      expect(product.variants[0].isDefault).toBe(true);
      expect(product.totalStock).toBe(
        product.variants.reduce((total, variant) => total + variant.stock, 0),
      );
      for (const variant of product.variants) {
        expect(variant.priceMinor % 100).toBe(0);
        expect(variant.priceMinor).toBeGreaterThan(0);
        expect(variant.stock).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('references a leaf category and a known vendor from every product', () => {
    const categories = new Map(seed.categories.map((category) => [category.slug, category]));
    const vendors = new Set(seed.vendors.map((vendor) => vendor.slug));

    for (const product of seed.products) {
      expect(categories.get(product.categorySlug)?.depth, product.slug).toBe(1);
      expect(vendors.has(product.vendorSlug), product.slug).toBe(true);
      expect(product.rating).toBeGreaterThanOrEqual(4.2);
      expect(product.rating).toBeLessThanOrEqual(4.9);
      expect(product.title.en.length).toBeGreaterThan(10);
      expect(product.title.bn.length).toBeGreaterThan(5);
      expect(product.description.bn).toContain('কারখানা');
    }
  });

  it('includes discounted and out-of-stock products for the filter states', () => {
    expect(seed.products.some((product) => product.compareAtMinor !== undefined)).toBe(true);
    expect(seed.products.some((product) => product.totalStock === 0)).toBe(true);
    expect(seed.products.some((product) => product.totalStock > 0)).toBe(true);
  });

  it('slugifies titles without punctuation or repeated dashes', () => {
    expect(slugify("Boys' panjabi, deep blue")).toBe('boys-panjabi-deep-blue');
    expect(slugify('  Kantha  runner — red border ')).toBe('kantha-runner-red-border');
  });
});
