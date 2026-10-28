import type { Metadata } from 'next';
import { SellerAnalyticsView } from '../../../features/seller/components/SellerAnalyticsView';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { getSellerAnalytics } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.analyticsTitle };
}

/** Ninety-day seller analytics: revenue, best sellers and stock alerts. */
export default async function SellerAnalyticsPage() {
  const { access } = await requireSellerPage('/seller/analytics');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const analytics = await getSellerAnalytics(access.organizationId);

  return <SellerAnalyticsView analytics={analytics} copy={copy.seller} locale={locale} />;
}
