import { Badge, RatingStars } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ReviewRecord } from '../../queries';

export interface ReviewCardProps {
  review: ReviewRecord;
  copy: Dictionary['reviews'];
  locale: Locale;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
}

/** One published review with its stars, text and attached photos. */
export function ReviewCard({ review, copy, locale }: ReviewCardProps) {
  return (
    <article className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent"
        >
          {initials(review.authorName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-medium text-ink">{review.authorName}</p>
            {review.verified ? <Badge tone="success">{copy.verified}</Badge> : null}
            <span className="text-xs text-ink-muted">{formatDate(review.createdAt, locale)}</span>
          </div>
          <RatingStars
            rating={review.rating}
            label={copy.average(String(review.rating))}
            className="mt-1"
          />
          <h3 className="mt-2 font-medium text-ink">{review.title}</h3>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
            {review.body}
          </p>

          {review.photos.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {review.photos.map((photo, index) => (
                <li key={`${review.id}-${index}`}>
                  <span
                    role="img"
                    aria-label={copy.photo.replace('{index}', String(index + 1))}
                    className="block size-20 rounded-sm border border-line bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
