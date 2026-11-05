import { expect, test } from '@playwright/test';

const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD;
const editorEmail = 'editor@demo.sawdagar.test';

/** Signs in through the real form; every CMS test needs an editor session. */
async function signInAsEditor(page) {
  await page.goto('/login?next=%2Fadmin%2Fcms');
  await page.getByLabel('Email address').fill(editorEmail);
  await page.getByLabel('Password', { exact: true }).fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/cms$/);
}

/** Waits for the public home page to show new copy, polling inside the 60 second budget. */
async function homeShows(page, text, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const heading = await page.getByRole('heading', { level: 1 }).textContent();
    if (heading?.includes(text)) return true;
    await page.waitForTimeout(2_000);
  }
  return false;
}

test.describe('R5 CMS', () => {
  test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is not set for this run.');

  test('an editor changes the homepage hero and the storefront follows', async ({
    page,
  }, testInfo) => {
    test.setTimeout(180_000);
    await signInAsEditor(page);
    await expect(page.getByRole('heading', { name: 'CMS', exact: true })).toBeVisible();

    await page.getByRole('link', { name: /Homepage sections/ }).click();
    await expect(page).toHaveURL(/\/admin\/cms\/sections$/);
    await page.getByRole('link', { name: 'Edit', exact: true }).first().click();
    await expect(page).toHaveURL(/\/admin\/cms\/sections\/[^/]+$/);

    const titleField = page.getByLabel('English title', { exact: true });
    const originalTitle = await titleField.inputValue();
    const stamp = Date.now().toString().slice(-6);
    const changedTitle = `${originalTitle} (R5 ${stamp})`;

    await titleField.fill(changedTitle);
    await page.getByRole('button', { name: 'Save section' }).click();
    await expect(page.getByText('The section was saved.')).toBeVisible();

    expect(await homeShows(page, `(R5 ${stamp})`)).toBe(true);
    const screenshot = testInfo.outputPath('r5-home-hero-updated.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach('r5-home-hero-updated', { path: screenshot, contentType: 'image/png' });

    await page.goto('/admin/cms/sections');
    await page.getByRole('link', { name: 'Edit', exact: true }).first().click();
    await page.getByLabel('English title', { exact: true }).fill(originalTitle);
    await page.getByRole('button', { name: 'Save section' }).click();
    await expect(page.getByText('The section was saved.')).toBeVisible();
    expect(await homeShows(page, originalTitle)).toBe(true);
  });

  for (const width of [375, 768, 1440]) {
    test(`the CMS hub fits ${width}px`, async ({ page }, testInfo) => {
      await signInAsEditor(page);
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/admin/cms', '/admin/cms/sections']) {
        const response = await page.goto(path, { waitUntil: 'networkidle' });
        expect(response?.status()).toBe(200);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        const name = `r5${path.replaceAll('/', '-')}-${width}`;
        const screenshot = testInfo.outputPath(`${name}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        await testInfo.attach(name, { path: screenshot, contentType: 'image/png' });
      }
    });
  }
});
