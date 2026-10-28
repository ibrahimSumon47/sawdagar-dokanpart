import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { FeatureFlagList } from '../../../features/admin/components/FeatureFlagList';
import { requireAdmin } from '../../../features/admin/guard';
import { getFeatureFlags } from '../../../features/content/flags';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.flagsTitle, description: copy.admin.flagsDescription };
}

interface FlagsPageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Storefront feature flags that can be changed without a deployment. */
export default async function AdminFlagsPage({ searchParams }: FlagsPageProps) {
  const params = await searchParams;
  const viewer = await requireAdmin('admin:settings:write', '/admin/flags');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const flags = await getFeatureFlags();

  const notice = params.error
    ? { message: copy.admin.flagInvalid, tone: 'error' as const }
    : params.saved
      ? { message: copy.admin.flagSaved, tone: 'success' as const }
      : null;

  return (
    <AdminSection
      active="flags"
      title={copy.admin.flagsTitle}
      description={copy.admin.flagsDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <FeatureFlagList flags={flags} copy={copy.admin} locale={locale} />
      </div>
    </AdminSection>
  );
}
