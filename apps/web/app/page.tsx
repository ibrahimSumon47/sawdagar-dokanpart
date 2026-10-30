import { HomeCatalog } from '../features/catalog/components/HomeCatalog';
import { getCatalogCategories, getFeaturedProducts } from '../features/catalog/queries';
import { HomeIntro } from '../features/home/components/HomeIntro';
import { getDictionary } from '../i18n';
import { getLocale } from '../i18n/getLocale';

/** Storefront introduction with departments and four featured products. */
export default async function HomePage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const [categories, featured] = await Promise.all([
    getCatalogCategories(),
    getFeaturedProducts(4),
  ]);

  return (
    <>
      <HomeIntro copy={copy} locale={locale} />
      <HomeCatalog categories={categories} featured={featured} locale={locale} copy={copy} />
    </>
  );
}
