import { cn } from '../../lib/cn';
import { Skeleton } from './Skeleton';

export interface SkeletonTextProps {
  lines?: number;
  /** Line width classes, cycled in order, so paragraphs do not look like blocks. */
  widths?: readonly string[];
  className?: string;
}

const defaultWidths = ['w-full', 'w-11/12', 'w-3/4'] as const;

/** Renders placeholder lines that follow the shape of a text block. */
export function SkeletonText({ lines = 2, widths = defaultWidths, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn('h-3.5', widths[index % widths.length])} />
      ))}
    </div>
  );
}
