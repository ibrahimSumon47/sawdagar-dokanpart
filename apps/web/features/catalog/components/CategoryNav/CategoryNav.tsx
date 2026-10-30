import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { catalogHref, type CatalogFilters } from '../../catalogQuery';
import type { CatalogCategory } from '../../queries';

export interface CategoryNavProps {
  categories: readonly CatalogCategory[];
  filters: CatalogFilters;
  locale: Locale;
  copy: Dictionary['catalog'];
}

const chipBase =
  'inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium transition-colors';

/** Browsable category chips; the leaf row appears when its department is active. */
export function CategoryNav({ categories, filters, locale, copy }: CategoryNavProps) {
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');
  const selected = categories.find(
    (category) =>
      category.slug === filters.category ||
      category.children.some((child) => child.slug === filters.category),
  );

  return (
    <nav aria-label={copy.categories} className="mt-6">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={catalogHref(filters, { category: undefined })}
          aria-current={filters.category ? undefined : 'page'}
          className={`${chipBase} ${
            filters.category
              ? 'border-line bg-surface text-ink-muted hover:border-accent hover:text-accent'
              : 'border-accent bg-accent text-accent-contrast'
          }`}
        >
          {copy.allCategories}
        </Link>
        {categories.map((category) => {
          const active = category.slug === filters.category || selected?.slug === category.slug;
          return (
            <Link
              key={category.slug}
              href={catalogHref(filters, { category: category.slug })}
              aria-current={active ? 'page' : undefined}
              className={`${chipBase} ${
                active
                  ? 'border-accent bg-accent text-accent-contrast'
                  : 'border-line bg-surface text-ink-muted hover:border-accent hover:text-accent'
              }`}
            >
              {category.name[locale]}
              <span className="text-xs">{number.format(category.productCount)}</span>
            </Link>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <Link
            href={catalogHref(filters, { category: selected.slug })}
            aria-current={filters.category === selected.slug ? 'page' : undefined}
            className={`text-sm font-medium ${
              filters.category === selected.slug
                ? 'text-accent'
                : 'text-ink-muted hover:text-accent'
            }`}
          >
            {copy.allCategories} · {selected.name[locale]}
          </Link>
          <span aria-hidden="true" className="text-line">
            /
          </span>
          {selected.children.map((child) => (
            <Link
              key={child.slug}
              href={catalogHref(filters, { category: child.slug })}
              aria-current={filters.category === child.slug ? 'page' : undefined}
              className={`rounded-sm px-1 py-0.5 text-sm ${
                filters.category === child.slug
                  ? 'font-semibold text-accent'
                  : 'text-ink-muted hover:text-accent'
              }`}
            >
              {child.name[locale]}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
