import type { RatingSummary } from '@sd/domain';
import type { Dictionary, Locale } from '../../../../i18n';
import type { ReviewRecord } from '../../queries';
import { ReviewCard } from '../ReviewCard';
import { ReviewSummary } from '../ReviewSummary';

export interface ProductReviewsProps {
  summary: RatingSummary;
  reviews: ReviewRecord[];
  copy: Dictionary['reviews'];
  locale: Locale;
}

/** Review summary and the latest published reviews on a product page. */
export function ProductReviews({ summary, reviews, copy, locale }: ProductReviewsProps) {
  return (
    <section aria-labelledby="product-reviews-title" className="mt-14">
      <h2 id="product-reviews-title" className="font-serif text-2xl text-ink">
        {copy.title}
      </h2>

      {reviews.length === 0 ? (
        <div className="mt-4 rounded-sm border border-dashed border-line bg-surface px-5 py-8">
          <h3 className="font-serif text-lg text-ink">{copy.none}</h3>
          <p className="mt-1 text-sm text-ink-muted">{copy.noneBody}</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 lg:grid-cols-[20rem_1fr] lg:gap-10">
          <ReviewSummary summary={summary} copy={copy} />
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} copy={copy} locale={locale} />
            ))}
            {summary.count > reviews.length ? (
              <p className="pt-4 text-xs text-ink-muted">{copy.basedOn(String(summary.count))}</p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
