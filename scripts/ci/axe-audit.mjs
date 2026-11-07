#!/usr/bin/env node
/**
 * Accessibility audit of the deployed storefront with axe-core.
 *
 * Loads the home page, the catalog and one product at 375, 768 and 1440 px in both themes, injects
 * axe-core into each page and prints every violation with its rule, impact and first failing node.
 * Exits 1 when any rule fails, so the audit can be repeated by the owner with one command:
 *
 *   node scripts/ci/axe-audit.mjs https://sawdagar-dokanpart.vercel.app
 */
import { readdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const baseUrl = process.argv[2] ?? 'https://sawdagar-dokanpart.vercel.app';
const widths = [375, 768, 1440];
const themes = ['light', 'dark'];
const paths = ['/', '/catalog', '/product/handwoven-jamdani-saree-indigo'];
const axeDir = readdirSync('node_modules/.pnpm').find((entry) => entry.startsWith('axe-core@'));

if (!axeDir) {
  throw new Error('axe-core is not installed; run pnpm install first.');
}

const axePath = `node_modules/.pnpm/${axeDir}/node_modules/axe-core/axe.min.js`;

const browser = await chromium.launch();
const failures = [];

for (const width of widths) {
  for (const theme of themes) {
    for (const path of paths) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addCookies([
        { name: 'sd_theme', value: theme, url: baseUrl },
        { name: 'sd_locale', value: 'en', url: baseUrl },
      ]);
      const page = await context.newPage();
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'load' });
      // The storefront streams its content, so wait for the first real heading and a card before
      // auditing; an audit of the skeleton would report nothing and look like a pass.
      await page.waitForSelector('main h1', { timeout: 30_000 });
      await page.waitForSelector('main article, main li', { timeout: 30_000 });
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const result = await globalThis.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
        });
        return result.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
          target: violation.nodes[0]?.target?.join(' ') ?? '',
        }));
      });
      const label = `${path} ${width}px ${theme}`;
      if (violations.length === 0) {
        console.log(`PASS ${label}`);
      } else {
        failures.push({ label, violations });
        console.log(`FAIL ${label} ${JSON.stringify(violations)}`);
      }
      await context.close();
    }
  }
}

await browser.close();

if (failures.length > 0) {
  console.error(`\n${failures.length} page(s) failed the axe audit.`);
  process.exit(1);
}

console.log(
  `\naxe-core found no violations on ${widths.length * themes.length * paths.length} page loads.`,
);
