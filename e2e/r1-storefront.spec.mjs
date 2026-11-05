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

const contentChecks = {
  en: {
    payments: 'Payment methods',
    paymentDetails:
      'The payment page does not collect card details or connect to a payment provider.',
    orderStatus: 'Checking your order status',
    deliveryDetails: 'Delivery dates and courier tracking are not available.',
    refundDetails: 'no payment is sent to an external provider',
    about: 'A bilingual marketplace for Bangladeshi sellers and shoppers.',
    contact: 'There is no support desk or phone number for this project.',
  },
  bn: {
    payments: 'পেমেন্ট পদ্ধতি',
    paymentDetails:
      'পেমেন্ট পাতায় কার্ডের তথ্য নেওয়া হয় না এবং কোনো পেমেন্ট সেবার সাথে সংযোগ করা হয় না।',
    orderStatus: 'অর্ডারের অবস্থা দেখবেন যেভাবে',
    deliveryDetails: 'ডেলিভারির তারিখ ও কুরিয়ার ট্র্যাকিং তথ্য দেওয়া হয় না।',
    refundDetails: 'বাইরের কোনো পেমেন্ট সেবায় টাকা পাঠানো হয় না।',
    about: 'বাংলাদেশের বিক্রেতা ও ক্রেতাদের জন্য দ্বিভাষিক একটি মার্কেটপ্লেস।',
    contact: 'এই প্রকল্পের কোনো সহায়তা ডেস্ক বা ফোন নম্বর নেই।',
  },
};

for (const [locale, copy] of Object.entries(contentChecks)) {
  test(`R1 published Help and pages copy in ${locale}`, async ({ page }) => {
    await page.goto('/help');
    await page.context().addCookies([{ name: 'sd_locale', value: locale, url: page.url() }]);
    await page.reload();
    await expect(page.locator('main')).toContainText(copy.payments);
    await expect(page.locator('main')).not.toContainText(/demo|sample|fictional|ডেমো|নমুনা/i);

    for (const [path, expected] of [
      ['/help/payments', copy.paymentDetails],
      ['/help/how-to-order', null],
      ['/help/delivery-times', copy.deliveryDetails],
      ['/help/returns-and-refunds', copy.refundDetails],
      ['/pages/about', copy.about],
      ['/pages/contact', copy.contact],
    ]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      const article = page.getByRole('article');
      await expect(article).not.toContainText(/demo|sample|fictional|ডেমো|নমুনা/i);
      if (expected) await expect(article).toContainText(expected);
      if (path === '/help/payments') {
        await expect(article.getByRole('heading', { level: 1 })).toHaveText(copy.payments);
        await expect(article).not.toContainText(/bKash|Nagad|বিকাশ|নগদ/i);
      }
      if (path === '/help/delivery-times') {
        await expect(article.getByRole('heading', { level: 1 })).toHaveText(copy.orderStatus);
      }
    }
  });
}
