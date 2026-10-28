import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface RatingStarsProps {
  /** Average rating from 0 to 5. */
  rating: number;
  /** Number of reviews, shown next to the stars when provided. */
  reviewCount?: number;
  /** Full, localised description for assistive technology. */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

const starSize = {
  sm: 'size-3.5',
  md: 'size-4',
} as const;

/** Renders a five-star rating with a partially filled overlay. */
export function RatingStars({
  rating,
  reviewCount,
  label,
  size = 'sm',
  className,
}: RatingStarsProps) {
  const bounded = Math.min(5, Math.max(0, rating));
  const fillPercent = (bounded / 5) * 100;
  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star key={index} aria-hidden="true" className={cn('shrink-0', starSize[size])} />
  ));

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span role="img" aria-label={label} className="relative inline-flex">
        <span className="flex gap-0.5 text-line">{stars}</span>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-highlight"
          style={{ width: `${fillPercent}%` }}
        >
          {stars}
        </span>
      </span>
      {reviewCount !== undefined ? (
        <span aria-hidden="true" className="text-xs tabular-nums text-ink-muted">
          ({reviewCount})
        </span>
      ) : null}
    </span>
  );
}
