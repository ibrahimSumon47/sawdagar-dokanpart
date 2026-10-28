import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '../../../features/catalog/components/ProductDetail';
import { getProductBySlug, getRelatedProducts } from '../../../features/catalog/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [product, locale] = await Promise.all([getProductBySlug(slug), getLocale()]);
  if (!product) return {};

  return {
    title: product.title[locale],
    description: product.description[locale],
    openGraph: {
      title: product.title[locale],
      description: product.description[locale],
      type: 'website',
    },
  };
}

/** One catalog product with variants, vendor and related items. */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, locale] = await Promise.all([
    getRelatedProducts(product.id, product.category.slug),
    getLocale(),
  ]);
  const copy = getDictionary(locale);

  return <ProductDetail product={product} related={related} locale={locale} copy={copy} />;
}
