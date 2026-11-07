/**
 * Builds contact sheets for candidate product photos so a human (or the agent)
 * can look at the pixels instead of trusting a score. Cells are labelled with
 * the subcategory, the candidate index and the CLIP probability.
 *
 * Defaults fit the committed review; the sourcing workflow points the same
 * script at `candidates.json` and its score file through the environment.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const requireWeb = createRequire(path.join(root, 'apps', 'web', 'package.json'));
const sharp = requireWeb('sharp') as typeof import('sharp');

const manifestPath = path.resolve(
  root,
  process.env.MANIFEST_PATH ?? 'packages/seed/images/manifest.json',
);
const scoresPath = path.resolve(
  root,
  process.env.SCORES_PATH ?? 'docs/reports/data/clip-scores.json',
);
const outDir = path.resolve(
  root,
  process.env.SHEET_DIR ?? 'docs/screenshots/image-audit/candidates',
);
const prefix = process.env.SHEET_PREFIX ?? 'sheet';

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const scores = JSON.parse(readFileSync(scoresPath, 'utf8'));
const byId = new Map(scores.images.map((item: { publicId: string }) => [item.publicId, item]));

const cloud = process.env.CLOUDINARY_CLOUD_NAME ?? 'uapiw50d';
mkdirSync(outDir, { recursive: true });

const picked: Array<{ publicId: string; subcategory: string; index: number; score: number }> = [];
for (const [subcategory, photos] of Object.entries<Array<{ publicId: string }>>(
  manifest.subcategories,
)) {
  photos.forEach((photo, index) => {
    const score = byId.get(photo.publicId) as { pass?: boolean; correctProb?: number } | undefined;
    if (score?.pass) {
      picked.push({
        publicId: photo.publicId,
        subcategory,
        index: index + 1,
        score: score.correctProb ?? 0,
      });
    }
  });
}

const CELL = 380;
const COLS = 4;
const ROWS = 3;
const PER_SHEET = COLS * ROWS;

async function cell(entry: (typeof picked)[number]): Promise<Buffer> {
  const url = `https://res.cloudinary.com/${cloud}/image/upload/c_limit,w_512/${entry.publicId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${entry.publicId}: ${response.status}`);
  const image = await sharp(Buffer.from(await response.arrayBuffer()))
    .resize(CELL, CELL, { fit: 'cover' })
    .toBuffer();
  const label = `${entry.subcategory} #${entry.index} ${entry.score.toFixed(2)}`;
  const svg = Buffer.from(
    `<svg width="${CELL}" height="26"><rect width="100%" height="100%" fill="#000" opacity="0.72"/>` +
      `<text x="6" y="18" font-family="sans-serif" font-size="14" fill="#fff">${label}</text></svg>`,
  );
  return sharp({ create: { width: CELL, height: CELL + 26, channels: 3, background: '#111' } })
    .composite([
      { input: image, top: 0, left: 0 },
      { input: svg, top: CELL, left: 0 },
    ])
    .png()
    .toBuffer();
}

async function main(): Promise<void> {
  const sheets = Math.ceil(picked.length / PER_SHEET);
  for (let sheet = 0; sheet < sheets; sheet += 1) {
    const entries = picked.slice(sheet * PER_SHEET, (sheet + 1) * PER_SHEET);
    const cells = await Promise.all(entries.map((entry) => cell(entry)));
    const canvas = sharp({
      create: {
        width: CELL * COLS,
        height: (CELL + 26) * ROWS,
        channels: 3,
        background: '#f3efe6',
      },
    });
    const composite = cells.map((input, index) => ({
      input,
      top: Math.floor(index / COLS) * (CELL + 26),
      left: (index % COLS) * CELL,
    }));
    const file = `${outDir}/${prefix}-${String(sheet + 1).padStart(2, '0')}.png`;
    writeFileSync(file, await canvas.composite(composite).png().toBuffer());
    console.log(file, entries.map((entry) => `${entry.subcategory}#${entry.index}`).join(' '));
  }
  console.log(`${picked.length} photos on ${sheets} sheets`);
}

void main();
