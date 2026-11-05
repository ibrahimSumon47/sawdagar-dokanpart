import { Skeleton, SkeletonText } from '@sd/ui';
import { AdminSectionSkeleton } from '../AdminSection';

export interface ContentEditorSkeletonProps {
  /** Localised spoken label for the busy editor. */
  label: string;
}

/**
 * Stands in for the CMS editor: the bilingual field groups, the body editors and the publish
 * button, inside the admin page frame.
 */
export function ContentEditorSkeleton({ label }: ContentEditorSkeletonProps) {
  return (
    <AdminSectionSkeleton label={label}>
      <div className="space-y-6">
        {Array.from({ length: 2 }, (_, group) => (
          <section key={group} className="rounded-sm border border-line bg-surface p-5">
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, field) => (
                <div key={field}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-10 w-full rounded-sm" />
                </div>
              ))}
            </div>
            <SkeletonText className="mt-4" lines={4} />
          </section>
        ))}
        <Skeleton className="h-11 w-32 rounded-sm" />
      </div>
    </AdminSectionSkeleton>
  );
}
