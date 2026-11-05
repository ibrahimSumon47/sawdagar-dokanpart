import { ButtonLink, SectionHeading } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { pageLayout } from '../../../shell/pageLayout';
import type { CatalogCategory, CatalogProduct } from '../../queries';
import { CategoryTiles } from '../CategoryTiles';
import { ProductGrid, productGridLabels } from '../ProductGrid';

export interface HomeCatalogProps {
  categories: readonly CatalogCategory[];
  featured: readonly CatalogProduct[];
  locale: Locale;
  copy: Dictionary;
  /** Heading and description from the published collection teaser, when there is one. */
  collectionsHeading?: { title: string; description: string } | null;
}

/** Home page catalog block: live departments followed by featured products. */
export function HomeCatalog({
  categories,
  featured,
  locale,
  copy,
  collectionsHeading,
}: HomeCatalogProps) {
  return (
    <>
      <section className={pageLayout.section}>
        <SectionHeading
          eyebrow={copy.catalog.eyebrow}
          title={collectionsHeading?.title ?? copy.home.categoriesTitle}
          description={collectionsHeading?.description ?? copy.home.categoriesDescription}
        />
        <div className="mt-6">
          <CategoryTiles categories={categories} locale={locale} />
        </div>
      </section>

      <section className={pageLayout.sectionTight}>
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
          <ProductGrid
            products={featured}
            locale={locale}
            labels={productGridLabels(featured, copy.catalog)}
          />
        </div>
      </section>
    </>
  );
}
