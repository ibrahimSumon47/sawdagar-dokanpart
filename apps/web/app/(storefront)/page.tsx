import type { Metadata } from 'next';
import { HomeCatalog } from '../../features/catalog/components/HomeCatalog';
import { getCatalogCategories, getFeaturedProducts } from '../../features/catalog/queries';
import { getPublishedSections } from '../../features/content/sectionQueries';
import { HomeBanners } from '../../features/home/components/HomeBanners';
import { HomeIntro } from '../../features/home/components/HomeIntro';
import { homeHeroContent } from '../../features/home/heroContent';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/** Storefront introduction with departments and four featured products. */
export default async function HomePage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const [categories, featured, sections] = await Promise.all([
    getCatalogCategories(),
    getFeaturedProducts(4),
    getPublishedSections(),
  ]);
  const hero = homeHeroContent(
    sections.find((section) => section.kind === 'hero') ?? null,
    copy,
    locale,
  );
  const banners = sections.filter((section) => section.kind === 'banner');
  const collections = sections.find((section) => section.kind === 'collections');

  return (
    <>
      <HomeIntro copy={copy} locale={locale} hero={hero} />
      <HomeBanners banners={banners} locale={locale} />
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
    </>
  );
}
