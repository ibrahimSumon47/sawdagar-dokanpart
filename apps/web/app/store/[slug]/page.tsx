import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicStoreView } from '../../../features/seller/components/PublicStoreView';
import { getPublicStore } from '../../../features/seller/queries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getPublicStore(slug);
  const copy = getDictionary(await getLocale());
  return {
    title: store?.name ?? copy.seller.publicProducts,
    description: store?.descriptionEn ?? copy.seller.description,
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
