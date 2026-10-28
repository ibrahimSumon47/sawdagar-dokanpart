import { ButtonLink, EmptyState } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { catalogHref, catalogResetHref, type CatalogFilters } from '../../catalogQuery';
import type { CatalogCategory, CatalogCategoryDetail, CatalogResult } from '../../queries';
import { CategoryNav } from '../CategoryNav';
import { CatalogFilters as FilterForm } from '../CatalogFilters';
import { CatalogSearch } from '../CatalogSearch';
import { Pagination } from '../Pagination';
import { ProductGrid, productGridLabels } from '../ProductGrid';

export interface CatalogViewProps {
  filters: CatalogFilters;
  categories: readonly CatalogCategory[];
  category: CatalogCategoryDetail | null;
  vendor: { name: string } | null;
  result: CatalogResult;
  copy: Dictionary;
  locale: Locale;
}

/** Full catalog page body shared by search, category and vendor views. */
export function CatalogView({
  filters,
  categories,
  category,
  vendor,
  result,
  copy,
  locale,
}: CatalogViewProps) {
  const title = category ? category.name[locale] : copy.catalog.title;
  const description = category ? category.description[locale] : copy.catalog.description;
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {copy.catalog.eyebrow}
        </p>
        <h1 className="mt-3 text-display font-serif leading-tight text-ink">{title}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{description}</p>
      </header>

      <CatalogSearch filters={filters} copy={copy.catalog} />
      <CategoryNav categories={categories} filters={filters} locale={locale} copy={copy.catalog} />

      {vendor ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
          <p className="text-ink">{copy.catalog.vendorFilter(vendor.name)}</p>
          <Link
            href={catalogHref(filters, { vendor: undefined })}
            className="font-medium text-accent underline decoration-accent/40 underline-offset-4"
          >
            {copy.catalog.clearVendor}
          </Link>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside aria-label={copy.catalog.filtersTitle} className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="mb-3 font-serif text-xl text-ink">{copy.catalog.filtersTitle}</h2>
          <FilterForm filters={filters} copy={copy.catalog} />
        </aside>

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
      </div>
    </div>
  );
}
