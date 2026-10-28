import type { LocalisedName } from '@sd/domain';
import Link from 'next/link';
import type { Locale } from '../../../../i18n';
import { departmentPhoto } from '../../media';

export interface CategoryTile {
  slug: string;
  name: LocalisedName;
}

export interface CategoryTilesProps {
  categories: readonly CategoryTile[];
  locale: Locale;
}

/** Department grid with a licensed photograph per department. */
export function CategoryTiles({ categories, locale }: CategoryTilesProps) {
  const number = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB');

  return (
    <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, index) => {
        const photo = departmentPhoto(category.slug, category.slug);
        return (
          <li key={category.slug}>
            <Link
              href={`/catalog?category=${category.slug}`}
              className="group block overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {photo ? (
                <div className="aspect-[4/3] overflow-hidden bg-surface-elevated">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}
              <div className="flex items-baseline justify-between gap-2 p-3">
                <span className="font-serif text-base leading-tight text-ink transition-colors group-hover:text-accent">
                  {category.name[locale]}
                </span>
                <span className="text-xs tabular-nums text-ink-muted">
                  {number.format(index + 1).padStart(2, '0')}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
