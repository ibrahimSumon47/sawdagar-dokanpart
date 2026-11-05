import { HomeCatalogSkeleton } from '../../features/catalog/components/HomeCatalog';
import { HomeIntroSkeleton } from '../../features/home/components/HomeIntro';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

/** Matches the storefront home page: hero, delivery promises, departments, featured grid. */
export default async function HomeLoading() {
  const copy = getDictionary(await getLocale());

  return (
    <>
      <HomeIntroSkeleton label={copy.common.loadingLabel} />
      <HomeCatalogSkeleton
        categoriesLabel={copy.common.loadingLabel}
        productsLabel={copy.catalog.loading}
      />
    </>
  );
}
