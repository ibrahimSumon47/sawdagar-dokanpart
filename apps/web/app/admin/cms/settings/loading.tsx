import { Skeleton } from '@sd/ui';
import { AdminSectionSkeleton } from '../../../../features/admin/components/AdminSection';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

/** Matches the settings page: four form panels beside the history panel. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <AdminSectionSkeleton label={copy.common.loadingLabel}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-sm border border-line bg-surface p-4">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-2 h-4 w-full" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-sm border border-line bg-surface p-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-3 h-12 w-full" />
          <Skeleton className="mt-2 h-12 w-full" />
        </div>
      </div>
    </AdminSectionSkeleton>
  );
}
