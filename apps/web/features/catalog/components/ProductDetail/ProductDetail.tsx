import { RatingStars } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { placeName } from '../../../../i18n/places';
import { pageLayout } from '../../../shell/pageLayout';
import type { ProductDetail as Product } from '../../queries';
import { ProductBreadcrumbs } from '../ProductBreadcrumbs';
import { ProductJsonLd } from '../ProductJsonLd';
import { ProductMedia } from '../ProductMedia';
import { ProductVendorCard } from '../ProductVendorCard';
import { ProductBuyBox } from '../../../shop/components/ProductBuyBox';
import { productPhoto } from '../../media';

export interface ProductDetailProps {
  product: Product;
  locale: Locale;
  copy: Dictionary;
}

/**
 * Product page top half: photo, title, buy box, description and vendor. Reviews,
 * questions and related products render later through ProductBelowFold.
 */
export function ProductDetail({ product, locale, copy }: ProductDetailProps) {
  const catalog = copy.catalog;
  const photo = productPhoto(product.images);

  return (
    <article className={pageLayout.standard}>
      <ProductJsonLd product={product} locale={locale} />
      <ProductBreadcrumbs
        category={product.category}
        productTitle={product.title[locale]}
        locale={locale}
        copy={catalog}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <ProductMedia tone={product.tone} image={photo ?? undefined} />

        <div className="min-w-0">
          <Link
            href={`/catalog?vendor=${product.vendorSlug}`}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-accent hover:underline"
          >
            {product.vendorName}
          </Link>
          <h1 className="mt-3 text-title font-serif leading-tight text-ink">
            {product.title[locale]}
          </h1>
          <div className="mt-3">
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              label={catalog.ratingLabel(product.rating.toFixed(1), product.reviewCount)}
              size="md"
            />
          </div>

          <ProductBuyBox
            productId={product.id}
            variants={product.variants}
            locale={locale}
            stockLabels={{
              chooseVariant: catalog.chooseVariant,
              inStock: catalog.stockIn,
              lowStock: catalog.stockLow,
              outOfStock: catalog.stockOut,
              sku: catalog.sku,
            }}
          />

          <dl className="mt-8 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink">{catalog.shippingTitle}</dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">
                {catalog.shipsFrom(placeName(product.vendor.district ?? 'Bangladesh', locale))}{' '}
                {catalog.shippingBody}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">{catalog.returnsTitle}</dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">{catalog.returnsBody}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="product-about-title">
          <h2 id="product-about-title" className="font-serif text-2xl text-ink">
            {catalog.aboutTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
            {product.description[locale]}
          </p>
        </section>

        <ProductVendorCard vendor={product.vendor} locale={locale} copy={catalog} />
      </div>
    </article>
  );
}
