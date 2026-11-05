import { expect, test } from '@playwright/test';

const CLS_BUDGET = 0.05;
const SLOW_NETWORK = { latency: 350, downloadThroughput: 51200, uploadThroughput: 25600 };
const STATIC_ROUTES = ['/', '/catalog', '/help', '/journal'];

/**
 * Reads the sitemap once so the run covers one product and one store page as well. Both paths come
 * from seeded data, so they exist on every deployment.
 */
async function resolveRoutes() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://sawdagar-dokanpart.vercel.app';
  const response = await fetch(`${baseURL}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`Sitemap request failed with ${response.status}.`);
  }
  const paths = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, loc]) => new URL(loc).pathname,
  );
  const product = paths.find((path) => path.startsWith('/product/'));
  const store = paths.find((path) => path.startsWith('/store/'));
  if (!product || !store) {
    throw new Error('The sitemap lists no product or store page.');
  }

  return [...STATIC_ROUTES, product, store];
}

/** Slows the connection so a streamed skeleton has time to paint before the data arrives. */
async function throttle(page) {
  const session = await page.context().newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.emulateNetworkConditions', { offline: false, ...SLOW_NETWORK });
}

/** Sums layout-shift entries that the browser did not attribute to a recent user input. */
async function trackLayoutShifts(page) {
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
}

/**
 * Next keeps the resolved fallback in the document but hides it, and the root boundary can put its
 * own skeleton before the route's, so the check reads the streamed HTML instead of trusting the
 * first skeleton element in the DOM.
 */
function expectSkeletonMarkup(html) {
  expect(html).toContain('data-skeleton=');
  expect(html).toMatch(/role="status"[^>]*aria-busy="true"/);
  expect(html).not.toMatch(/role="status"[^>]*aria-label=""/);
}

/**
 * Captures the loading frame, but only while the route really is still loading: a skeleton element
 * must be laid out and the page must not have rendered its heading yet. Streaming can finish before
 * the screenshot, and a shot of the loaded page labelled "skeleton" would be false evidence.
 */
async function captureSkeleton(page, testInfo, path) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const loading = await page
      .evaluate(() => {
        if (!document.querySelector('main') || document.querySelector('main h1')) {
          return false;
        }
        const skeletons = [...document.querySelectorAll('[data-skeleton]')];
        return skeletons.some((node) => node.getClientRects().length > 0);
      })
      .catch(() => false);
    if (loading) {
      const file = testInfo.outputPath(`r4-skeleton${path.replaceAll('/', '-')}.png`);
      await page.screenshot({ path: file });
      await testInfo.attach(`skeleton ${path}`, { path: file, contentType: 'image/png' });
      return true;
    }
    await page.waitForTimeout(100);
  }

  return false;
}

const routes = await resolveRoutes();

for (const path of routes) {
  test(`R4 ${path} streams its layout skeleton and settles without shifting`, async ({
    page,
    request,
  }, testInfo) => {
    const streamed = await request.get(path);
    expect(streamed.status()).toBe(200);
    expectSkeletonMarkup(await streamed.text());

    await page.setViewportSize({ width: 375, height: 900 });
    await trackLayoutShifts(page);
    await throttle(page);

    await page.goto(path, { waitUntil: 'commit' });

    await captureSkeleton(page, testInfo, path);

    await page.waitForLoadState('networkidle');
    await page.waitForFunction(
      () => document.querySelector('[data-skeleton]:not([hidden])') === null,
      null,
      {
        timeout: 20000,
      },
    );
    await expect(page.locator('h1').first()).toBeVisible();

    const loadedShot = testInfo.outputPath(`r4-loaded${path.replaceAll('/', '-')}.png`);
    await page.screenshot({ path: loadedShot, fullPage: true });
    await testInfo.attach(`loaded ${path}`, { path: loadedShot, contentType: 'image/png' });

    const cls = await page.evaluate(() => window.__cls ?? 0);
    expect(cls, `cumulative layout shift on ${path}`).toBeLessThan(CLS_BUDGET);
  });
}
