import { expect, test } from '@playwright/test';

const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD;
const editorEmail = 'editor@demo.sawdagar.test';
const settingsPath = '/admin/cms/settings';

/** Signs in through the real form; the settings editor needs an editor session. */
async function signInAsEditor(page) {
  await page.goto(`/login?next=${encodeURIComponent(settingsPath)}`);
  await page.getByLabel('Email address').fill(editorEmail);
  await page.getByLabel('Password', { exact: true }).fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${settingsPath}$`));
}

/** Polls the storefront until it does or does not carry the text, inside the 60 second budget. */
async function storefrontHasText(page, text, shouldShow, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const body = (await page.locator('body').textContent()) ?? '';
    if (body.includes(text) === shouldShow) return true;
    await page.waitForTimeout(2_000);
  }
  return false;
}

test.describe('R5 site settings', () => {
  test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is not set for this run.');

  test('an editor switches on the announcement and the storefront and policies page follow', async ({
    page,
  }, testInfo) => {
    test.setTimeout(240_000);
    await signInAsEditor(page);

    const enabled = page.getByLabel('Show the announcement bar');
    const english = page.getByLabel('Announcement (English)', { exact: true });
    const address = page.getByLabel('Link address (optional)');
    const wasEnabled = await enabled.isChecked();
    const originalText = await english.inputValue();

    const stamp = Date.now().toString().slice(-6);
    const changedText = `Free delivery on orders over ৳2,000 (R5 ${stamp})`;

    await enabled.check();
    await english.fill(changedText);
    await address.fill('/policies');
    await page.getByRole('button', { name: 'Save settings' }).click();
    await expect(page.getByText('The settings were saved.')).toBeVisible();

    expect(await storefrontHasText(page, changedText, true)).toBe(true);
    const bar = page.getByRole('complementary', { name: 'Store announcement' });
    await expect(bar.getByRole('link', { name: changedText })).toHaveAttribute(
      'href',
      '/policies',
    );
    const screenshot = testInfo.outputPath('r5-settings-announcement.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach('r5-settings-announcement', { path: screenshot, contentType: 'image/png' });

    await page.getByRole('link', { name: changedText }).click();
    await expect(page).toHaveURL(/\/policies$/);
    await expect(page.getByRole('heading', { name: 'Policies', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Returns', exact: true })).toBeVisible();

    await page.goto(settingsPath);
    if (!wasEnabled) await enabled.uncheck();
    await english.fill(originalText);
    await page.getByRole('button', { name: 'Save settings' }).click();
    await expect(page.getByText('The settings were saved.')).toBeVisible();
    expect(await storefrontHasText(page, changedText, false)).toBe(true);
  });

  test('an editor adds a footer link and the storefront shows it', async ({ page }) => {
    test.setTimeout(240_000);
    await signInAsEditor(page);

    const footer = page.locator('section').filter({ hasText: 'Footer links' });
    const stamp = Date.now().toString().slice(-6);
    const label = `Order help (R5 ${stamp})`;

    await footer.getByRole('button', { name: 'Add link' }).click();
    const added = footer.locator('li').last();
    await added.getByLabel('Label (English)').fill(label);
    await added.getByLabel('Address').fill('/policies');
    await page.getByRole('button', { name: 'Save settings' }).click();
    await expect(page.getByText('The settings were saved.')).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: label })).toHaveAttribute('href', '/policies');

    await page.goto(settingsPath);
    const rows = footer.locator('li');
    await rows.last().getByRole('button', { name: 'Remove' }).click();
    await page.getByRole('button', { name: 'Save settings' }).click();
    await expect(page.getByText('The settings were saved.')).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: label })).toHaveCount(0);
  });
});
