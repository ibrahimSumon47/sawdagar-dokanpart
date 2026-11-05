import { Skeleton, SkeletonTable } from '@sd/ui';
import { AdminSectionSkeleton } from '../AdminSection';

export interface AdminTableSkeletonProps {
  /** Localised spoken label for the busy page. */
  label: string;
  /** Localised spoken label for the table. */
  tableLabel: string;
  /** Number of placeholder columns. Defaults to five. */
  columns?: number;
}

/**
 * Stands in for an admin list page: the section frame, a search row and the table. Used by the
 * audit trail, reviews, stores, feature flags, mail outbox and CMS list pages.
 */
export function AdminTableSkeleton({ label, tableLabel, columns = 5 }: AdminTableSkeletonProps) {
  return (
    <AdminSectionSkeleton label={label}>
      <Skeleton className="h-10 w-full max-w-md rounded-sm" />
      <div className="mt-4">
        <SkeletonTable label={tableLabel} columns={columns} rows={6} />
      </div>
    </AdminSectionSkeleton>
  );
}
