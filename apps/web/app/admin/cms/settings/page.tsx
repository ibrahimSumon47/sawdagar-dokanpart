import type { Metadata } from 'next';
import { AdminSection } from '../../../../features/admin/components/AdminSection';
import { ContentVersionHistory } from '../../../../features/admin/components/ContentVersionHistory';
import { SettingsForm } from '../../../../features/admin/components/SettingsForm';
import { requireAdmin } from '../../../../features/admin/guard';
import { restoreSettingsVersionAction } from '../../../../features/content/settingsActions';
import { settingsNotice } from '../../../../features/content/settingsNotice';
import { getSettingsForAdmin } from '../../../../features/content/settingsQueries';
import { SellerNotice } from '../../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.settingsTitle, description: copy.admin.settingsDescription };
}

interface SettingsPageProps {
  searchParams: Promise<{ saved?: string; restored?: string; error?: string }>;
}

/** Edits the announcement bar, menus, SEO defaults and policy text. */
export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const query = await searchParams;
  const viewer = await requireAdmin('admin:cms:write', '/admin/cms/settings');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const { settings, versions } = await getSettingsForAdmin();
  const notice = settingsNotice(copy.admin, query);

  return (
    <AdminSection
      active="content"
      title={copy.admin.settingsTitle}
      description={copy.admin.settingsDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="space-y-5">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <SettingsForm settings={settings} copy={copy.admin} />
          <ContentVersionHistory
            versions={versions}
            copy={copy.admin}
            locale={locale}
            restoreAction={restoreSettingsVersionAction}
          />
        </div>
      </div>
    </AdminSection>
  );
}
