import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';

export interface ContentIndexSkeletonProps {
  /** Localised spoken label for the busy index page. */
  label: string;
}

/**
 * Stands in for the Help Center or Journal index: kicker, display heading, lead paragraph and
 * the two-column card grid with a pattern banner.
 */
export function ContentIndexSkeleton({ label }: ContentIndexSkeletonProps) {
  return (
    <div className={pageLayout.content} role="status" aria-busy="true" aria-label={label}>
      <header className="max-w-2xl">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-11 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-lg" />
      </header>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface"
          >
            <Skeleton className="h-24 rounded-none" />
            <div className="flex flex-1 flex-col p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-3.5 w-full" />
              <Skeleton className="mt-2 h-3.5 w-5/6" />
              <Skeleton className="mt-4 h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
