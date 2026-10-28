import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { catalogHref, type CatalogFilters } from '../../catalogQuery';

export interface PaginationProps {
  filters: CatalogFilters;
  page: number;
  pageCount: number;
  locale: Locale;
  copy: Dictionary['catalog'];
}

const linkClass =
  'inline-flex min-h-10 items-center rounded-sm border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent';
const disabledClass =
  'inline-flex min-h-10 items-center rounded-sm border border-line bg-surface px-4 text-sm font-medium text-ink-muted opacity-50';

/** Prev/next pagination that keeps every active filter in the URL. */
export function Pagination({ filters, page, pageCount, locale, copy }: PaginationProps) {
  if (pageCount <= 1) return null;
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');

  return (
    <nav
      aria-label={copy.paginationLabel}
      className="mt-10 flex items-center justify-between gap-4"
    >
      {page > 1 ? (
        <Link href={catalogHref(filters, { page: page - 1 })} className={linkClass}>
          {copy.previous}
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          {copy.previous}
        </span>
      )}
      <p className="text-sm tabular-nums text-ink-muted">
        {copy.pageOf(number.format(page), number.format(pageCount))}
      </p>
      {page < pageCount ? (
        <Link href={catalogHref(filters, { page: page + 1 })} className={linkClass}>
          {copy.next}
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          {copy.next}
        </span>
      )}
    </nav>
  );
}
