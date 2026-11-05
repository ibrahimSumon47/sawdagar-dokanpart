import { Skeleton, SkeletonText } from '@sd/ui';
import { pageLayout } from '../../../shell/pageLayout';

export interface ContentArticleSkeletonProps {
  /** Localised spoken label for the busy article. */
  label: string;
}

/**
 * Stands in for one Help Center article or Journal post: back link, pattern banner, title,
 * metadata, lead paragraph and the body text.
 */
export function ContentArticleSkeleton({ label }: ContentArticleSkeletonProps) {
  return (
    <article className={pageLayout.article} role="status" aria-busy="true" aria-label={label}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-6 h-32 rounded-sm" />
      <header className="mt-6">
        <Skeleton className="h-11 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-3 w-40" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      </header>
      <div className="mt-8 border-t border-line pt-8">
        <SkeletonText lines={8} />
      </div>
    </article>
  );
}
