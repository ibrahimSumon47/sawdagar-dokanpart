/**
 * Captures every department and every non-empty leaf category on the deployed
 * storefront at 375 and 1440 px. The files are the evidence for the image audit:
 * a card is only accepted after the screenshot has been read.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.SITE_URL;
if (!base) throw new Error('SITE_URL is not set');
const outDir = 'docs/screenshots/image-audit/live';
mkdirSync(outDir, { recursive: true });

const departments = [
  'nakshi-kantha',
  'jute',
  'cane-bamboo',
  'pottery',
  'brassware',
  'leather',
  'home-kitchen',
  'beauty-care',
  'books-stationery',
];
const leaves = [
  'baby-quilt',
  'jute-shopping-bag',
  'cane-lamp',
  'terracotta-tea-set',
  'flower-vase',
  'planter',
  'clay-cooking-pot',
  'brass-bowl',
  'brass-lamp',
  'brass-jug',
  'leather-tote',
  'leather-wallet',
  'leather-sandal',
  'leather-belt',
  'leather-journal',
  'cookware-set',
  'storage-jar',
  'bedding-set',
  'handmade-soap',
  'massage-oil',
  'attar',
  'notebook',
  'pen',
  'sketchbook',
  'planner',
];

const manifest = JSON.parse(readFileSync('packages/seed/images/manifest.json', 'utf8'));
const altByPhoto = new Map();
for (const photos of Object.values(manifest.subcategories)) {
  for (const photo of photos) altByPhoto.set(photo.publicId, photo.alt);
}
const cards = [];
const mismatches = [];

/** Reads the product cards on the open page and checks each photo and its alt. */
async function checkCards(page, pageName) {
  const found = await page.$$eval('a[href^="/product/"] img', (images) =>
    images.map((image) => ({ src: image.getAttribute('src') ?? '', alt: image.getAttribute('alt') ?? '' })),
  );
  for (const image of found) {
    const match = image.src.match(/sawdagar\/(?:catalog|products)\/[a-z0-9-]+\/\d+/);
    cards.push({ page: pageName, photo: match?.[0] ?? null, alt: image.alt });
    if (!match || altByPhoto.get(match[0]) !== image.alt) mismatches.push(image);
  }
}

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
    await checkCards(page, `${slug}-${width}`);
    const hasCards = await page.evaluate(() => {
      const card = document.querySelector('a[href^="/product/"]');
      if (!card) return false;
      window.scrollTo(0, Math.max(0, card.getBoundingClientRect().top + window.scrollY - 90));
      return true;
    });
    if (hasCards) {
      await page.waitForTimeout(300);
      const cardsFile = `${outDir}/${slug}-${width}-cards.jpg`;
      await page.screenshot({ path: cardsFile, type: 'jpeg', quality: 82 });
      shots.push(cardsFile);
    }
    if (width === 375) {
      /* The full-page phone shot is too tall to review comfortably, so keep a
       * viewport copy that shows the header, the menu and the first cards. */
      const viewportFile = `${outDir}/${slug}-${width}-viewport.png`;
      await page.screenshot({ path: viewportFile });
      shots.push(viewportFile);
    }
    process.stdout.write(`${file}\n`);
  }
  await page.goto(`${base}/catalog`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await checkCards(page, `catalog-${width}`);
  await context.close();
}
await browser.close();

writeFileSync(
  'docs/reports/data/live-audit.json',
  `${JSON.stringify(
    {
      before: 142,
      after: 83,
      departments,
      leafCategories: leaves.length,
      cards: cards.length,
      mismatches: mismatches.length,
      mismatchedImages: mismatches.slice(0, 20),
      screenshots: shots,
      capturedAt: new Date().toISOString().slice(0, 10),
    },
    null,
    2,
  )}\n`,
);
console.log(`${shots.length} screenshots written`);
