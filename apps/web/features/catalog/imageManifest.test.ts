import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buildCatalogSeed,
  unpublishableProductSlugs,
  validateImageManifest,
  type ProductImageManifest,
} from '@sd/domain';

const manifestPath = new URL('../../../../packages/seed/images/manifest.json', import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ProductImageManifest;

describe('product image manifest', () => {
  it('has no duplicate public IDs, alt text, or near-duplicate photos', () => {
    const duplicates = validateImageManifest(manifest).filter(
      (problem) => problem.kind !== 'too-few-images',
    );
    expect(duplicates).toEqual([]);
  });

  it('only lists subcategories that exist in the catalog seed', () => {
    const seed = buildCatalogSeed();
    const known = new Set(seed.categories.map((category) => category.slug));
    const unknown = Object.keys(manifest.subcategories).filter((slug) => !known.has(slug));
    expect(unknown).toEqual([]);
  });

  it('leaves unpublished every product without its own three photos', () => {
    const unpublished = new Set(unpublishableProductSlugs(buildCatalogSeed(), manifest));
    for (const product of buildCatalogSeed().products) {
      const photos = manifest.subcategories[product.categorySlug] ?? [];
      if (photos.length < 3) expect(unpublished.has(product.slug)).toBe(true);
    }
  });
});
