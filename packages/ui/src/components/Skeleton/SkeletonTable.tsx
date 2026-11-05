import { cn } from '../../lib/cn';
import { Skeleton } from './Skeleton';

export interface SkeletonTableProps {
  /** Number of placeholder body rows. Defaults to 5. */
  rows?: number;
  /** Number of placeholder columns. Defaults to 4. */
  columns?: number;
  /** Localised spoken label for the busy table, e.g. "Loading orders". */
  label: string;
  className?: string;
}

/**
 * Placeholder rows for the seller and admin tables. It renders a real table with the
 * same column widths and row height as the loaded table, so the swap does not move
 * the surrounding page.
 */
export function SkeletonTable({ rows = 5, columns = 4, label, className }: SkeletonTableProps) {
  const columnIndexes = Array.from({ length: columns }, (_, index) => index);
  const rowIndexes = Array.from({ length: rows }, (_, index) => index);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn('overflow-x-auto rounded-sm border border-line bg-surface', className)}
    >
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {columnIndexes.map((column) => (
              <th key={column} scope="col" className="px-4 py-3">
                <Skeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowIndexes.map((row) => (
            <tr key={row} className="border-b border-line/70 last:border-0">
              {columnIndexes.map((column) => (
                <td key={column} className="px-4 py-4">
                  <Skeleton className={column === 0 ? 'h-3.5 w-32' : 'h-3.5 w-20'} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
