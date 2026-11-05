import { Skeleton, SkeletonStat } from '@sd/ui';
import { AdminSectionSkeleton } from '../AdminSection';

export interface AdminPanelSkeletonProps {
  /** Localised spoken label for the busy overview. */
  label: string;
}

/**
 * Stands in for the admin overview: two count tiles, the grid of section links and the recent
 * activity list.
 */
export function AdminPanelSkeleton({ label }: AdminPanelSkeletonProps) {
  return (
    <AdminSectionSkeleton label={label}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonStat />
        <SkeletonStat />
      </div>

      <section className="mt-10">
        <Skeleton className="h-6 w-32" />
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="rounded-sm border border-line bg-surface p-4">
              <Skeleton className="h-4 w-32" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 rounded-sm" />
        <Skeleton className="h-16 rounded-sm" />
        <Skeleton className="h-16 rounded-sm" />
      </section>
    </AdminSectionSkeleton>
  );
}
