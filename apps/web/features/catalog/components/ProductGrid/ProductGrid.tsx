import { ProductCard } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import type { CatalogProduct } from '../../queries';

export interface ProductGridProps {
  products: readonly CatalogProduct[];
  locale: Locale;
  copy: Dictionary['catalog'];
}

/** Four-column product grid at wide widths; one column on phones. */
export function ProductGrid({ products, locale, copy }: ProductGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <li key={product.id}>
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
              ratingLabel={copy.ratingLabel(product.rating.toFixed(1), product.reviewCount)}
              saleLabel={copy.sale}
              soldOutLabel={copy.stockOut}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
