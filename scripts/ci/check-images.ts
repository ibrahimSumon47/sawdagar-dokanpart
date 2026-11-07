import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  type ImageManifestProblem,
  type ProductImageManifest,
  validateImageManifest,
} from '../../packages/domain/src/catalog/productImages';
import { curatedProducts } from '../../packages/domain/src/catalog/curatedProducts';

/**
 * Fails the build unless every curated product has one reviewed main photo,
 * that photo carries a CLIP pass and a keyword pass, and no photo or alt text is
 * reused. The manifest is the publish list: a product that is not in it is not
 * active, so this check is what keeps a wrong picture off the storefront.
 */
const manifestPath = fileURLToPath(
  new URL('../../packages/seed/images/manifest.json', import.meta.url),
);
const keywordsPath = fileURLToPath(
  new URL('../../packages/seed/images/keywords.json', import.meta.url),
);
const thresholdsPath = fileURLToPath(
  new URL('../../packages/seed/images/clip-thresholds.json', import.meta.url),
);

function describe(problem: ImageManifestProblem): string {
  switch (problem.kind) {
    case 'too-few-images':
      return `${problem.subcategory}: only ${problem.count} photo(s), needs 1`;
    case 'duplicate-public-id':
      return `duplicate Cloudinary public ID ${problem.publicId}`;
    case 'near-duplicate-hash':
      return `near-duplicate photos ${problem.publicIds.join(' and ')} (distance ${problem.distance})`;
    case 'duplicate-alt':
      return `duplicate alt "${problem.alt}" on ${problem.publicIds.join(', ')}`;
    case 'invalid-phash':
      return `malformed perceptual hash on ${problem.publicId}`;
    case 'empty-alt':
      return `empty alt text on ${problem.publicId}`;
    case 'not-reviewed':
      return `${problem.publicId} is not marked reviewed and matched`;
    case 'low-clip-score':
      return `${problem.publicId} has a CLIP score of ${problem.score}, below the floor`;
    case 'no-product-match':
      return `${problem.publicId} is not matched to its product`;
  }
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ProductImageManifest;
const keywords = JSON.parse(readFileSync(keywordsPath, 'utf8')) as Record<
  string,
  { requiredAny: string[]; forbiddenAny: string[] }
>;
const thresholds = JSON.parse(readFileSync(thresholdsPath, 'utf8')) as { correctMin: number };

const problems = validateImageManifest(manifest);
if (!manifest.enforced) problems.push({ kind: 'no-product-match', publicId: 'manifest' });

const bySubcategory = new Map<string, string[]>();
for (const product of curatedProducts) {
  bySubcategory.set(product.subcategory, [
    ...(bySubcategory.get(product.subcategory) ?? []),
    product.photo,
  ]);
}

for (const [subcategory, photos] of bySubcategory) {
  const entries = manifest.subcategories[subcategory] ?? [];
  if (entries.length !== photos.length) {
    problems.push({ kind: 'too-few-images', subcategory, count: entries.length });
    continue;
  }
  for (const [index, entry] of entries.entries()) {
    if (entry.publicId !== photos[index]) {
      problems.push({ kind: 'no-product-match', publicId: entry.publicId });
    }
    const rule = keywords[subcategory];
    const text = `${entry.alt}`.toLowerCase();
    const required = rule?.requiredAny ?? [];
    if (required.length > 0 && !required.some((word) => text.includes(word))) {
      problems.push({ kind: 'no-product-match', publicId: entry.publicId });
    }
    if ((entry.clipScore ?? 0) < thresholds.correctMin) {
      problems.push({
        kind: 'low-clip-score',
        publicId: entry.publicId,
        score: entry.clipScore ?? 0,
      });
    }
    if (entry.reviewed !== true || entry.productMatch !== true) {
      problems.push({ kind: 'not-reviewed', publicId: entry.publicId });
    }
    const forbidden = rule?.forbiddenAny ?? [];
    if (forbidden.some((word) => text.includes(word))) {
      problems.push({ kind: 'no-product-match', publicId: entry.publicId });
    }
  }
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`error: ${describe(problem)}`);
  console.error(`Image check failed with ${problems.length} problem(s).`);
  process.exit(1);
}

console.log(
  `Image check passed: ${curatedProducts.length} products, each with one reviewed photo, ` +
    `a CLIP score at or above ${thresholds.correctMin} and a matching keyword rule. ` +
    `No duplicate photo, hash or alt text.`,
);
