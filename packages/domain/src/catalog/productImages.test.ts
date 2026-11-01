import { describe, expect, it } from 'vitest';

import {
  assignProductImages,
  hammingDistanceHex,
  normalizeAlt,
  unpublishableProductSlugs,
  validateImageManifest,
  type ProductImageAsset,
  type ProductImageManifest,
} from './productImages';
import { buildCatalogSeed } from './catalogSeed';

function asset(
  overrides: Partial<ProductImageAsset> & Pick<ProductImageAsset, 'publicId'>,
): ProductImageAsset {
  return {
    sourceUrl: `https://example.test/${overrides.publicId}`,
    license: 'CC BY-SA 4.0',
    author: 'Test author',
    width: 960,
    height: 720,
    phash: '0123456789abcdef',
    alt: `Photograph ${overrides.publicId}`,
    ...overrides,
  };
}

function manifest(subcategories: ProductImageManifest['subcategories']): ProductImageManifest {
  return { version: 1, enforced: false, subcategories };
}

describe('hammingDistanceHex', () => {
  it('counts differing bits', () => {
    expect(hammingDistanceHex('0000000000000000', 'ffffffffffffffff')).toBe(64);
    expect(hammingDistanceHex('0000000000000001', '0000000000000000')).toBe(1);
  });

  it('returns null for malformed input instead of a false match', () => {
    expect(hammingDistanceHex('short', '0000000000000000')).toBeNull();
    expect(hammingDistanceHex('zzzzzzzzzzzzzzzz', '0000000000000000')).toBeNull();
  });
});

describe('normalizeAlt', () => {
  it('ignores case and spacing', () => {
    expect(normalizeAlt(' Silk  Saree ')).toBe('silk saree');
  });
});

describe('assignProductImages', () => {
  it('gives each product its own three photos in order', () => {
    const photos = [1, 2, 3, 4, 5, 6].map((n) => asset({ publicId: `p${n}` }));
    const sets = assignProductImages(['a', 'b'], photos);
    expect(sets.map((set) => set.productSlug)).toEqual(['a', 'b']);
    expect(sets[0]?.images.map((image) => image.publicId)).toEqual(['p1', 'p2', 'p3']);
    expect(sets[1]?.images.map((image) => image.publicId)).toEqual(['p4', 'p5', 'p6']);
  });

  it('leaves products without three photos unassigned', () => {
    const photos = [1, 2, 3, 4].map((n) => asset({ publicId: `p${n}` }));
    expect(assignProductImages(['a', 'b', 'c'], photos)).toHaveLength(1);
  });
});

describe('validateImageManifest', () => {
  it('accepts a clean manifest', () => {
    const clean = manifest({
      jamdani: [
        asset({ publicId: 'j1', phash: '0000000000000000' }),
        asset({ publicId: 'j2', phash: 'ffffffffffffffff' }),
        asset({ publicId: 'j3', phash: '00ff00ff00ff00ff' }),
      ],
    });
    expect(validateImageManifest(clean)).toEqual([]);
  });

  it('flags a subcategory with fewer than three photos', () => {
    const short = manifest({ jamdani: [asset({ publicId: 'j1' })] });
    expect(validateImageManifest(short)).toContainEqual({
      kind: 'too-few-images',
      subcategory: 'jamdani',
      count: 1,
    });
  });

  it('flags a Cloudinary object used twice', () => {
    const shared = manifest({
      a: [asset({ publicId: 'shared', phash: '0000000000000000' })],
      b: [asset({ publicId: 'shared', phash: 'ffffffffffffffff' })],
    });
    expect(validateImageManifest(shared)).toContainEqual({
      kind: 'duplicate-public-id',
      publicId: 'shared',
    });
  });

  it('flags two photographs that are near-duplicates across subcategories', () => {
    const near = manifest({
      a: [asset({ publicId: 'x1', phash: '0000000000000000' })],
      b: [asset({ publicId: 'x2', phash: '0000000000000001' })],
    });
    expect(validateImageManifest(near)).toContainEqual({
      kind: 'near-duplicate-hash',
      distance: 1,
      publicIds: ['x1', 'x2'],
    });
  });

  it('flags duplicate alt text after normalisation', () => {
    const dup = manifest({
      a: [asset({ publicId: 'a1', alt: 'Silk saree', phash: '0000000000000000' })],
      b: [asset({ publicId: 'b1', alt: ' silk  Saree ', phash: 'ffffffffffffffff' })],
    });
    expect(validateImageManifest(dup)).toContainEqual({
      kind: 'duplicate-alt',
      alt: 'silk saree',
      publicIds: ['a1', 'b1'],
    });
  });

  it('flags an empty alt and a malformed hash', () => {
    const bad = manifest({
      a: [asset({ publicId: 'a1', alt: '   ', phash: 'short' })],
    });
    const problems = validateImageManifest(bad);
    expect(problems).toContainEqual({ kind: 'empty-alt', publicId: 'a1' });
    expect(problems).toContainEqual({ kind: 'invalid-phash', publicId: 'a1' });
  });
});

describe('unpublishableProductSlugs', () => {
  it('returns every seed product that lacks its own three photos', () => {
    const seed = buildCatalogSeed();
    const empty = manifest({});
    expect(unpublishableProductSlugs(seed, empty)).toHaveLength(seed.products.length);
  });
});
