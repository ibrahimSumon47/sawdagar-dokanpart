import { ButtonLink } from '@sd/ui';
import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { ContentList } from '../../../features/admin/components/ContentList';
import { requireAdmin } from '../../../features/admin/guard';
import { getCmsEntries } from '../../../features/content/queries';
import { contentNotice } from '../../../features/content/notice';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.contentTitle, description: copy.admin.contentDescription };
}

interface ContentPageProps {
  searchParams: Promise<{ saved?: string; restored?: string; error?: string }>;
}

/** CMS entries across pages, Help articles and Journal posts. */
export default async function AdminContentPage({ searchParams }: ContentPageProps) {
  const params = await searchParams;
  const viewer = await requireAdmin('admin:cms:write', '/admin/content');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const entries = await getCmsEntries();
  const notice = contentNotice(copy.admin, params);

  return (
    <AdminSection
      active="content"
      title={copy.admin.contentTitle}
      description={copy.admin.contentDescription}
      role={viewer.role}
      copy={copy}
      actions={<ButtonLink href="/admin/content/new">{copy.admin.newContent}</ButtonLink>}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <ContentList entries={entries} copy={copy.admin} locale={locale} />
      </div>
    </AdminSection>
  );
}
