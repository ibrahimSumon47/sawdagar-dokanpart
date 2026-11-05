import { Skeleton } from '@sd/ui';

export interface CategoryTilesSkeletonProps {
  /** Localised spoken label for the busy grid. */
  label: string;
  /** Number of placeholder tiles. Defaults to eight, matching the departments grid. */
  count?: number;
}

/**
 * Placeholder tiles for the department grid. Each tile reserves the 4:3 photograph and the
 * name row underneath, so the real photographs land on the same grid cells.
 */
export function CategoryTilesSkeleton({ label, count = 8 }: CategoryTilesSkeletonProps) {
  return (
    <ul
      role="status"
      aria-busy="true"
      aria-label={label}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="overflow-hidden rounded-sm border border-line bg-surface">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="flex items-baseline justify-between gap-2 p-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
        </li>
      ))}
    </ul>
  );
}
