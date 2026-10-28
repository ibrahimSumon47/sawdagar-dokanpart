import { Button } from '@sd/ui';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import { catalogHref, type CatalogFilters } from '../../catalogQuery';

export interface CatalogSearchProps {
  filters: CatalogFilters;
  copy: Dictionary['catalog'];
}

/** GET search form; active facets travel in hidden fields so the search stays scoped. */
export function CatalogSearch({ filters, copy }: CatalogSearchProps) {
  const hidden: { name: string; value: string }[] = [];
  if (filters.category) hidden.push({ name: 'category', value: filters.category });
  if (filters.vendor) hidden.push({ name: 'vendor', value: filters.vendor });
  if (filters.minPrice !== undefined) {
    hidden.push({ name: 'minPrice', value: String(filters.minPrice) });
  }
  if (filters.maxPrice !== undefined) {
    hidden.push({ name: 'maxPrice', value: String(filters.maxPrice) });
  }
  if (filters.rating !== undefined) hidden.push({ name: 'rating', value: String(filters.rating) });
  if (filters.inStock) hidden.push({ name: 'inStock', value: '1' });
  if (filters.sort !== 'newest') hidden.push({ name: 'sort', value: filters.sort });

  return (
    <section aria-labelledby="catalog-search-title" className="mt-8">
      <h2 id="catalog-search-title" className="sr-only">
        {copy.searchTitle}
      </h2>
      <form action="/catalog" method="get" role="search" className="flex flex-wrap gap-2">
        {hidden.map((field) => (
          <input key={field.name} type="hidden" name={field.name} value={field.value} />
        ))}
        <label htmlFor="catalog-search" className="sr-only">
          {copy.searchTitle}
        </label>
        <input
          id="catalog-search"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder={copy.searchPlaceholder}
          className="min-h-11 min-w-0 flex-1 rounded-sm border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <Button type="submit" size="sm" className="min-h-11">
          <Search aria-hidden="true" className="size-4" />
          {copy.search}
        </Button>
        {filters.q ? (
          <Link
            href={catalogHref(filters, { q: '' })}
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
          >
            {copy.clearSearch}
          </Link>
        ) : null}
      </form>
    </section>
  );
}
