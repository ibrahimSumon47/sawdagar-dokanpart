import { expect, test } from '@playwright/test';

const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD;
const editorEmail = 'editor@demo.sawdagar.test';

/** Signs in through the real form and lands on the requested admin page. */
async function signInAsEditor(page, path) {
  await page.goto(`/login?next=${encodeURIComponent(path)}`);
  await page.getByLabel('Email address').fill(editorEmail);
  await page.getByLabel('Password', { exact: true }).fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path.replaceAll('/', '\\/')}$`));
}

/** Reads "N of M readers found this helpful" back as two numbers. */
async function readVoteCounts(section) {
  const text = (await section.textContent()) ?? '';
  const match = text.match(/(\d+) of (\d+) readers found this helpful/);
  return match ? { helpful: Number(match[1]), total: Number(match[2]) } : { helpful: 0, total: 0 };
}

test.describe('R5 Help Center topics, search and votes', () => {
  test('a topic narrows the list and search finds an article', async ({ page }) => {
    await page.goto('/help');
    await expect(page.getByRole('heading', { name: 'Help Center', level: 1 })).toBeVisible();

    const topics = page.getByRole('navigation', { name: 'Topics' });
    await topics.getByRole('link', { name: /^Delivery/ }).click();
    await expect(page).toHaveURL(/\/help\?category=delivery$/);
    await expect(page.getByRole('link', { name: /Checking your order status/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Payment methods/ })).toHaveCount(0);

    const helpSearch = page.getByRole('search').filter({ hasText: 'Search help articles' });
    await page.getByLabel('Search help articles').fill('status');
    await helpSearch.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page).toHaveURL(/q=status/);
    await expect(page).toHaveURL(/category=delivery/);
    await expect(page.getByText('Results for “status”').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Checking your order status/ })).toBeVisible();

    await page.getByRole('link', { name: 'Clear filters' }).first().click();
    await expect(page).toHaveURL(/\/help$/);
    await expect(
      page.getByRole('link', { name: /How to order on Sawdagar Dokanpat/ }),
    ).toBeVisible();
  });

  test('a phrase with no match shows the empty state', async ({ page }) => {
    await page.goto('/help?q=zzzznothing');
    // Scope to the named region: the same copy also appears in the streamed RSC payload, so an
    // unscoped text locator resolves to more than one element on a slow connection.
    const empty = page.getByRole('region', { name: 'No articles match' });
    await expect(empty.getByRole('heading', { name: 'No articles match' })).toBeVisible();
    await expect(
      empty.getByText('Try another word, or browse a topic from the list.'),
    ).toBeVisible();
    await empty.getByRole('link', { name: 'Clear filters' }).click();
    await expect(page).toHaveURL(/\/help$/);
  });

  test('a reader votes an article helpful and can change the answer', async ({
    page,
  }, testInfo) => {
    await page.goto('/help/how-to-order');
    const section = page.getByRole('region', { name: 'Was this article helpful?' });
    await expect(section).toBeVisible();

    const before = await readVoteCounts(section);
    const yes = section.getByRole('button', { name: 'Yes', exact: true });
    const no = section.getByRole('button', { name: 'No', exact: true });

    await yes.click();
    await expect(section.getByRole('status')).toHaveText(
      'Thanks for helping us improve this article.',
    );
    await expect(yes).toHaveAttribute('aria-pressed', 'true');
    await expect(
      section.getByText(`${before.helpful + 1} of ${before.total + 1} readers`),
    ).toBeVisible();

    const screenshot = testInfo.outputPath('r5-help-vote.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach('r5-help-vote', { path: screenshot, contentType: 'image/png' });

    await no.click();
    await expect(section.getByRole('status')).toBeVisible();
    await expect(no).toHaveAttribute('aria-pressed', 'true');
    await expect(
      section.getByText(`${before.helpful} of ${before.total + 1} readers`),
    ).toBeVisible();

    await yes.click();
    await expect(yes).toHaveAttribute('aria-pressed', 'true');
    await expect(
      section.getByText(`${before.helpful + 1} of ${before.total + 1} readers`),
    ).toBeVisible();
  });

  test.describe('editor', () => {
    // These tests write to shared seeded topics, so they run one after another.
    test.describe.configure({ mode: 'serial' });
    test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is not set for this run.');

    test('an editor renames a topic through a version and the storefront follows', async ({
      page,
    }, testInfo) => {
      test.setTimeout(240_000);
      const stamp = Date.now().toString().slice(-6);
      const renamed = `Orders R5 ${stamp}`;

      await signInAsEditor(page, '/admin/cms/help');
      const ordersRow = page
        .getByRole('row')
        .filter({ has: page.getByText('orders', { exact: true }) });
      await ordersRow.getByRole('link').click();
      await expect(page).toHaveURL(/\/admin\/cms\/help\/[^/]+$/);

      await page.getByLabel('Name (English)').fill(renamed);
      await page.getByRole('button', { name: 'Save category' }).click();
      await expect(page.getByText('The category was saved.')).toBeVisible();
      // Earlier runs leave more versions behind, so check that a version row exists rather than a fixed number.
      await expect(page.getByText(/^Version \d+$/).first()).toBeVisible();

      await page.goto('/help');
      const topics = page.getByRole('navigation', { name: 'Topics' });
      await expect(topics.getByRole('link', { name: new RegExp(`^${renamed}`) })).toBeVisible();

      const screenshot = testInfo.outputPath('r5-help-category.png');
      await page.screenshot({ path: screenshot, fullPage: true });
      await testInfo.attach('r5-help-category', { path: screenshot, contentType: 'image/png' });

      await page.goBack();
      // Only the last 10 snapshots are kept, so restore the oldest one still listed.
      const oldestVersion = page.getByRole('listitem').filter({
        has: page.getByRole('button', { name: 'Restore' }),
      });
      await oldestVersion.last().getByRole('button', { name: 'Restore' }).click();
      await expect(page.getByText('The version was restored as a new edit.')).toBeVisible();
      await expect(page.getByLabel('Name (English)')).not.toHaveValue(renamed);

      await page.goto('/help');
      await expect(topics.getByRole('link', { name: /^Orders/ })).toBeVisible();
      await expect(topics.getByRole('link', { name: new RegExp(`^${renamed}`) })).toHaveCount(0);
    });

    test('an editor files an article under a topic and restores it', async ({ page }) => {
      test.setTimeout(240_000);
      await signInAsEditor(page, '/admin/content');

      const row = page
        .getByRole('row')
        .filter({ hasText: 'How to order on Sawdagar Dokanpat' })
        .first();
      await row.getByRole('link', { name: 'Edit' }).click();
      await expect(page).toHaveURL(/\/admin\/content\/[^/]+$/);

      const category = page.getByLabel('Help category');
      await expect(category).toHaveValue(/.+/);
      const original = await category.locator('option:checked').textContent();

      await category.selectOption({ label: 'Delivery' });
      await page.getByRole('button', { name: 'Save entry' }).click();
      await expect(page.getByText('The entry was saved.')).toBeVisible();

      await page.goto('/help?category=delivery');
      await expect(
        page.getByRole('link', { name: /How to order on Sawdagar Dokanpat/ }),
      ).toBeVisible();

      await page.goto('/admin/content', { waitUntil: 'domcontentloaded' });
      await page
        .getByRole('row')
        .filter({ hasText: 'How to order on Sawdagar Dokanpat' })
        .first()
        .getByRole('link', { name: 'Edit' })
        .click();
      await page.getByLabel('Help category').selectOption({ label: original.trim() });
      await page.getByRole('button', { name: 'Save entry' }).click();
      await expect(page.getByText('The entry was saved.')).toBeVisible();
      await expect(page.getByLabel('Help category')).toHaveValue(/.+/);
    });

    test('an editor reorders topics and the sidebar follows', async ({ page }) => {
      test.setTimeout(240_000);
      await signInAsEditor(page, '/admin/cms/help');

      // The rename test leaves the topic titled "Orders R5 <stamp>", so match the prefix.
      await page.getByRole('button', { name: /^Orders.*: move down$/ }).click();
      const rows = page.locator('tbody tr');
      await expect(rows.first()).toContainText('Delivery');

      await page.goto('/help');
      const links = page.getByRole('navigation', { name: 'Topics' }).getByRole('link');
      await expect(links.nth(1)).toContainText('Delivery');
      await expect(links.nth(2)).toContainText('Orders');

      await page.goto('/admin/cms/help');
      await page.getByRole('button', { name: /^Orders.*: move up$/ }).click();
      await expect(page.locator('tbody tr').first()).toContainText('Orders');
    });
  });
});
