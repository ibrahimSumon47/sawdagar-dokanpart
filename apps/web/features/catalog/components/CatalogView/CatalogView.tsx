import { Suspense } from 'react';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { catalogHref, type CatalogFilters } from '../../catalogQuery';
import type { CatalogCategory, CatalogCategoryDetail, CatalogResult } from '../../queries';
import { pageLayout } from '../../../shell/pageLayout';
import { CategoryNav } from '../CategoryNav';
import { CatalogFilters as FilterForm } from '../CatalogFilters';
import { CatalogResults } from '../CatalogResults';
import { CatalogSearch } from '../CatalogSearch';
import { ProductGridSkeleton } from '../ProductGrid';

export interface CatalogViewProps {
  filters: CatalogFilters;
  categories: readonly CatalogCategory[];
  category: CatalogCategoryDetail | null;
  vendor: { name: string } | null;
  /** Pending search; the results stream in behind a Suspense boundary. */
  resultPromise: Promise<CatalogResult>;
  copy: Dictionary;
  locale: Locale;
}

/** Full catalog page body shared by search, category and vendor views. */
export function CatalogView({
  filters,
  categories,
  category,
  vendor,
  resultPromise,
  copy,
  locale,
}: CatalogViewProps) {
  const title = category ? category.name[locale] : copy.catalog.title;
  const description = category ? category.description[locale] : copy.catalog.description;

  return (
    <div className={pageLayout.catalog}>
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

        <Suspense fallback={<ProductGridSkeleton label={copy.catalog.loading} />}>
          <CatalogResults
            filters={filters}
            resultPromise={resultPromise}
            copy={copy}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
}
