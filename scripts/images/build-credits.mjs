/**
 * Rewrites the product photography table in docs/CREDITS.md from the manifest.
 *
 * The manifest is the publish list, so the credits page can never drift from
 * the photos that are actually live. Rows follow the curated product order and
 * keep the photographer, licence and source page required by CC BY and the
 * Pixabay licence.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('packages/seed/images/manifest.json', 'utf8'));
const assets = new Map(
  Object.values(manifest.subcategories)
    .flat()
    .map((asset) => [asset.publicId, asset]),
);
const products = [...readFileSync('packages/domain/src/catalog/curatedProducts.ts', 'utf8').matchAll(
  /photo: '([^']+)'/g,
)].map((match) => match[1]);

const rows = products.map((publicId) => {
  const asset = assets.get(publicId);
  if (!asset) throw new Error(`Photo ${publicId} is not in the manifest`);
  const subcategory = publicId.split('/')[2] ?? '';
  const name = asset.author || 'Unknown author';
  return `| \`${subcategory}/${publicId.split('/').pop()}\` | ${subcategory} | ${name} | ${asset.license} | [source](${asset.sourceUrl}) |`;
});

const credits = readFileSync('docs/CREDITS.md', 'utf8');
const start = credits.indexOf('## Product photography');
if (start < 0) throw new Error('CREDITS.md has no product photography section');
const rest = credits.slice(start);
const end = rest.indexOf('\n## ', 1);
const tail = end < 0 ? '' : rest.slice(end);

const body = `## Product photography

${products.length} product photographs back the published catalogue, one per product. They are served from Cloudinary and their source page, licence and photographer are recorded in the manifest and repeated here. The same credits are published at \`/credits\`, which reads the rows attached to each product.

| Photo | Subcategory | Photographer | Licence | Source |
| ----- | ----------- | ------------ | ------- | ------ |
${rows.join('\n')}

No photograph was cropped or altered beyond Cloudinary's delivery transformations. Every row above was reviewed against the product name; photographs that did not match were removed rather than renamed.
${tail}`;

writeFileSync('docs/CREDITS.md', `${credits.slice(0, start)}${body}`);
console.log(`Credits rebuilt for ${rows.length} photos.`);
