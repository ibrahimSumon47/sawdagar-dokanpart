import { cn } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';

export interface AuditPagerProps {
  page: number;
  pageCount: number;
  copy: Dictionary['admin'];
}

/** Previous and next links for the audit log, with the current page. */
export function AuditPager({ page, pageCount, copy }: AuditPagerProps) {
  if (pageCount <= 1) return null;

  const linkClass =
    'inline-flex min-h-9 items-center rounded-sm border border-line px-3 text-sm text-ink hover:border-accent hover:text-accent';

  return (
    <nav aria-label={copy.auditPageLabel} className="flex items-center justify-between gap-3 pt-4">
      {page > 1 ? (
        <Link href={`/admin/audit?page=${page - 1}`} className={linkClass}>
          {copy.auditPrevious}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <p className={cn('text-sm tabular-nums text-ink-muted')}>
        {copy.auditPageLabel} {page} {copy.auditOf} {pageCount}
      </p>
      {page < pageCount ? (
        <Link href={`/admin/audit?page=${page + 1}`} className={linkClass}>
          {copy.auditNext}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
