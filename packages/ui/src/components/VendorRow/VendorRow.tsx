import { BadgeCheck } from 'lucide-react';
import { cn } from '../../lib/cn';
import { RatingStars } from '../RatingStars/RatingStars';

export interface VendorRowProps {
  name: string;
  /** City or district the store ships from, for example "Tangail". */
  location: string;
  rating: number;
  reviewCount: number;
  ratingLabel: string;
  /** Preformatted follower or product count, for example "1,240 followers". */
  meta: string;
  verified?: boolean;
  className?: string;
}

/** Compact store summary used in vendor lists and the design gallery. */
export function VendorRow({
  name,
  location,
  rating,
  reviewCount,
  ratingLabel,
  meta,
  verified = false,
  className,
}: VendorRowProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');

  return (
    <article
      className={cn(
        'flex items-center gap-3 rounded-sm border border-line bg-surface p-3',
        className,
      )}
      data-layout="vendor-row"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-background font-serif text-sm text-accent"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-sm font-semibold text-ink">
          {name}
          {verified ? (
            <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-secondary" />
          ) : null}
        </p>
        <p className="truncate text-xs text-ink-muted">
          {location} · {meta}
        </p>
        <RatingStars
          rating={rating}
          reviewCount={reviewCount}
          label={ratingLabel}
          className="mt-1"
        />
      </div>
    </article>
  );
}
