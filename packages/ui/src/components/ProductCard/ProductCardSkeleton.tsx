import { Skeleton } from '../Skeleton/Skeleton';
import { SkeletonText } from '../Skeleton/SkeletonText';
import { cn } from '../../lib/cn';
import { productCardLayout } from './productCardLayout';

export interface ProductCardSkeletonProps {
  className?: string;
}

/** Reserves exactly the layout of {@link ProductCard} while product data loads. */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex flex-col', className)}
      data-layout={productCardLayout.id}
      data-media-aspect={productCardLayout.mediaAspect}
    >
      <Skeleton className={cn('rounded-sm', productCardLayout.mediaAspect)} />
      <div className={cn('flex flex-col pt-3', productCardLayout.bodyGap)}>
        <Skeleton className="h-3 w-1/3" />
        <SkeletonText lines={productCardLayout.titleLines} widths={['w-full', 'w-4/5']} />
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className={cn('w-20', productCardLayout.priceLineHeight)} />
      </div>
    </div>
  );
}
