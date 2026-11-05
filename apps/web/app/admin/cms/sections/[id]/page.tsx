import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminSection } from '../../../../../features/admin/components/AdminSection';
import { CmsSectionForm } from '../../../../../features/admin/components/CmsSectionForm';
import { ContentVersionHistory } from '../../../../../features/admin/components/ContentVersionHistory';
import { SectionPreview } from '../../../../../features/admin/components/SectionPreview';
import { requireAdmin } from '../../../../../features/admin/guard';
import { restoreSectionVersionAction } from '../../../../../features/content/sectionActions';
import { sectionNotice } from '../../../../../features/content/sectionNotice';
import { getCmsSection } from '../../../../../features/content/sectionQueries';
import { SellerNotice } from '../../../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../../../i18n';
import { getLocale } from '../../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.sectionsTitle, description: copy.admin.sectionsDescription };
}

interface SectionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; restored?: string; error?: string }>;
}

/** Edits one homepage section, with a live preview and its version history. */
export default async function EditSectionPage({ params, searchParams }: SectionPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const viewer = await requireAdmin('admin:cms:write', `/admin/cms/sections/${id}`);
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const record = await getCmsSection(id);
  if (!record) notFound();
  const notice = sectionNotice(copy.admin, query);
  const { section, versions } = record;

  return (
    <AdminSection
      active="content"
      title={locale === 'bn' ? section.titleBn : section.titleEn}
      description={copy.admin.sectionsDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
          <CmsSectionForm section={section} copy={copy.admin} />
        </div>
        <div className="space-y-4">
          <SectionPreview section={section} copy={copy.admin} locale={locale} />
          <ContentVersionHistory
            versions={versions}
            copy={copy.admin}
            locale={locale}
            restoreAction={restoreSectionVersionAction}
          />
        </div>
      </div>
    </AdminSection>
  );
}
