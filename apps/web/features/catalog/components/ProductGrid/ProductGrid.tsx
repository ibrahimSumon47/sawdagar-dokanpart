import { ProductCard } from '@sd/ui';
import Link from 'next/link';
import type { Locale } from '../../../../i18n';
import type { CatalogProduct } from '../../queries';
import { WishlistButton } from '../../../shop/components/WishlistButton';

export interface ProductGridLabels {
  sale: string;
  soldOut: string;
  /** Precomputed rating descriptions, keyed by product id. */
  ratingLabels: Readonly<Record<string, string>>;
}

export interface ProductGridProps {
  products: readonly CatalogProduct[];
  locale: Locale;
  labels: ProductGridLabels;
}

/** Builds plain labels so the grid can also render inside a Client Component. */
export function productGridLabels(
  products: readonly CatalogProduct[],
  copy: {
    sale: string;
    stockOut: string;
    ratingLabel: (rating: string, count: number) => string;
  },
): ProductGridLabels {
  return {
    sale: copy.sale,
    soldOut: copy.stockOut,
    ratingLabels: Object.fromEntries(
      products.map((product) => [
        product.id,
        copy.ratingLabel(product.rating.toFixed(1), product.reviewCount),
      ]),
    ),
  };
}

/** Four-column product grid at wide widths; one column on phones. */
export function ProductGrid({ products, locale, labels }: ProductGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <li key={product.id} className="relative">
          <Link
            href={`/product/${product.slug}`}
            aria-label={product.title[locale]}
            className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <ProductCard
              product={{
                id: product.id,
                title: product.title[locale],
                vendorName: product.vendorName,
                priceMinor: product.priceMinor,
                compareAtMinor: product.compareAtMinor,
                rating: product.rating,
                reviewCount: product.reviewCount,
                tone: product.tone,
                totalStock: product.totalStock,
              }}
              locale={locale}
              ratingLabel={labels.ratingLabels[product.id] ?? ''}
              saleLabel={labels.sale}
              soldOutLabel={labels.soldOut}
            />
          </Link>
          <WishlistButton
            productId={product.id}
            className="absolute right-2 top-2 z-10 bg-surface/95 backdrop-blur"
          />
        </li>
      ))}
    </ul>
  );
}
