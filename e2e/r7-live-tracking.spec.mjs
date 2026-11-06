import { expect, test } from '@playwright/test';

const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD ?? '';
const buyerEmail = 'buyer@demo.sawdagar.test';
const vendorEmail = 'vendor@demo.sawdagar.test';
const orderNumber = 'SD-20261027-410003';
const subOrderId = 'seed_order_seller_sub_1';
const orderPath = `/account/orders/${orderNumber}`;
const sellerPath = `/seller/orders/${subOrderId}`;
const liveDeadlineMs = 10_000;

/** Signs in through the normal login form and waits until the requested page loads. */
async function signIn(page, email, next) {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(next.replace(/[/.*+?^${}()|[\]\\]/g, '\\$&')));
}

/** Locates the timeline step, which is marked done with a bold label. */
function completedStep(page, label) {
  return page
    .getByRole('list', { name: 'Tracking', exact: true })
    .locator('p.font-semibold', { hasText: label });
}

test.describe('R7 live order tracking', () => {
  test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is required for the demo sign-in tests');

  test('a seller confirmation reaches the buyer order view within a few seconds', async ({
    browser,
  }) => {
    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();
    try {
      const buyerPage = await buyerContext.newPage();
      const sellerPage = await sellerContext.newPage();

      await signIn(buyerPage, buyerEmail, orderPath);
      await expect(buyerPage.getByRole('list', { name: 'Tracking', exact: true })).toBeVisible();
      await expect(buyerPage.getByText('Live', { exact: true })).toBeVisible();

      await signIn(sellerPage, vendorEmail, sellerPath);
      const markPacked = sellerPage.getByRole('button', { name: 'Mark packed', exact: true });
      await expect(markPacked).toBeVisible();

      const changedAt = Date.now();
      await markPacked.click();
      await expect(sellerPage).toHaveURL(/saved=1/);

      await expect(completedStep(buyerPage, 'Packed')).toBeVisible({
        timeout: liveDeadlineMs,
      });
      expect(Date.now() - changedAt).toBeLessThan(liveDeadlineMs);
    } finally {
      await buyerContext.close();
      await sellerContext.close();
    }
  });

  test('a wrong phone or email on the public tracker shows the generic message', async ({
    page,
  }) => {
    await page.goto('/track');
    await page.getByLabel('Order code', { exact: true }).fill(orderNumber);
    await page.getByLabel('Phone or email used at checkout', { exact: true }).fill('01700000000');
    await page.getByRole('button', { name: 'Track order', exact: true }).click();

    await expect(
      page.getByText("We couldn't find an order with those details.", { exact: true }),
    ).toBeVisible();
    await expect(page).not.toHaveURL(/\/track\/SD-/);
  });
});
