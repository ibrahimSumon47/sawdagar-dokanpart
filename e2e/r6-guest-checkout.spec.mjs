import { expect, test } from '@playwright/test';

const productPath = '/product/full-grain-leather-belt-black';
const guestPhone = '01711000777';

/** Builds a fresh email so each run creates its own guest order. */
function uniqueEmail() {
  return `guest-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.test`;
}

/** Fills the one-page guest checkout form with valid Bangladesh delivery details. */
async function fillGuestCheckout(page, email) {
  await page.locator('#checkout-email').fill(email);
  await page.getByLabel('Full name', { exact: true }).fill('Rahim Uddin');
  await page.getByLabel('Mobile number', { exact: true }).fill(guestPhone);
  await page.getByLabel('Division', { exact: true }).selectOption({ index: 1 });
  await page.getByLabel('District', { exact: true }).selectOption({ index: 1 });
  await page.getByLabel('Upazila', { exact: true }).selectOption({ index: 1 });
  await page.getByLabel('Postcode', { exact: true }).fill('1212');
  await page.getByLabel('Street address', { exact: true }).fill('House 12, Road 4');
  await page.getByLabel('Area (optional)', { exact: true }).fill('Mirpur 10');
}

test.describe('R6 guest checkout and confirmation', () => {
  test('a guest places an order, sees the code and skips the account prompt', async ({ page }) => {
    // The full flow (cart, one-page checkout, confirmation) can exceed the 30 s default.
    test.setTimeout(90_000);
    const email = uniqueEmail();

    await page.goto(productPath);
    // Stock is seeded at random, so pick the first size that is in stock. The picker
    // shows no stock text, so keep trying options until Add to cart becomes enabled.
    const addToCart = page.getByRole('button', { name: 'Add to cart', exact: true });
    const variantOptions = page.locator('label:has(input[type="radio"])');
    const optionCount = await variantOptions.count();
    for (let index = 0; index < optionCount; index += 1) {
      await variantOptions.nth(index).click();
      // A bounded probe: isEnabled waits for the locator to resolve, so an unbounded call on a
      // page that sold out would sit here until the test timeout instead of saying why.
      if (await addToCart.isEnabled({ timeout: 2_000 }).catch(() => false)) break;
    }
    await expect(addToCart).toBeEnabled();
    await addToCart.click();
    await expect(page.getByRole('button', { name: 'Added', exact: true })).toBeVisible();

    await page.goto('/checkout');
    await fillGuestCheckout(page, email);
    await page.getByRole('button', { name: 'Place order', exact: true }).click();

    await expect(page).toHaveURL(/\/order\/confirmed/);
    await expect(page.getByText(/SD-\d{6}-[A-Z0-9]{4}/).first()).toBeVisible();

    const dialog = page.getByRole('dialog', { name: 'Save this order to an account' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Continue as guest', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('link', { name: 'Track this order' })).toBeVisible();
  });

  test('the account link prefills the checkout email on register', async ({ page }) => {
    const email = uniqueEmail();
    await page.goto(`/register?email=${encodeURIComponent(email)}`);
    await expect(page.getByLabel('Email address')).toHaveValue(email);
  });
});
