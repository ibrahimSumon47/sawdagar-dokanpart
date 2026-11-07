/**
 * Rebuilds the committed image manifest from the curated product list.
 *
 * Only photos named by `curatedProducts` survive, in the order the products are
 * listed, one main photo each. Licence metadata and the perceptual hash come
 * from the previous manifest so nothing is invented; the CLIP score and the
 * review flag were recorded when the photo was checked by eye.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { curatedProducts } from '../../packages/domain/src/catalog/curatedProducts';
import type {
  ProductImageAsset,
  ProductImageManifest,
} from '../../packages/domain/src/catalog/productImages';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifestPath = path.join(root, 'packages/seed/images/manifest.json');
const current = JSON.parse(readFileSync(manifestPath, 'utf8')) as ProductImageManifest;
const known = new Map<string, ProductImageAsset>(
  Object.values(current.subcategories)
    .flat()
    .map((asset) => [asset.publicId, asset] as const),
);

/* Photos produced by the candidate workflow are not in the committed manifest
 * yet; their size, hash and licence metadata lives in candidates.json. */
const candidatesPath = path.join(root, 'packages', 'seed', 'images', 'candidates.json');
try {
  const candidates = JSON.parse(readFileSync(candidatesPath, 'utf8')) as ProductImageManifest;
  for (const asset of Object.values(candidates.subcategories).flat()) {
    if (!known.has(asset.publicId)) known.set(asset.publicId, asset);
  }
} catch {
  // No candidate run yet: the committed manifest is still the only source.
}

const subcategories: Record<string, ProductImageAsset[]> = {};
const used = new Set<string>();

for (const product of curatedProducts) {
  const asset = known.get(product.photo);
  if (!asset) throw new Error(`Photo ${product.photo} is not in the old manifest`);
  if (used.has(product.photo)) throw new Error(`Photo ${product.photo} is used by two products`);
  used.add(product.photo);
  const entry: ProductImageAsset = {
    ...asset,
    alt: product.shows,
    productMatch: true,
    reviewed: true,
    clipScore: product.clipScore,
  };
  subcategories[product.subcategory] = [...(subcategories[product.subcategory] ?? []), entry];
}

const manifest: ProductImageManifest & { reviewedAt: string } = {
  version: 3,
  enforced: true,
  reviewedAt: new Date().toISOString().slice(0, 10),
  subcategories,
};

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Manifest rebuilt: ${used.size} reviewed photos across ${Object.keys(subcategories).length} subcategories.`,
);
