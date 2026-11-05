import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';

export interface HomeIntroSkeletonProps {
  /** Localised spoken label, e.g. "Loading the storefront". */
  label: string;
}

/**
 * Stands in for the home hero and its three delivery promises while the catalog data
 * loads. It follows the same two-column grid and image ratio, so the hero does not jump
 * when the real copy arrives.
 */
export function HomeIntroSkeleton({ label }: HomeIntroSkeletonProps) {
  return (
    <>
      <section
        className={pageLayout.home}
        role="status"
        aria-busy="true"
        aria-label={label}
        data-skeleton="home-intro"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-4 h-16 w-full max-w-xl" />
            <Skeleton className="mt-3 h-16 w-4/5 max-w-lg" />
            <Skeleton className="mt-6 h-4 w-full max-w-xl" />
            <Skeleton className="mt-2 h-4 w-3/4 max-w-md" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-40 rounded-sm" />
              <Skeleton className="h-11 w-44 rounded-sm" />
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[5/4] lg:aspect-[4/5]">
            <Skeleton className="h-full w-full rounded-sm" />
            <div className="absolute inset-x-0 bottom-0 border-t border-line bg-surface/95 p-4">
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </section>

      <section className={pageLayout.sectionTight}>
        <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="bg-surface p-5">
              <Skeleton className="size-5 rounded-sm" />
              <Skeleton className="mt-3 h-4 w-28" />
              <Skeleton className="mt-2 h-3.5 w-full" />
              <Skeleton className="mt-1.5 h-3.5 w-2/3" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
