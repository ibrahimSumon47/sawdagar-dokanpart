import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicStoreView } from '../../../features/seller/components/PublicStoreView';
import { getPublicStore } from '../../../features/seller/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';
import { metaDescription } from '../../../lib/meta';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getPublicStore(slug);
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const description =
    (store ? (locale === 'bn' ? store.descriptionBn : store.descriptionEn) : null) ??
    copy.seller.description;

  return {
    title: store?.name ?? copy.seller.publicProducts,
    description: metaDescription(description),
    alternates: { canonical: `/store/${slug}` },
  };
}

/** Public vendor storefront with active products and policies. */
export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const store = await getPublicStore(slug);
  if (!store) notFound();

  return <PublicStoreView store={store} copy={copy} locale={locale} />;
}
