import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getViewer } from '../../../features/auth/session';
import { ProductDetail } from '../../../features/catalog/components/ProductDetail';
import { getProductBySlug, getRelatedProducts } from '../../../features/catalog/queries';
import { getProductQuestions } from '../../../features/questions/queries';
import { getProductReviews, getReviewSummary } from '../../../features/reviews/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';
import { metaDescription } from '../../../lib/meta';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [product, locale] = await Promise.all([getProductBySlug(slug), getLocale()]);
  if (!product) return {};

  return {
    title: product.title[locale],
    description: metaDescription(product.description[locale]),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title[locale],
      description: metaDescription(product.description[locale]),
      type: 'website',
      images: ['/opengraph-image'],
    },
  };
}

/** One catalog product with variants, vendor and related items. */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, locale, reviews, reviewSummary, questions, viewer] = await Promise.all([
    getRelatedProducts(product.id, product.category.slug),
    getLocale(),
    getProductReviews(product.id),
    getReviewSummary(product.id),
    getProductQuestions(product.id),
    getViewer(),
  ]);
  const copy = getDictionary(locale);

  return (
    <ProductDetail
      product={product}
      related={related}
      reviews={reviews}
      reviewSummary={reviewSummary}
      questions={questions}
      signedIn={viewer !== null}
      locale={locale}
      copy={copy}
    />
  );
}
