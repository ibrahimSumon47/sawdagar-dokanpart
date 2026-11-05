import { Skeleton } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';
import type { ReactNode } from 'react';

export interface AccountSectionSkeletonProps {
  /** Localised spoken label for the busy account sub-page. */
  label: string;
  /** Optional placeholder panels that mirror the sub-page content. */
  children?: ReactNode;
}

/**
 * Stands in for the shared account sub-page frame: heading, tab row and content area, sized
 * from the same constants as {@link AccountSection}.
 */
export function AccountSectionSkeleton({ label, children }: AccountSectionSkeletonProps) {
  return (
    <div className={pageLayout.accountSection} role="status" aria-busy="true" aria-label={label}>
      <header className="max-w-2xl">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      </header>
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-sm" />
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {children ?? (
          <>
            <Skeleton className="h-24 rounded-sm" />
            <Skeleton className="h-56 rounded-sm" />
          </>
        )}
      </div>
    </div>
  );
}
