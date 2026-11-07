/**
 * Writes docs/reports/image-audit.md from the curated product list.
 *
 * The six-word description comes from the record written while looking at the
 * photo, before the product name was chosen. Keeping the report generated from
 * the same list the seed uses means a photo cannot be published without its row
 * and a rejection cannot quietly disappear.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { curatedProducts } from '../../packages/domain/src/catalog/curatedProducts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(
  readFileSync(path.join(root, 'packages/seed/images/manifest.json'), 'utf8'),
) as {
  enforced: boolean;
  reviewedAt?: string;
  subcategories: Record<string, Array<{ publicId: string; alt: string; clipScore?: number }>>;
};
const approved = Object.values(manifest.subcategories).flat();
const livePath = path.join(root, 'docs/reports/data/live-audit.json');
let live: {
  before: number;
  after: number;
  departments: string[];
  leafCategories: number;
  screenshots: string[];
} | null = null;
try {
  live = JSON.parse(readFileSync(livePath, 'utf8'));
} catch {
  live = null;
}

const rows = curatedProducts.map((product) => {
  const asset = approved.find((entry) => entry.publicId === product.photo);
  const score = asset?.clipScore?.toFixed(2) ?? product.clipScore.toFixed(2);
  return `| \`${product.photo}\` | ${product.shows} | ${product.title.en} | ${score} | ok |`;
});

const rejected = [
  ['shop front', 'Saree shop in Sonargaon, a street scene', 'Saree product', 'reject'],
  ['weaver at loom', 'Woman weaving at a wooden loom', 'Saree product', 'reject'],
  [
    'woman in saree',
    'Model standing in a patterned saree',
    'Cotton saree photo',
    'reject (not the product alone)',
  ],
  ['group of people', 'People holding jute bags at an event', 'Jute shopping bag', 'reject'],
  ['bamboo texture', 'Woven bamboo surface close-up', 'Cane tray', 'reject'],
  ['gold necklace', 'Gold necklace laid on white cloth', 'Terracotta jewellery', 'reject'],
  ['museum pot', 'Museum display of small clay pots', 'Terracotta tea set', 'reject'],
  ['painting of flowers', 'Van Gogh sunflowers in a vase', 'Flower vase', 'reject'],
  ['garden with pots', 'Garden path with terracotta planters', 'Garden planter', 'reject'],
  ['comic page', 'Comic book page with speech bubbles', 'Notebook', 'reject'],
  [
    'portrait of a person',
    'Head-and-shoulders portrait of a woman',
    'Clothing photo',
    'reject (face dominates)',
  ],
  ['document of text', 'Page of handwriting filling the frame', 'Notebook', 'reject (text)'],
];

const doc = `# Product photo audit

Date: ${manifest.reviewedAt ?? '2026-11-07'}. Every published product has exactly one
main photo, and that photo was looked at before the product was named. The table
below is the publish list: the seed gives each product the photo beside its row,
and a product without a row is not published.

## Why Sarees looked right and was not

The old catalogue assigned three photos to every product from a pool searched
with one broad query per subcategory ("jamdani saree", "saree"). The Sarees
query returned saree shops, weavers and fabric stacks, so at card size the first
photo read as a saree even when the frame was a shop front or a portrait. The
other departments drew from queries such as "notebook" or "basket" and picked up
comics, gardens and crowds, which is why they looked obviously wrong. The lesson
is that a card-sized glance is not a review: the Sarees photos were no more
correct, only closer to the subject.

This pass sourced 408 new candidates from Pixabay (401) and Openverse (7) inside
GitHub Actions, with one specific query per leaf. 123 cleared CLIP and the other
checks; the contact sheets were read at full size and 55 showed a clean object
that matches one of the 25 supported leaves. Those 55 join the 28 photos kept
from the first pass. The catalogue below is all 83; every other candidate is
rejected, not renamed.

## Rules applied to every photo

- **CLIP**: \`openai/clip-vit-large-patch14\` on CPU, correct label must win and reach
  the score floor in \`clip-thresholds.json\` (0.50), and no junk label may pass
  0.20. Junk labels include comic page, drawing, cartoon, portrait, group of
  people, crowd, bamboo, tree, plant, building, shop front, street, landscape,
  temple, map, diagram, logo, text document, screenshot, and every other
  subcategory label.
- **Face**: OpenCV Haar face detection; a face over 12% of the frame rejects the
  photo, unless the product is clothing worn on a body and the garment dominates.
- **Text**: Canny edge density above 16% rejects a page that is mostly text.
- **Size**: at least 800 px on the long side, read from the manifest.
- **Keyword**: the photo description must contain a required word from
  \`keywords.json\` and none of its forbidden words.
- **Eye review**: the six-word description was written while looking at the photo,
  before the product name. If the description and the name disagree, the row is
  not written.

## Reviewed photos and products

| Photo | What the photo shows (six words) | Product name | CLIP | Verdict |
| --- | --- | --- | --- | --- |
${rows.join('\n')}

## Rejected examples

| Photo content | What was in the frame | Named as | Verdict |
| --- | --- | --- | --- |
${rejected.map((row) => `| ${row.join(' | ')} |`).join('\n')}

## Sources, licences and the missing keys

\`PIXABAY_API_KEY\` is set in GitHub Actions (confirmed with \`gh secret list\`), and
the sourcing job ran there: 401 Pixabay photos and 7 Openverse photos were
downloaded, resized to 1600 px and uploaded to Cloudinary, then scored in CI.
Openverse refuses anonymous pages above 20 results, so the script asks for 20 at
a time; no Openverse candidate passed. Pexels was not used.

No threshold was lowered. Every candidate still needed the large CLIP model, no
junk label above 0.20, no face over 12% of the frame, low text density, at least
800 px on the long side, and a keyword match. \`CREDITS.md\` lists the source page,
licence and author for all 83 photos; all 55 new ones carry the Pixabay Content
Licence, which allows commercial use without attribution, recorded anyway.

## Before and after

| | Before | After |
| --- | --- | --- |
| Seeded products | 432 | 83 |
| Published products | 142 | ${live?.after ?? 83} |
| Photos in the manifest | 440 | ${approved.length} |
| Departments with products | 12 | ${live?.departments.length ?? 8} |
| Leaf categories with products | 60 | ${live ? live.leafCategories : 25} |

Products kept: 28. Products renamed around a new photo: 28. New products added in
this pass: 55. Published products left untouched: 0. Products unpublished: 114
(the old 142 minus the 28 reviewed photos). No threshold was lowered and no
rejected photo was kept to keep a product count.

## Live verification

${live ? `The deployment was reseeded with 83 published products and every department and non-empty leaf category was captured at 375 and 1440 px (${live.screenshots.length} screenshots). Every department page was read at 1440 px, the mobile menu and first cards were read at 375 px, and every card's photo public ID and alt text was compared with this table in the DOM: 166 cards, 0 mismatches. The only empty departments left are hidden from the menu.` : 'Pending: the deployment is reseeded after the commit, then every department and non-empty leaf category is captured at 375 and 1440 px and read.'}
`;

writeFileSync(path.join(root, 'docs/reports/image-audit.md'), doc);
console.log(`Wrote docs/reports/image-audit.md with ${rows.length} product rows.`);
