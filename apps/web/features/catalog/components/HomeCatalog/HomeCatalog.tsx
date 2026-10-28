import { ButtonLink, SectionHeading } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { CatalogCategory, CatalogProduct } from '../../queries';
import { CategoryTiles } from '../CategoryTiles';
import { ProductGrid } from '../ProductGrid';

export interface HomeCatalogProps {
  categories: readonly CatalogCategory[];
  featured: readonly CatalogProduct[];
  locale: Locale;
  copy: Dictionary;
}

/** Home page catalog block: live departments followed by featured products. */
export function HomeCatalog({ categories, featured, locale, copy }: HomeCatalogProps) {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.catalog.eyebrow}
          title={copy.home.categoriesTitle}
          description={copy.home.categoriesDescription}
        />
        <div className="mt-6">
          <CategoryTiles categories={categories} locale={locale} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          title={copy.home.featuredTitle}
          description={copy.home.featuredDescription}
          action={
            <ButtonLink href="/catalog" variant="ghost">
              {copy.home.browseAll}
            </ButtonLink>
          }
        />
        <div className="mt-6">
          <ProductGrid products={featured} locale={locale} copy={copy.catalog} />
        </div>
      </section>
    </>
  );
}
