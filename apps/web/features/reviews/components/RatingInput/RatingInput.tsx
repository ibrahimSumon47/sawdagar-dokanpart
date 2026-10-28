'use client';

import { cn } from '@sd/ui';
import { Star } from 'lucide-react';
import { useState } from 'react';

export interface RatingInputProps {
  /** Visible fieldset legend, for example "Rating". */
  label: string;
  /** Short instruction shown under the legend. */
  hint: string;
  /** Starts at five stars so the common case needs no click. */
  defaultValue?: number;
}

/** Five-star radio group used by the review form. */
export function RatingInput({ label, hint, defaultValue = 5 }: RatingInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <p id="review-rating-hint" className="mt-0.5 text-xs text-ink-muted">
        {hint}
      </p>
      <div className="mt-2 flex gap-1" aria-describedby="review-rating-hint">
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            className="cursor-pointer rounded-sm p-0.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
          >
            <input
              type="radio"
              name="rating"
              value={star}
              defaultChecked={star === defaultValue}
              onChange={() => setValue(star)}
              className="sr-only"
            />
            <Star
              aria-hidden="true"
              className={cn('size-7', star <= value ? 'text-highlight' : 'text-line')}
            />
            <span className="sr-only">{star} / 5</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
