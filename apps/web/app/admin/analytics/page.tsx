import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { PlatformAnalytics } from '../../../features/admin/components/PlatformAnalytics';
import { getPlatformAnalytics } from '../../../features/admin/analyticsQueries';
import { requireArea } from '../../../features/auth/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.analyticsTitle, description: copy.admin.analyticsDescription };
}

/** Marketplace totals for every admin role. */
export default async function AdminAnalyticsPage() {
  const { role } = await requireArea('admin', '/admin/analytics');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const analytics = await getPlatformAnalytics();

  return (
    <AdminSection
      active="analytics"
      title={copy.admin.analyticsTitle}
      description={copy.admin.analyticsDescription}
      role={role}
      copy={copy}
    >
      <PlatformAnalytics analytics={analytics} copy={copy.admin} locale={locale} />
    </AdminSection>
  );
}
