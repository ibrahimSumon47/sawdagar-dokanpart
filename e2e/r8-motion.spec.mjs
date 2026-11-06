import { expect, test } from '@playwright/test';

/** Public pages whose animated elements must stop moving under reduced motion. */
const motionPath = '/design/motion';
const catalogPath = '/catalog';

/**
 * Returns the longest computed animation duration (seconds) across every element on
 * the page that declares an animation, so one slow element fails the check.
 */
async function longestAnimationSeconds(page) {
  return page.evaluate(() => {
    let longest = 0;
    for (const element of document.querySelectorAll('*')) {
      const style = getComputedStyle(element);
      if (style.animationName === 'none') continue;
      const seconds = Math.max(
        ...style.animationDuration.split(',').map((value) => Number.parseFloat(value) || 0),
      );
      longest = Math.max(longest, seconds);
    }
    return longest;
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('motion catalog animations are switched off', async ({ page }) => {
    await page.goto(motionPath);
    await expect(page.getByRole('heading', { level: 1, name: 'Motion' })).toBeVisible();
    expect(await longestAnimationSeconds(page)).toBeLessThanOrEqual(0.01);
  });

  test('product grid cards are visible without waiting for a scroll reveal', async ({ page }) => {
    await page.goto(catalogPath);
    const card = page.locator('.reveal-on-scroll').first();
    await expect(card).toBeAttached();
    expect(await longestAnimationSeconds(page)).toBeLessThanOrEqual(0.01);
    await expect(card).toHaveCSS('opacity', '1');
  });
});

test('the footer motion link is translated into Bangla', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'sd_locale', value: 'bn', url: baseURL }]);
  await page.goto(catalogPath);
  await expect(
    page.locator('footer').getByRole('link', { name: 'মোশন', exact: true }),
  ).toHaveAttribute('href', motionPath);
});

test('motion catalog is linked from the footer only', async ({ page }) => {
  await page.goto(catalogPath);
  const footerLink = page.locator('footer').getByRole('link', { name: 'Motion', exact: true });
  await expect(footerLink).toHaveAttribute('href', motionPath);
  await expect(
    page.locator('header').getByRole('link', { name: 'Motion', exact: true }),
  ).toHaveCount(0);
});
