import { RatingStars, SectionHeading } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import type { CatalogProduct, ProductDetail as Product } from '../../queries';
import { ProductBreadcrumbs } from '../ProductBreadcrumbs';
import { ProductJsonLd } from '../ProductJsonLd';
import { ProductMedia } from '../ProductMedia';
import { ProductVendorCard } from '../ProductVendorCard';
import { ProductGrid } from '../ProductGrid';
import { VariantPicker } from '../VariantPicker';

export interface ProductDetailProps {
  product: Product;
  related: readonly CatalogProduct[];
  locale: Locale;
  copy: Dictionary;
}

/** Product page: one product, its variants, vendor and four related items. */
export function ProductDetail({ product, related, locale, copy }: ProductDetailProps) {
  const catalog = copy.catalog;

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <ProductJsonLd product={product} locale={locale} />
      <ProductBreadcrumbs
        category={product.category}
        productTitle={product.title[locale]}
        locale={locale}
        copy={catalog}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <ProductMedia tone={product.tone} />

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

          <VariantPicker
            key={product.id}
            variants={product.variants}
            locale={locale}
            labels={{
              chooseVariant: catalog.chooseVariant,
              stockIn: catalog.stockIn,
              stockLow: catalog.stockLow,
              stockOut: catalog.stockOut,
              sku: catalog.sku,
              cartNote: catalog.cartNote,
            }}
          />

          <dl className="mt-8 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink">{catalog.shippingTitle}</dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">
                {catalog.shipsFrom(product.vendor.district ?? 'Bangladesh')} {catalog.shippingBody}
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

        <ProductVendorCard vendor={product.vendor} copy={catalog} />
      </div>

      {related.length > 0 ? (
        <section aria-label={catalog.relatedTitle} className="mt-14">
          <SectionHeading
            title={catalog.relatedTitle}
            action={
              <Link
                href={`/catalog?category=${product.category.slug}`}
                className="text-sm font-medium text-accent hover:underline"
              >
                {copy.home.browseAll}
              </Link>
            }
          />
          <div className="mt-6">
            <ProductGrid products={related} locale={locale} copy={catalog} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
