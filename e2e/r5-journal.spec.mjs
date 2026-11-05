import { expect, test } from '@playwright/test';

const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD;
const editorEmail = 'editor@demo.sawdagar.test';
const potterySlug = 'dhamrai-pottery';
const potteryTitle = 'The potters of Dhamrai are firing again';
const potteryCoverId = 'sawdagar/products/pottery-dinner-set/2';
const seededTags = 'pottery, dhamrai, craft';

/** Signs in through the real form and lands on the requested admin page. */
async function signInAsEditor(page, path) {
  await page.goto(`/login?next=${encodeURIComponent(path)}`);
  await page.getByLabel('Email address').fill(editorEmail);
  await page.getByLabel('Password', { exact: true }).fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path.replaceAll('/', '\\/')}$`));
}

/** Opens one Journal entry in the admin editor from the content list. */
async function openJournalEntry(page, title) {
  await page.goto('/admin/content', { waitUntil: 'domcontentloaded' });
  await page
    .getByRole('row')
    .filter({ hasText: title })
    .first()
    .getByRole('link', { name: 'Edit' })
    .click();
  await expect(page).toHaveURL(/\/admin\/content\/[^/]+$/);
}

test.describe('R5 Journal covers, tags and rich text', () => {
  test('the index shows covers and a tag narrows it', async ({ page }) => {
    await page.goto('/journal');
    await expect(page.getByRole('heading', { name: 'Journal', level: 1 })).toBeVisible();

    await expect(
      page.getByRole('img', { name: 'Clay mugs and bowls from a Dhamrai workshop' }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'A woven jamdani saree held up to the light' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(potteryTitle) })).toBeVisible();
    await expect(page.getByRole('link', { name: /What the winter market will carry/ })).toHaveCount(
      0,
    );

    const filters = page.getByRole('navigation', { name: 'Filter by tag' });
    await expect(filters.getByRole('link', { name: /^All posts/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await filters.getByRole('link', { name: /^jamdani/ }).click();
    await expect(page).toHaveURL(/\/journal\?tag=jamdani$/);
    await expect(
      page.getByRole('link', { name: /How to choose a jamdani without holding it/ }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(potteryTitle) })).toHaveCount(0);

    await page
      .getByRole('navigation', { name: 'Filter by tag' })
      .getByRole('link', { name: /^All posts/ })
      .click();
    await expect(page).toHaveURL(/\/journal$/);
    await expect(page.getByRole('link', { name: new RegExp(potteryTitle) })).toBeVisible();
  });

  test('an unknown tag shows the empty state', async ({ page }) => {
    await page.goto('/journal?tag=nothing-here');
    await expect(page.getByRole('heading', { name: 'No posts use that tag yet.' })).toBeVisible();
    await page
      .getByRole('navigation', { name: 'Filter by tag' })
      .getByRole('link', { name: /^All posts/ })
      .click();
    await expect(page).toHaveURL(/\/journal$/);
  });

  test('a post renders its cover, tags and rich body', async ({ page }) => {
    await page.goto(`/journal/${potterySlug}`);
    await expect(page.getByRole('heading', { name: potteryTitle, level: 1 })).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Clay mugs and bowls from a Dhamrai workshop' }),
    ).toBeVisible();

    const article = page.getByRole('article');
    expect(await article.locator('p').count()).toBeGreaterThanOrEqual(3);
    await expect(article).toContainText('Clay is the harder problem.');
    await expect(article).not.toContainText('<p>');

    const chips = article.getByRole('link', { name: 'Filter by tag: dhamrai' });
    await expect(chips).toBeVisible();
    await chips.click();
    await expect(page).toHaveURL(/\/journal\?tag=dhamrai$/);
    await expect(page.getByRole('link', { name: new RegExp(potteryTitle) })).toBeVisible();
  });

  test('the journal fits a phone, tablet and desktop', async ({ page }) => {
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/journal/${potterySlug}`);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `horizontal overflow at ${width}px`).toBe(false);
    }
  });

  test.describe('editor', () => {
    test.skip(!demoPassword, 'DEMO_ACCOUNT_PASSWORD is not set for this run.');

    test('an editor adds a tag, then restores the version that still has the cover', async ({
      page,
    }, testInfo) => {
      test.setTimeout(240_000);
      await signInAsEditor(page, '/admin/content');
      await openJournalEntry(page, potteryTitle);

      await expect(page.getByLabel('Cover image')).toHaveValue(potteryCoverId);
      await expect(page.getByRole('textbox', { name: 'English body' })).toBeVisible();

      // Saving the seeded tags first gives this run its own restore target, so a
      // repeated run finds the same version one step back instead of a stale snapshot.
      await page.getByLabel('Tags').fill(seededTags);
      await page.getByRole('button', { name: 'Save entry' }).click();
      await expect(page.getByText('The entry was saved.')).toBeVisible();

      await page.getByLabel('Tags').fill(`${seededTags}, kiln-check`);
      await page.getByRole('button', { name: 'Save entry' }).click();
      await expect(page.getByText('The entry was saved.')).toBeVisible();

      await page.goto('/journal?tag=kiln-check');
      await expect(page.getByRole('link', { name: new RegExp(potteryTitle) })).toBeVisible();

      const screenshot = testInfo.outputPath('r5-journal-tag.png');
      await page.screenshot({ path: screenshot, fullPage: true });
      await testInfo.attach('r5-journal-tag', { path: screenshot, contentType: 'image/png' });

      await openJournalEntry(page, potteryTitle);
      await expect(page.getByLabel('Tags')).toHaveValue(`${seededTags}, kiln-check`);

      const versions = page
        .getByRole('listitem')
        .filter({ has: page.getByRole('button', { name: 'Restore' }) });
      await versions.nth(1).getByRole('button', { name: 'Restore' }).click();
      await expect(page.getByText('The version was restored as a new edit.')).toBeVisible();
      await expect(page.getByLabel('Tags')).toHaveValue(seededTags);
      await expect(page.getByLabel('Cover image')).toHaveValue(potteryCoverId);

      await page.goto(`/journal/${potterySlug}`);
      await expect(
        page.getByRole('img', { name: 'Clay mugs and bowls from a Dhamrai workshop' }),
      ).toBeVisible();
      await expect(page.getByRole('link', { name: 'Filter by tag: dhamrai' })).toBeVisible();

      await page.goto('/journal?tag=kiln-check');
      await expect(page.getByRole('heading', { name: 'No posts use that tag yet.' })).toBeVisible();
    });
  });
});
