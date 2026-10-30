import type { RatingSummary } from '@sd/domain';
import { RatingStars, SectionHeading } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { placeName } from '../../../../i18n/places';
import type { QuestionRecord } from '../../../questions/queries';
import type { ReviewRecord } from '../../../reviews/queries';
import { ProductQuestions } from '../../../questions/components/ProductQuestions';
import { ProductReviews } from '../../../reviews/components/ProductReviews';
import type { CatalogProduct, ProductDetail as Product } from '../../queries';
import { ProductBreadcrumbs } from '../ProductBreadcrumbs';
import { ProductJsonLd } from '../ProductJsonLd';
import { ProductMedia } from '../ProductMedia';
import { ProductVendorCard } from '../ProductVendorCard';
import { ProductGrid, productGridLabels } from '../ProductGrid';
import { ProductBuyBox } from '../../../shop/components/ProductBuyBox';
import { departmentPhoto } from '../../media';

export interface ProductDetailProps {
  product: Product;
  related: readonly CatalogProduct[];
  reviews: ReviewRecord[];
  reviewSummary: RatingSummary;
  questions: QuestionRecord[];
  signedIn: boolean;
  locale: Locale;
  copy: Dictionary;
}

/** Product page: one product, its variants, vendor and four related items. */
export function ProductDetail({
  product,
  related,
  reviews,
  reviewSummary,
  questions,
  signedIn,
  locale,
  copy,
}: ProductDetailProps) {
  const catalog = copy.catalog;
  const photo = departmentPhoto(product.departmentSlug, product.slug, locale);

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

      <ProductReviews
        summary={reviewSummary}
        reviews={reviews}
        copy={copy.reviews}
        locale={locale}
      />

      <ProductQuestions
        productId={product.id}
        productSlug={product.slug}
        questions={questions}
        copy={copy.questions}
        signInLabel={copy.nav.signIn}
        signedIn={signedIn}
        locale={locale}
      />

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
            <ProductGrid
              products={related}
              locale={locale}
              labels={productGridLabels(related, catalog)}
            />
          </div>
        </section>
      ) : null}
    </article>
  );
}
