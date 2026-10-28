import { cn } from '../../lib/cn';
import { Skeleton } from '../Skeleton/Skeleton';

export interface VendorRowSkeletonProps {
  className?: string;
}

/** Reserves the same row shape as {@link VendorRow} while vendor data loads. */
export function VendorRowSkeleton({ className }: VendorRowSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex items-center gap-3 rounded-sm border border-line bg-surface p-3',
        className,
      )}
      data-layout="vendor-row"
    >
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
