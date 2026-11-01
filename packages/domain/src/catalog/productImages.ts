import type { CatalogSeed } from './seedTypes';

/** One licensed photograph, as recorded in the image manifest. */
export interface ProductImageAsset {
  /** Cloudinary public ID, unique across the whole manifest. */
  publicId: string;
  /** Page the photograph came from, so attribution can be checked. */
  sourceUrl: string;
  /** Licence name, for example `CC0` or `CC BY-SA 4.0`. */
  license: string;
  /** Photographer credited at `/credits`. */
  author: string;
  width: number;
  height: number;
  /** 64-bit perceptual hash as 16 hex characters, used for deduplication. */
  phash: string;
  /** Specific description of this photograph, never shared with another photo. */
  alt: string;
}

/**
 * The committed manifest the seed and the CI guard read. Photos are grouped by
 * leaf subcategory because the sourcing run searches per subcategory; each
 * product in that subcategory is then given its own consecutive set of photos.
 */
export interface ProductImageManifest {
  version: number;
  /**
   * When true, every product in the catalog seed that is published must have
   * its own three photos. It is flipped only after coverage is complete.
   */
  enforced: boolean;
  subcategories: Readonly<Record<string, readonly ProductImageAsset[]>>;
}

/** Two photographs closer than this Hamming distance are treated as the same picture. */
export const IMAGE_HASH_DISTANCE_MIN = 8;

/** A published product needs its own main photo and at least two gallery photos. */
export const PRODUCT_IMAGE_MIN_COUNT = 3;

/** The three photos a product owns: one main image and two gallery images. */
export interface ProductImageSet {
  productSlug: string;
  images: readonly ProductImageAsset[];
}

/** A rule violation the CI guard reports; each one blocks a catalog publish. */
export type ImageManifestProblem =
  | { kind: 'too-few-images'; subcategory: string; count: number }
  | { kind: 'duplicate-public-id'; publicId: string }
  | { kind: 'near-duplicate-hash'; distance: number; publicIds: [string, string] }
  | { kind: 'duplicate-alt'; alt: string; publicIds: string[] }
  | { kind: 'invalid-phash'; publicId: string }
  | { kind: 'empty-alt'; publicId: string };

/**
 * Counts the differing bits between two hexadecimal perceptual hashes.
 * Returns null when the inputs are not equal-length hexadecimal strings, so a
 * malformed hash is reported instead of silently comparing as identical.
 */
export function hammingDistanceHex(left: string, right: string): number | null {
  if (left.length === 0 || left.length !== right.length) return null;
  if (!/^[0-9a-f]+$/i.test(left) || !/^[0-9a-f]+$/i.test(right)) return null;

  let distance = 0;
  for (let index = 0; index < left.length; index += 1) {
    let xor = parseInt(left[index] as string, 16) ^ parseInt(right[index] as string, 16);
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}

/** Case- and whitespace-insensitive form used to compare alt text. */
export function normalizeAlt(alt: string): string {
  return alt.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Gives each product in a subcategory its own consecutive photos. Products are
 * taken in catalog order; a product whose three photos run out gets no set and
 * stays unpublished. No photo is ever handed to two products.
 */
export function assignProductImages(
  productSlugs: readonly string[],
  photos: readonly ProductImageAsset[],
): ProductImageSet[] {
  const sets: ProductImageSet[] = [];
  for (
    let index = 0;
    index + PRODUCT_IMAGE_MIN_COUNT <= photos.length;
    index += PRODUCT_IMAGE_MIN_COUNT
  ) {
    const productSlug = productSlugs[sets.length];
    if (productSlug === undefined) break;
    sets.push({ productSlug, images: photos.slice(index, index + PRODUCT_IMAGE_MIN_COUNT) });
  }
  return sets;
}

/**
 * Applies the image rules to the manifest in one pass: every subcategory must
 * hold enough photos for its products, no Cloudinary object may appear twice,
 * no two photographs may sit within `IMAGE_HASH_DISTANCE_MIN` bits of each
 * other, and no two photographs may share alt text. Photos are compared across
 * the whole manifest, not per subcategory, because two "different" products
 * photographing the same object is exactly the duplicate this rule catches.
 */
export function validateImageManifest(manifest: ProductImageManifest): ImageManifestProblem[] {
  const problems: ImageManifestProblem[] = [];
  const publicIdCount = new Map<string, number>();
  const altOwners = new Map<string, string[]>();
  const all: ProductImageAsset[] = [];

  for (const [subcategory, photos] of Object.entries(manifest.subcategories)) {
    if (photos.length < PRODUCT_IMAGE_MIN_COUNT) {
      problems.push({ kind: 'too-few-images', subcategory, count: photos.length });
    }

    for (const asset of photos) {
      all.push(asset);
      publicIdCount.set(asset.publicId, (publicIdCount.get(asset.publicId) ?? 0) + 1);

      const alt = normalizeAlt(asset.alt);
      if (alt.length === 0) {
        problems.push({ kind: 'empty-alt', publicId: asset.publicId });
      } else {
        altOwners.set(alt, [...(altOwners.get(alt) ?? []), asset.publicId]);
      }

      if (!/^[0-9a-f]{16}$/i.test(asset.phash)) {
        problems.push({ kind: 'invalid-phash', publicId: asset.publicId });
      }
    }
  }

  for (const [publicId, count] of publicIdCount) {
    if (count > 1) problems.push({ kind: 'duplicate-public-id', publicId });
  }

  for (const [alt, publicIds] of altOwners) {
    if (publicIds.length > 1) problems.push({ kind: 'duplicate-alt', alt, publicIds });
  }

  for (let left = 0; left < all.length; left += 1) {
    for (let right = left + 1; right < all.length; right += 1) {
      const first = all[left];
      const second = all[right];
      if (!first || !second) continue;
      const distance = hammingDistanceHex(first.phash, second.phash);
      if (distance !== null && distance < IMAGE_HASH_DISTANCE_MIN) {
        problems.push({
          kind: 'near-duplicate-hash',
          distance,
          publicIds: [first.publicId, second.publicId],
        });
      }
    }
  }

  return problems;
}

/**
 * Returns the product status the seed should write. A product is `active` only
 * when it has its own three photos; otherwise it is `draft`, so it cannot be
 * bought until photography exists. Products with no image set are never shown
 * with a photo borrowed from another product.
 */
export function publishStatusFor(
  productSlug: string,
  unpublishable: ReadonlySet<string>,
): 'active' | 'draft' {
  return unpublishable.has(productSlug) ? 'draft' : 'active';
}

/**
 * Gives every seed product that has its own three photos a set, keyed by slug.
 * The seed, the storefront and the CI guard all read this one mapping, so a
 * product never shows a photo that the publish rule did not assign to it.
 */
export function productImageSetsBySlug(
  seed: CatalogSeed,
  manifest: ProductImageManifest,
): Map<string, ProductImageSet> {
  const sets = new Map<string, ProductImageSet>();
  for (const subcategory of new Set(seed.products.map((product) => product.categorySlug))) {
    const productSlugs = seed.products
      .filter((product) => product.categorySlug === subcategory)
      .map((product) => product.slug);
    for (const set of assignProductImages(
      productSlugs,
      manifest.subcategories[subcategory] ?? [],
    )) {
      sets.set(set.productSlug, set);
    }
  }
  return sets;
}

/**
 * Product slugs in the seed that do not have their own three photos, so they
 * must be unpublished rather than shown with a photo reused from a sibling.
 */
export function unpublishableProductSlugs(
  seed: CatalogSeed,
  manifest: ProductImageManifest,
): string[] {
  const covered = productImageSetsBySlug(seed, manifest);
  return seed.products.map((product) => product.slug).filter((slug) => !covered.has(slug));
}
