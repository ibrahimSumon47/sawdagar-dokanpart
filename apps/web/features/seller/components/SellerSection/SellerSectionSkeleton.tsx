import { Skeleton } from '@sd/ui';
import type { ReactNode } from 'react';
import { pageLayout } from '../../../shell/pageLayout';

export interface SellerSectionSkeletonProps {
  /** Localised spoken label for the busy Seller Center page. */
  label: string;
  /** Placeholder panels that mirror the page content. */
  children: ReactNode;
}

/**
 * Stands in for the Seller Center frame: heading, section tabs and content, using the same
 * container and spacing constants as {@link SellerSection}.
 */
export function SellerSectionSkeleton({ label, children }: SellerSectionSkeletonProps) {
  return (
    <div className={pageLayout.seller} role="status" aria-busy="true" aria-label={label}>
      <header className="max-w-2xl">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg" />
      </header>
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-sm" />
        ))}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
