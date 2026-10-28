import type { Dictionary, Locale } from '../../../../i18n';
import type { ReviewModeration } from '../../reviewQueries';
import { ReviewModerationRow } from '../ReviewModerationRow';
import { StatTile } from '../StatTile';

export interface ReviewModerationListProps {
  moderation: ReviewModeration;
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Review counts and the newest reviews with their publish state. */
export function ReviewModerationList({ moderation, copy, locale }: ReviewModerationListProps) {
  const number = (value: number) =>
    new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB').format(value);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-md">
        <StatTile label={copy.publishedCount} value={number(moderation.published)} />
        <StatTile label={copy.hiddenCount} value={number(moderation.hidden)} />
      </div>
      {moderation.reviews.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
          {copy.noReviews}
        </p>
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-surface">
          {moderation.reviews.map((review) => (
            <ReviewModerationRow key={review.id} review={review} copy={copy} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
