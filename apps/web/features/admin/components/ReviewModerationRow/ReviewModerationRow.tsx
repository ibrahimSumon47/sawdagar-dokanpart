import { Badge, Button, RatingStars } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ModerationReview } from '../../reviewQueries';
import { moderateReviewAction } from '../../actions';

export interface ReviewModerationRowProps {
  review: ModerationReview;
  copy: Dictionary['admin'];
  locale: Locale;
}

/** One review with its product, author and publish or hide control. */
export function ReviewModerationRow({ review, copy, locale }: ReviewModerationRowProps) {
  const published = review.status === 'published';
  const title = locale === 'bn' ? review.productTitleBn : review.productTitleEn;

  return (
    <article className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RatingStars rating={review.rating} label={`${review.rating} / 5`} />
          <Badge tone={published ? 'success' : 'warning'}>
            {published ? copy.publishedCount : copy.hiddenCount}
          </Badge>
          <span className="text-xs text-ink-muted">{formatDate(review.createdAt, locale)}</span>
        </div>
        <h3 className="mt-1 font-semibold text-ink">{review.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-ink-muted">{review.body}</p>
        <p className="mt-2 text-xs text-ink-muted">
          {review.authorName} · {title}
        </p>
      </div>
      <form action={moderateReviewAction} className="self-start">
        <input type="hidden" name="reviewId" value={review.id} />
        <Button
          type="submit"
          name="decision"
          value={published ? 'hide' : 'publish'}
          variant="secondary"
          size="sm"
        >
          {published ? copy.hideReview : copy.publishReview}
        </Button>
      </form>
    </article>
  );
}
