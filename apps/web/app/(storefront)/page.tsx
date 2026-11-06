import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomeCatalog, HomeCatalogSkeleton } from '../../features/catalog/components/HomeCatalog';
import { getCatalogCategories, getFeaturedProducts } from '../../features/catalog/queries';
import { getPublishedSections } from '../../features/content/sectionQueries';
import { HomeBanners } from '../../features/home/components/HomeBanners';
import { HomeIntro, HomeIntroSkeleton } from '../../features/home/components/HomeIntro';
import { homeHeroContent } from '../../features/home/heroContent';
import { getDictionary, type Locale } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * Storefront introduction. Each section awaits only its own data inside its own
 * Suspense boundary, so the hero can stream before the catalog queries finish.
 */
export default async function HomePage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);

  return (
    <>
      <Suspense fallback={<HomeIntroSkeleton label={copy.common.loadingLabel} />}>
        <HomeIntroSection locale={locale} copy={copy} />
      </Suspense>
      <Suspense fallback={null}>
        <HomeBannersSection locale={locale} />
      </Suspense>
      <Suspense
        fallback={
          <HomeCatalogSkeleton
            categoriesLabel={copy.common.loadingLabel}
            productsLabel={copy.catalog.loading}
          />
        }
      >
        <HomeCatalogSection locale={locale} copy={copy} />
      </Suspense>
    </>
  );
}

/** Loads the published hero and renders the introduction. */
async function HomeIntroSection({
  locale,
  copy,
}: {
  locale: Locale;
  copy: ReturnType<typeof getDictionary>;
}) {
  const sections = await getPublishedSections();
  const hero = homeHeroContent(
    sections.find((section) => section.kind === 'hero') ?? null,
    copy,
    locale,
  );
  return <HomeIntro copy={copy} locale={locale} hero={hero} />;
}

/** Loads the published banners and renders them under the introduction. */
async function HomeBannersSection({ locale }: { locale: Locale }) {
  const sections = await getPublishedSections();
  const banners = sections.filter((section) => section.kind === 'banner');
  return <HomeBanners banners={banners} locale={locale} />;
}

/** Loads departments, featured products and the collections heading. */
async function HomeCatalogSection({
  locale,
  copy,
}: {
  locale: Locale;
  copy: ReturnType<typeof getDictionary>;
}) {
  const [categories, featured, sections] = await Promise.all([
    getCatalogCategories(),
    getFeaturedProducts(4),
    getPublishedSections(),
  ]);
  const collections = sections.find((section) => section.kind === 'collections');

  return (
    <HomeCatalog
      categories={categories}
      featured={featured}
      locale={locale}
      copy={copy}
      collectionsHeading={
        collections
          ? {
              title: locale === 'bn' ? collections.titleBn : collections.titleEn,
              description: locale === 'bn' ? collections.bodyBn : collections.bodyEn,
            }
          : null
      }
    />
  );
}
