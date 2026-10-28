import type { Category } from '@sd/domain';
import Link from 'next/link';
import type { Locale } from '../../../../i18n';

export interface CategoryTilesProps {
  categories: readonly Category[];
  locale: Locale;
}

/** Compact department grid; each tile opens the catalog filtered to that category. */
export function CategoryTiles({ categories, locale }: CategoryTilesProps) {
  return (
    <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, index) => (
        <li key={category.slug}>
          <Link
            href={`/catalog?category=${category.slug}`}
            className="group flex min-h-24 flex-col justify-between rounded-sm border border-line bg-surface p-4 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="text-xs tabular-nums text-ink-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-serif text-lg leading-tight text-ink transition-colors group-hover:text-accent">
              {category.name[locale]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
