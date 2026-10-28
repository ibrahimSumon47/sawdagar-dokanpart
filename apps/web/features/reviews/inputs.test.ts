import { describe, expect, it } from 'vitest';
import { MAX_REVIEW_PHOTOS, reviewSchema } from './inputs';

const base = {
  orderItemId: '4d1c0f0e-5f5a-4e8b-9a52-3c5f0f3f9a11',
  rating: '5',
  title: 'Careful packing',
  body: 'The saree arrived folded in cloth and matched the photos exactly.',
  photos: [],
};

const photo = `data:image/jpeg;base64,${'A'.repeat(64)}`;

describe('reviewSchema', () => {
  it('accepts a complete review and coerces the rating', () => {
    const parsed = reviewSchema.safeParse(base);
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.rating).toBe(5);
  });

  it('rejects ratings outside one to five and short bodies', () => {
    expect(reviewSchema.safeParse({ ...base, rating: '0' }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...base, rating: '6' }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...base, body: 'Too short' }).success).toBe(false);
  });

  it('accepts bounded image data URLs and rejects other payloads', () => {
    expect(reviewSchema.safeParse({ ...base, photos: [photo] }).success).toBe(true);
    expect(reviewSchema.safeParse({ ...base, photos: ['https://example.com/a.jpg'] }).success).toBe(
      false,
    );
    expect(
      reviewSchema.safeParse({
        ...base,
        photos: Array.from({ length: MAX_REVIEW_PHOTOS + 1 }, () => photo),
      }).success,
    ).toBe(false);
  });
});
