import { HomeCatalog } from '../features/catalog/components/HomeCatalog';
import { getFeaturedProducts } from '../features/catalog/queries';
import { HomeIntro } from '../features/home/components/HomeIntro';
import { getDictionary } from '../i18n';
import { getLocale } from '../i18n/getLocale';

/** Storefront introduction with departments and four featured products. */
export default async function HomePage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const featured = await getFeaturedProducts(4);

  return (
    <>
      <HomeIntro copy={copy} />
      <HomeCatalog featured={featured} locale={locale} copy={copy} />
    </>
  );
}
