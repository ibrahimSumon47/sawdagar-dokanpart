import Link from 'next/link';
import type { LocalisedName } from '@sd/domain';
import type { Dictionary, Locale } from '../../../../i18n';

export interface ProductBreadcrumbsProps {
  category: {
    slug: string;
    name: LocalisedName;
    parent?: { slug: string; name: LocalisedName };
  };
  productTitle: string;
  locale: Locale;
  copy: Dictionary['catalog'];
}

/** Home > Catalog > department > category > product. */
export function ProductBreadcrumbs({
  category,
  productTitle,
  locale,
  copy,
}: ProductBreadcrumbsProps) {
  return (
    <nav aria-label={copy.breadcrumbLabel} className="text-sm text-ink-muted">
      {/* One line, always. A wrapping breadcrumb changed height when the web font arrived and
          moved the whole product page by a row, which is the layout shift the R4 check found. */}
      <ol className="flex flex-nowrap items-center gap-x-2 overflow-hidden whitespace-nowrap">
        <li>
          <Link href="/" className="hover:text-accent">
            {copy.breadcrumbHome}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/catalog" className="hover:text-accent">
            {copy.breadcrumbCatalog}
          </Link>
        </li>
        {category.parent ? (
          <>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/catalog?category=${category.parent.slug}`}
                className="hover:text-accent"
              >
                {category.parent.name[locale]}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden="true">/</li>
        <li>
          <Link href={`/catalog?category=${category.slug}`} className="hover:text-accent">
            {category.name[locale]}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="min-w-0 truncate text-ink">
          {productTitle}
        </li>
      </ol>
    </nav>
  );
}
