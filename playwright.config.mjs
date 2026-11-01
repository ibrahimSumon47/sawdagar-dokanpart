import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://sawdagar-dokanpart.vercel.app';
if (new URL(baseURL).protocol !== 'https:') {
  throw new Error('PLAYWRIGHT_BASE_URL must use HTTPS.');
}

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: { baseURL, browserName: 'chromium', screenshot: 'only-on-failure' },
});
