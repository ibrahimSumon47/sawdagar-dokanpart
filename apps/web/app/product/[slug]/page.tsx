import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getViewer } from '../../../features/auth/session';
import { Suspense } from 'react';
import { ProductBelowFold } from '../../../features/catalog/components/ProductBelowFold';
import { ProductDetail } from '../../../features/catalog/components/ProductDetail';
import { getProductBySlug } from '../../../features/catalog/queries';
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

  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const copy = getDictionary(locale);

  return (
    <>
      <ProductDetail product={product} locale={locale} copy={copy} />
      <Suspense fallback={null}>
        <ProductBelowFold
          product={product}
          signedIn={viewer !== null}
          locale={locale}
          copy={copy}
        />
      </Suspense>
    </>
  );
}
