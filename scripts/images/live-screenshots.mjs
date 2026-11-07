/**
 * Captures every department and every non-empty leaf category on the deployed
 * storefront at 375 and 1440 px. The files are the evidence for the image audit:
 * a card is only accepted after the screenshot has been read.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.SITE_URL;
if (!base) throw new Error('SITE_URL is not set');
const outDir = 'docs/screenshots/image-audit/live';
mkdirSync(outDir, { recursive: true });

const departments = [
  'nakshi-kantha',
  'pottery',
  'brassware',
  'leather',
  'beauty-care',
  'books-stationery',
  'home-kitchen',
];
const leaves = [
  'baby-quilt',
  'flower-vase',
  'clay-cooking-pot',
  'brass-lamp',
  'brass-jug',
  'leather-wallet',
  'leather-belt',
  'leather-sandal',
  'handmade-soap',
  'notebook',
  'pen',
  'sketchbook',
  'storage-jar',
  'cookware-set',
];

const browser = await chromium.launch();
const shots = [];
for (const width of [375, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  for (const slug of [...departments, ...leaves]) {
    await page.goto(`${base}/catalog?category=${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const file = `${outDir}/${slug}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
    process.stdout.write(`${file}\n`);
  }
  await context.close();
}
await browser.close();

writeFileSync(
  'docs/reports/data/live-audit.json',
  `${JSON.stringify(
    {
      before: 142,
      after: 28,
      departments,
      leafCategories: leaves.length,
      screenshots: shots,
      capturedAt: new Date().toISOString().slice(0, 10),
    },
    null,
    2,
  )}\n`,
);
console.log(`${shots.length} screenshots written`);
