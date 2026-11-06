import type { Dictionary, Locale } from '../../../../i18n';
import { getProductQuestions } from '../../../questions/queries';
import { ProductQuestions } from '../../../questions/components/ProductQuestions';
import { getProductReviews, getReviewSummary } from '../../../reviews/queries';
import { ProductReviews } from '../../../reviews/components/ProductReviews';
import { SectionHeading } from '@sd/ui';
import Link from 'next/link';
import { getRelatedProducts, type ProductDetail } from '../../queries';
import { ProductGrid, productGridLabels } from '../ProductGrid';

export interface ProductBelowFoldProps {
  product: ProductDetail;
  signedIn: boolean;
  locale: Locale;
  copy: Dictionary;
}

/**
 * Reviews, questions and related products for one product page. It loads its own
 * data so the page can stream it after the photo and buy box, which makes the first
 * HTML arrive without waiting for these queries.
 */
export async function ProductBelowFold({ product, signedIn, locale, copy }: ProductBelowFoldProps) {
  const catalog = copy.catalog;
  const [reviews, reviewSummary, questions, related] = await Promise.all([
    getProductReviews(product.id),
    getReviewSummary(product.id),
    getProductQuestions(product.id),
    getRelatedProducts(product.id, product.category.slug),
  ]);

  return (
    <>
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
    </>
  );
}
