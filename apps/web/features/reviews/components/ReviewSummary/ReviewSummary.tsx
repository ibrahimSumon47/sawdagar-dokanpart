import { RatingStars } from '@sd/ui';
import type { RatingSummary as Summary } from '@sd/domain';
import type { Dictionary } from '../../../../i18n';

export interface ReviewSummaryProps {
  summary: Summary;
  copy: Dictionary['reviews'];
}

/** Average score and five distribution bars for one product. */
export function ReviewSummary({ summary, copy }: ReviewSummaryProps) {
  return (
    <div className="grid gap-5 rounded-sm border border-line bg-surface p-5 sm:grid-cols-[auto_1fr] sm:gap-8">
      <div>
        <p className="font-serif text-4xl text-ink">{summary.average.toFixed(1)}</p>
        <RatingStars
          rating={summary.average}
          label={copy.average(summary.average.toFixed(1))}
          size="md"
          className="mt-1"
        />
        <p className="mt-1 text-xs text-ink-muted">{copy.basedOn(String(summary.count))}</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {copy.distribution}
        </h3>
        <ul className="mt-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] ?? 0;
            const percent = summary.count === 0 ? 0 : Math.round((count / summary.count) * 100);
            return (
              <li key={star} className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="w-14 tabular-nums">{copy.stars(String(star))}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
                  <span
                    className="block h-full rounded-full bg-highlight"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-6 text-right tabular-nums">{count}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
