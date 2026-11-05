import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../features/shell/pageLayout';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the Help Center: heading, category rail, search box and card grid. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <div
      className={pageLayout.content}
      role="status"
      aria-busy="true"
      aria-label={copy.common.loadingLabel}
    >
      <header className="max-w-2xl">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-11 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-lg" />
      </header>
      <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
        <div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-4 h-4 w-40" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-56 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
