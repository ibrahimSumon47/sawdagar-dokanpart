import { Skeleton } from '@sd/ui';
import type { ReactNode } from 'react';
import { pageLayout } from '../../../shell/pageLayout';

export interface AdminSectionSkeletonProps {
  /** Localised spoken label for the busy admin page. */
  label: string;
  /** Placeholder panels that mirror the page content. */
  children: ReactNode;
}

/**
 * Stands in for the admin page frame: heading with its action buttons, section navigation and
 * content, sized from the same constants as {@link AdminSection}.
 */
export function AdminSectionSkeleton({ label, children }: AdminSectionSkeletonProps) {
  return (
    <div className={pageLayout.wide} role="status" aria-busy="true" aria-label={label}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header className="max-w-2xl">
          <Skeleton className="h-9 w-56 max-w-full" />
          <Skeleton className="mt-2 h-4 w-full max-w-lg" />
        </header>
        <Skeleton className="h-9 w-32 rounded-sm" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-sm" />
        ))}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
