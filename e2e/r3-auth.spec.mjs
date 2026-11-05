import { expect, test } from '@playwright/test';

const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD;
const demoEmail = 'buyer@demo.sawdagar.test';

for (const width of [375, 768, 1440]) {
  test(`R3 auth pages fit ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/login', '/register']) {
      const response = await page.goto(path, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const screenshot = testInfo.outputPath(`r3${path.replace('/', '-')}-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      await testInfo.attach(`r3${path.replace('/', '-')}-${width}`, {
        path: screenshot,
        contentType: 'image/png',
      });
    }
    await page.goto('/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  });
}

test('signed-out visitors are sent to the sign-in page', async ({ page }) => {
  await page.goto('/account/security');
  await expect(page).toHaveURL(/\/login\?/);
  await expect(page.getByLabel('Email address')).toBeVisible();
});

test('a wrong password reports a single, uninformative error', async ({ page }) => {
  test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is not set for this run.');
  await page.goto('/login');
  await page.getByLabel('Email address').fill(demoEmail);
  await page.getByLabel('Password', { exact: true }).fill('definitely-not-the-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Email or password is not correct.')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test('a seeded buyer signs in and sees the account page', async ({ page }) => {
  test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is not set for this run.');
  await page.goto('/login?next=%2Faccount');
  await page.getByLabel('Email address').fill(demoEmail);
  await page.getByLabel('Password', { exact: true }).fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole('heading', { name: 'Nusrat Jahan' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/account');
  await expect(page).toHaveURL(/\/login\?/);
});

test('registration creates a real account and asks for verification', async ({ page }) => {
  const stamp = Date.now().toString().slice(-9);
  const email = `r3-${stamp}@sawdagar.test`;
  const phone = `019${stamp}`;
  await page.goto('/register');
  await page.getByLabel('Full name').fill('R3 Check Account');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Mobile number').fill(phone);
  await page.getByLabel('Password', { exact: true }).fill('handloom-thread-2026');
  await page.getByLabel('Confirm password').fill('handloom-thread-2026');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/verify-email\?email=/);
  await expect(page.getByRole('status')).toContainText('not verified yet');
  await expect(page.getByText(email)).toBeVisible();
});
