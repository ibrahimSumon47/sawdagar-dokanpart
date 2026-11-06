import { use } from 'react';
import { EmptyState, ButtonLink } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { catalogResetHref, type CatalogFilters } from '../../catalogQuery';
import type { CatalogResult } from '../../queries';
import { Pagination } from '../Pagination';
import { ProductGrid, productGridLabels } from '../ProductGrid';

export interface CatalogResultsProps {
  filters: CatalogFilters;
  /** Search promise started by the page; read with `use()` so the header can stream first. */
  resultPromise: Promise<CatalogResult>;
  copy: Dictionary;
  locale: Locale;
}

/**
 * Result count, ranking note, product grid and pagination for one catalog query.
 * Rendered inside a Suspense boundary so the catalog header can paint before the
 * search finishes.
 */
export function CatalogResults({ filters, resultPromise, copy, locale }: CatalogResultsProps) {
  const result = use(resultPromise);
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');

  return (
    <section aria-live="polite">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm tabular-nums text-ink-muted">
          {copy.catalog.results(number.format(result.total))}
        </p>
        {filters.q ? (
          <p className="text-sm text-ink">{copy.catalog.matchesFor(filters.q)}</p>
        ) : null}
      </div>
      {result.searchEngine ? (
        <p className="mt-1 text-xs text-ink-muted">
          {result.searchEngine === 'wasm'
            ? copy.catalog.rankedByWasm
            : copy.catalog.rankedByFallback}
        </p>
      ) : null}

      <div className="mt-5">
        {result.products.length === 0 ? (
          <EmptyState
            title={copy.catalog.noResultsTitle}
            description={copy.catalog.noResultsBody}
            action={
              <ButtonLink href={catalogResetHref} variant="secondary">
                {copy.catalog.noResultsAction}
              </ButtonLink>
            }
          />
        ) : (
          <ProductGrid
            products={result.products}
            locale={locale}
            labels={productGridLabels(result.products, copy.catalog)}
          />
        )}
      </div>

      <Pagination
        filters={filters}
        page={result.page}
        pageCount={result.pageCount}
        locale={locale}
        copy={copy.catalog}
      />
    </section>
  );
}
