import type { Locale } from '../../../../i18n';
import { site } from '../../../../lib/site';
import type { ProductDetail } from '../../queries';

export interface ProductJsonLdProps {
  product: ProductDetail;
  locale: Locale;
}

/**
 * Structured product data for search engines. Text is escaped for a script
 * context, so catalog content cannot close the tag.
 */
export function ProductJsonLd({ product, locale }: ProductJsonLdProps) {
  const url = `${site.demoUrl}/product/${product.slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title[locale],
    description: product.description[locale],
    sku: product.variants[0]?.sku,
    brand: { '@type': 'Brand', name: product.vendorName },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BDT',
      price: (product.priceMinor / 100).toFixed(2),
      availability:
        product.totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: product.vendorName },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
