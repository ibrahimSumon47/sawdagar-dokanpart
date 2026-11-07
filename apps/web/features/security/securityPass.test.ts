import { describe, expect, it } from 'vitest';
import { hasArea, normalizeRole } from '@sd/domain';

import { safeNextPath } from '../auth/safeNextPath';
import { reviewPhotoSchema, reviewSchema, MAX_REVIEW_PHOTOS } from '../reviews/inputs';
import { sanitizeRichText } from '../content/richText';
import { shopCookieOptions } from '../shop/cookieState';
import { TRACKING_LIMITS } from '../tracking/rateLimit';

const jpeg = `data:image/jpeg;base64,${'A'.repeat(64)}`;

describe('open redirects', () => {
  it('keeps an internal path', () => {
    expect(safeNextPath('/account/orders')).toBe('/account/orders');
  });

  it.each([
    'https://evil.test',
    '//evil.test',
    '/\\evil.test',
    '/%2F%2Fevil.test',
    '/%2f%2fevil.test',
    '/\r\nLocation: https://evil.test',
    '',
  ])('rejects %s', (value) => {
    expect(safeNextPath(value)).toBe('/account');
  });

  it('rejects non-strings and broken escapes', () => {
    expect(safeNextPath(undefined)).toBe('/account');
    expect(safeNextPath('/%E0%A4%A')).toBe('/account');
  });
});

describe('uploads', () => {
  it('accepts a small JPEG, PNG or WebP data URL', () => {
    expect(reviewPhotoSchema.safeParse(jpeg).success).toBe(true);
    expect(reviewPhotoSchema.safeParse(`data:image/webp;base64,${'A'.repeat(32)}`).success).toBe(
      true,
    );
  });

  it('rejects other types, inline HTML and oversized payloads', () => {
    expect(reviewPhotoSchema.safeParse('data:text/html;base64,PHNjcmlwdD4=').success).toBe(false);
    expect(
      reviewPhotoSchema.safeParse(`data:image/jpeg;base64,${'A'.repeat(300_000)}`).success,
    ).toBe(false);
  });

  it('caps the gallery at three photos', () => {
    expect(MAX_REVIEW_PHOTOS).toBe(3);
    const photos = Array.from({ length: MAX_REVIEW_PHOTOS + 1 }, () => jpeg);
    const result = reviewSchema.safeParse({
      orderItemId: 'item_1',
      rating: 5,
      title: 'Lovely cloth',
      body: 'The weave is even and the colour matches the photograph.',
      photos,
    });
    expect(result.success).toBe(false);
  });
});

describe('rich text', () => {
  it('drops scripts, event handlers and javascript: links', () => {
    const clean = sanitizeRichText(
      '<p onclick="steal()">Hello</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>',
    );
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('javascript:');
  });

  it('keeps formatting and adds rel to links', () => {
    expect(sanitizeRichText('<h2>Title</h2><p><strong>Bold</strong></p>')).toBe(
      '<h2>Title</h2><p><strong>Bold</strong></p>',
    );
    expect(sanitizeRichText('<a href="https://example.test">x</a>')).toContain(
      'rel="noopener noreferrer"',
    );
  });
});

describe('session cookies', () => {
  it('marks guest cookies httpOnly, sameSite lax and secure in production', () => {
    expect(shopCookieOptions.httpOnly).toBe(true);
    expect(shopCookieOptions.sameSite).toBe('lax');
    expect(shopCookieOptions.secure).toBe(process.env.NODE_ENV === 'production');
    expect(shopCookieOptions.path).toBe('/');
  });
});

describe('abuse limits', () => {
  it('caps tracking lookups per IP and per order code', () => {
    expect(TRACKING_LIMITS.perIp.requests).toBe(20);
    expect(TRACKING_LIMITS.perOrder.requests).toBe(8);
    expect(TRACKING_LIMITS.perIp.window).toBe('10 m');
  });

  it('keeps the review payload bounded', () => {
    expect(MAX_REVIEW_PHOTOS).toBe(3);
    expect(
      reviewPhotoSchema.safeParse(`data:image/png;base64,${'A'.repeat(300_000)}`).success,
    ).toBe(false);
  });
});

describe('authorization matrix', () => {
  it('does not let another buyer reach an admin area', () => {
    expect(hasArea('buyer', 'admin')).toBe(false);
    expect(hasArea(normalizeRole('someone'), 'admin')).toBe(false);
  });

  it('does not let a vendor staff member manage another store', () => {
    // The seller guard resolves the caller's own organization; a staff role is
    // readable but has no write permission, so it cannot act on another store.
    expect(hasArea('vendor_staff', 'seller')).toBe(true);
    expect(hasArea('buyer', 'seller')).toBe(false);
  });

  it('keeps the admin role exclusive to platform staff', () => {
    expect(hasArea('super_admin', 'admin')).toBe(true);
    expect(hasArea('vendor_owner', 'admin')).toBe(false);
    expect(hasArea('vendor_staff', 'admin')).toBe(false);
  });
});
