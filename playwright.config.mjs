import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://sawdagar-dokanpart.vercel.app';
if (new URL(baseURL).protocol !== 'https:') {
  throw new Error('PLAYWRIGHT_BASE_URL must use HTTPS.');
}

/* Each width runs the whole suite. 375 px is a common phone, 768 px a tablet
 * and 1440 px a laptop; the layout breakpoints sit between them, so a bug that
 * only shows at one width is caught by its own project. */
const widths = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: { baseURL, browserName: 'chromium', screenshot: 'only-on-failure' },
  projects: widths.map(({ name, width, height }) => ({
    name,
    use: { viewport: { width, height } },
  })),
});
