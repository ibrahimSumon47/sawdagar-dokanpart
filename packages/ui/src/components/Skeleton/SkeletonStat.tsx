import { cn } from '../../lib/cn';
import { Skeleton } from './Skeleton';

export interface SkeletonStatProps {
  /** Extra classes that copy the grid item sizing of the real stat tile. */
  className?: string;
}

/**
 * Placeholder for one compact number tile. Used by the seller and admin dashboards
 * so their loading state keeps the same tile height and padding as the real tile.
 */
export function SkeletonStat({ className }: SkeletonStatProps) {
  return (
    <div className={cn('rounded-sm border border-line bg-surface p-4', className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-7 w-16" />
    </div>
  );
}
