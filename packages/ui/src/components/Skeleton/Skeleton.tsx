import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn';

export type SkeletonProps = ComponentProps<'div'>;

/** Renders a single shimmering block used to reserve space while data loads. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('sd-skeleton rounded-sm', className)} {...props} />;
}
