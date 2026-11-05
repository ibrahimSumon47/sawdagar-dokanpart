import { Skeleton, SkeletonTable } from '@sd/ui';
import { SellerSectionSkeleton } from '../SellerSection';

export interface SellerTableSkeletonProps {
  /** Localised spoken label for the busy page. */
  label: string;
  /** Localised spoken label for the table. */
  tableLabel: string;
  /** Number of placeholder columns. Defaults to five. */
  columns?: number;
}

/**
 * Stands in for a Seller Center list page: the shared section frame, a filters row and the
 * table of rows. Used by inventory, orders, products, promotions, questions and returns.
 */
export function SellerTableSkeleton({ label, tableLabel, columns = 5 }: SellerTableSkeletonProps) {
  return (
    <SellerSectionSkeleton label={label}>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-48 rounded-sm" />
        <Skeleton className="h-9 w-32 rounded-sm" />
      </div>
      <div className="mt-4">
        <SkeletonTable label={tableLabel} columns={columns} rows={6} />
      </div>
    </SellerSectionSkeleton>
  );
}
