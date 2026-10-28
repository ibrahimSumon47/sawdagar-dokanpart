/** Lowest rating a review can carry. */
export const REVIEW_MIN_RATING = 1;

/** Highest rating a review can carry. */
export const REVIEW_MAX_RATING = 5;

/** Days after delivery in which a buyer may ask to return an item. */
export const RETURN_WINDOW_DAYS = 7;

export type RatingDistribution = Record<number, number>;

export interface RatingSummary {
  /** Mean rating rounded to one decimal place; zero when there are no reviews. */
  average: number;
  count: number;
  /** Count of reviews for each star from 1 to 5. */
  distribution: RatingDistribution;
}

/**
 * Turns raw star values into the average and the per-star counts a product page
 * needs. Missing stars count as zero so the bars keep a stable order.
 */
export function summariseRatings(ratings: readonly number[]): RatingSummary {
  const distribution: RatingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let total = 0;
  let count = 0;

  for (const rating of ratings) {
    if (!Number.isInteger(rating) || rating < REVIEW_MIN_RATING || rating > REVIEW_MAX_RATING) {
      continue;
    }
    distribution[rating] = (distribution[rating] ?? 0) + 1;
    total += rating;
    count += 1;
  }

  return {
    average: count === 0 ? 0 : Math.round((total / count) * 10) / 10,
    count,
    distribution,
  };
}

/**
 * A buyer may review one delivered line item, once. Ownership is checked
 * against the session before this rule runs; this only decides timing.
 */
export function isReviewable(subOrderStatus: string, alreadyReviewed: boolean): boolean {
  return subOrderStatus === 'delivered' && !alreadyReviewed;
}

/** The last instant at which a return request is still inside the window. */
export function returnWindowEndsAt(deliveredAt: Date): Date {
  return new Date(deliveredAt.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * A return can be requested for a delivered line item inside the seven-day
 * window, and only once per item.
 */
export function isReturnable(
  subOrderStatus: string,
  deliveredAt: Date | null,
  now: Date,
  alreadyRequested: boolean,
): boolean {
  if (subOrderStatus !== 'delivered' || alreadyRequested || !deliveredAt) return false;
  return now.getTime() <= returnWindowEndsAt(deliveredAt).getTime();
}
