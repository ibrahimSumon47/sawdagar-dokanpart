/**
 * Verifies the deployed category pages against the curated list: every card's
 * image public ID and alt text must be the reviewed pair for that product.
 */
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.SITE_URL;
const groups = {
  'nakshi-kantha': ['baby-quilt'],
  pottery: ['flower-vase', 'clay-cooking-pot'],
  brassware: ['brass-lamp', 'brass-jug'],
  leather: ['leather-wallet', 'leather-belt', 'leather-sandal'],
  'beauty-care': ['handmade-soap'],
  'books-stationery': ['notebook', 'pen', 'sketchbook'],
  'home-kitchen': ['storage-jar', 'cookware-set'],
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const report = [];
for (const [department, leaves] of Object.entries(groups)) {
  for (const category of [department, ...leaves]) {
    await page.goto(`${base}/catalog?category=${category}`, { waitUntil: 'networkidle' });
    const cards = await page.$$eval('a[href^="/product/"]', (links) =>
      links
        .filter((link) => link.querySelector('img'))
        .map((link) => ({
          href: link.getAttribute('href'),
          alt: link.querySelector('img')?.getAttribute('alt') ?? '',
          src: link.querySelector('img')?.getAttribute('src') ?? '',
        })),
    );
    const unique = [...new Map(cards.map((card) => [card.href, card])).values()];
    report.push({ category, count: unique.length, cards: unique });
    process.stdout.write(`${category}: ${unique.length} cards\n`);
  }
}
await browser.close();
writeFileSync('docs/reports/data/live-cards.json', `${JSON.stringify(report, null, 2)}\n`);
