import { ButtonLink } from '@sd/ui';
import type { Metadata } from 'next';
import { AdminSection } from '../../../../features/admin/components/AdminSection';
import { CmsSectionOrder } from '../../../../features/admin/components/CmsSectionOrder';
import { requireAdmin } from '../../../../features/admin/guard';
import { sectionOrderCopy } from '../../../../features/content/sectionCopy';
import { getCmsSections } from '../../../../features/content/sectionQueries';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.sectionsTitle, description: copy.admin.sectionsDescription };
}

/** Homepage sections in display order, with drag reordering. */
export default async function AdminSectionsPage() {
  const viewer = await requireAdmin('admin:cms:write', '/admin/cms/sections');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const sections = await getCmsSections();

  return (
    <AdminSection
      active="content"
      title={copy.admin.sectionsTitle}
      description={copy.admin.sectionsDescription}
      role={viewer.role}
      copy={copy}
      actions={<ButtonLink href="/admin/cms/sections/new">{copy.admin.newSection}</ButtonLink>}
    >
      {sections.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line p-6 text-sm text-ink-muted">
          {copy.admin.noSections}
        </p>
      ) : (
        <CmsSectionOrder sections={sections} copy={sectionOrderCopy(copy.admin)} locale={locale} />
      )}
    </AdminSection>
  );
}
