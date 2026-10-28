import { Skeleton } from '@sd/ui';

/** Matches the product page: breadcrumb, media panel, summary, variant cards. */
export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8" aria-busy="true">
      <Skeleton className="h-4 w-2/3 max-w-lg" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <Skeleton className="aspect-square rounded-sm sm:aspect-[4/5]" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-11 w-64" />
          <div className="grid gap-2 pt-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-20 rounded-sm" />
            ))}
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
