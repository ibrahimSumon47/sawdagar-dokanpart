import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  type ImageManifestProblem,
  type ProductImageManifest,
  validateImageManifest,
} from '../../packages/domain/src/catalog/productImages';

/**
 * Fails the build when the committed product photo manifest breaks an image
 * rule: duplicate Cloudinary IDs, near-duplicate photos, duplicate alt text,
 * malformed hashes or a subcategory with fewer than three photos. Subcategories
 * that are short are reported as warnings, because their products are kept
 * unpublished rather than filled with a reused photo.
 */
const manifestPath = fileURLToPath(
  new URL('../../packages/seed/images/manifest.json', import.meta.url),
);

function describe(problem: ImageManifestProblem): string {
  switch (problem.kind) {
    case 'too-few-images':
      return `${problem.subcategory}: only ${problem.count} photo(s), needs 3`;
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
  }
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ProductImageManifest;
const problems = validateImageManifest(manifest);
const shortSubcategories = problems.filter((problem) => problem.kind === 'too-few-images');
const failures = problems.filter((problem) => problem.kind !== 'too-few-images');

for (const problem of shortSubcategories) {
  console.warn(`warning: ${describe(problem)}`);
}

if (failures.length > 0) {
  for (const problem of failures) console.error(`error: ${describe(problem)}`);
  console.error(`Image check failed with ${failures.length} problem(s).`);
  process.exit(1);
}

console.log(
  `Image check passed: ${Object.values(manifest.subcategories).flat().length} photos, ` +
    `${shortSubcategories.length} short subcategor(ies) left unpublished.`,
);
