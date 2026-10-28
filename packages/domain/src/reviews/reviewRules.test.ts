import { describe, expect, it } from 'vitest';
import {
  RETURN_WINDOW_DAYS,
  isReturnable,
  isReviewable,
  returnWindowEndsAt,
  summariseRatings,
} from './reviewRules';

describe('summariseRatings', () => {
  it('averages ratings to one decimal place', () => {
    expect(summariseRatings([5, 4, 4, 3])).toEqual({
      average: 4,
      count: 4,
      distribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 1 },
    });
  });

  it('rounds a repeating average', () => {
    expect(summariseRatings([4, 5, 5]).average).toBe(4.7);
  });

  it('ignores out-of-range values and returns zero for an empty list', () => {
    expect(summariseRatings([0, 6, 2.5])).toEqual({
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  });
});

describe('isReviewable', () => {
  it('allows a delivered item that has no review', () => {
    expect(isReviewable('delivered', false)).toBe(true);
  });

  it('rejects an already reviewed item and an undelivered one', () => {
    expect(isReviewable('delivered', true)).toBe(false);
    expect(isReviewable('shipped', false)).toBe(false);
  });
});

describe('return rules', () => {
  const deliveredAt = new Date('2026-10-20T10:00:00Z');

  it('keeps the window open for seven days and closes it after', () => {
    expect(RETURN_WINDOW_DAYS).toBe(7);
    expect(returnWindowEndsAt(deliveredAt).toISOString()).toBe('2026-10-27T10:00:00.000Z');
    expect(isReturnable('delivered', deliveredAt, new Date('2026-10-27T09:59:00Z'), false)).toBe(
      true,
    );
    expect(isReturnable('delivered', deliveredAt, new Date('2026-10-27T10:01:00Z'), false)).toBe(
      false,
    );
  });

  it('rejects missing delivery dates, duplicates and undelivered items', () => {
    const now = new Date('2026-10-22T10:00:00Z');
    expect(isReturnable('delivered', null, now, false)).toBe(false);
    expect(isReturnable('delivered', deliveredAt, now, true)).toBe(false);
    expect(isReturnable('confirmed', deliveredAt, now, false)).toBe(false);
  });
});
