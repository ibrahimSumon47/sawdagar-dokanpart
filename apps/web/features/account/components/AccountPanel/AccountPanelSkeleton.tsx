import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';

export interface AccountPanelSkeletonProps {
  /** Localised spoken label for the busy account page. */
  label: string;
}

/**
 * Stands in for the account overview: heading, tab row, identity card, then the profile form
 * and memberships side by side. Sized from the same layout constants as {@link AccountPanel}.
 */
export function AccountPanelSkeleton({ label }: AccountPanelSkeletonProps) {
  return (
    <div className={pageLayout.account} role="status" aria-busy="true" aria-label={label}>
      <header className="max-w-2xl">
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-3/4 max-w-lg" />
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-sm" />
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex flex-wrap items-center gap-4 rounded-sm border border-line bg-surface p-5">
          <Skeleton className="size-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-2 h-3.5 w-64 max-w-full" />
          </div>
          <Skeleton className="h-9 w-32 rounded-sm" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-sm border border-line bg-surface p-5 sm:p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-72 max-w-full" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-10 w-full rounded-sm" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-5 h-11 w-36 rounded-sm" />
          </section>
          <section className="h-fit rounded-sm border border-line bg-surface p-5">
            <Skeleton className="h-6 w-36" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-16 rounded-sm" />
              <Skeleton className="h-16 rounded-sm" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
