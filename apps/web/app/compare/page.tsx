import type { Metadata } from 'next';
import { CompareView } from '../../features/shop/components/CompareView';
import { getCompareIds, getCompareProducts } from '../../features/shop/queries';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.shop.compareTitle, description: copy.shop.compareDescription };
}

/** Up to four products from the comparison cookie, side by side. */
export default async function ComparePage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const products = await getCompareProducts(await getCompareIds());

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-serif text-title leading-tight text-ink">{copy.shop.compareTitle}</h1>
        <p className="mt-2 text-ink-muted">{copy.shop.compareDescription}</p>
      </header>
      <div className="mt-8">
        <CompareView
          products={products}
          locale={locale}
          labels={{
            title: copy.shop.compareTitle,
            remove: copy.shop.compareRemove,
            category: copy.shop.compareCategory,
            price: copy.shop.comparePrice,
            vendor: copy.shop.compareVendor,
            rating: copy.shop.compareRating,
            stock: copy.shop.compareStock,
            options: copy.shop.compareOptions,
            stockIn: copy.catalog.stockIn,
            stockLow: copy.catalog.stockLow,
            stockOut: copy.catalog.stockOut,
            ratingLabels: Object.fromEntries(
              products.map((product) => [
                product.id,
                copy.catalog.ratingLabel(product.rating.toFixed(1), product.reviewCount),
              ]),
            ),
          }}
        />
      </div>
    </div>
  );
}
