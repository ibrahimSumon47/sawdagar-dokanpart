import { expect, test } from '@playwright/test';

for (const width of [375, 768, 1440]) {
  test(`R1 storefront navigation at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    const images = page.locator('main img');
    expect(await images.count()).toBeGreaterThan(0);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0))
        .toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const screenshot = testInfo.outputPath(`r1-home-${width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach(`r1-home-${width}`, { path: screenshot, contentType: 'image/png' });
    const header = page.locator('header');
    await expect(
      header.getByRole('button', { name: 'Categories', exact: true }).filter({ visible: true }),
    ).toBeVisible();
    await expect(
      header.getByRole('link', { name: 'Sell on Sawdagar' }).filter({ visible: true }),
    ).toBeVisible();
    await expect(
      header.getByRole('searchbox', { name: 'Search the catalog' }).filter({ visible: true }),
    ).toBeVisible();
    await expect(
      header.getByRole('link', { name: /design system|source code|github/i }),
    ).toHaveCount(0);
    await expect(page.getByText('Demo store, sandbox payments')).toHaveCount(0);
    await expect(
      page.locator('footer').getByText('Payments run in test mode. No real money is charged.'),
    ).toBeVisible();
    await expect(page.locator('footer').getByRole('navigation', { name: 'Project' })).toBeVisible();
    if (width < 1280) {
      await header.getByRole('button', { name: 'Open menu' }).click();
      await expect(header.getByRole('link', { name: 'Catalog', exact: true })).toBeVisible();
      await expect(header.getByRole('link', { name: 'Wishlist', exact: true })).toBeVisible();
      await header.getByRole('button', { name: 'Close menu' }).click();
    } else {
      await expect(header.getByRole('link', { name: 'Catalog', exact: true })).toBeVisible();
      await expect(header.getByRole('link', { name: 'Wishlist', exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
