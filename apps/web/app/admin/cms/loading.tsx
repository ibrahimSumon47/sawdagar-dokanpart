import { Skeleton } from '@sd/ui';
import { AdminSectionSkeleton } from '../../../features/admin/components/AdminSection';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

/** Matches the CMS home: section frame and three module cards. */
export default async function Loading() {
  const copy = getDictionary(await getLocale());

  return (
    <AdminSectionSkeleton label={copy.common.loadingLabel}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index} className="rounded-sm border border-line bg-surface p-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-4 h-4 w-16" />
          </li>
        ))}
      </ul>
    </AdminSectionSkeleton>
  );
}
