import type { Metadata } from 'next';
import { CatalogView } from '../../features/catalog/components/CatalogView';
import { parseCatalogFilters, type CatalogSearchParams } from '../../features/catalog/catalogQuery';
import {
  getCatalogCategories,
  getCatalogCategory,
  getCatalogVendor,
  searchCatalog,
} from '../../features/catalog/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return {
    title: copy.catalog.title,
    description: copy.catalog.description,
    alternates: { canonical: '/catalog' },
  };
}

interface CatalogPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

/** Catalog listing whose filters, search, sort and page all live in the URL. */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = parseCatalogFilters(await searchParams);
  const locale = await getLocale();
  const copy = getDictionary(locale);

  // The search is not awaited here: the page shell streams first and the results
  // arrive through the Suspense boundary inside CatalogView.
  const resultPromise = searchCatalog(filters);
  const [categories, category, vendor] = await Promise.all([
    getCatalogCategories(),
    filters.category ? getCatalogCategory(filters.category) : Promise.resolve(null),
    filters.vendor ? getCatalogVendor(filters.vendor) : Promise.resolve(null),
  ]);

  return (
    <CatalogView
      filters={filters}
      categories={categories}
      category={category}
      vendor={vendor}
      resultPromise={resultPromise}
      copy={copy}
      locale={locale}
    />
  );
}
