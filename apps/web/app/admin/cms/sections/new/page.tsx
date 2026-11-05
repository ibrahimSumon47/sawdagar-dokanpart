import type { Metadata } from 'next';
import { AdminSection } from '../../../../../features/admin/components/AdminSection';
import { CmsSectionForm } from '../../../../../features/admin/components/CmsSectionForm';
import { requireAdmin } from '../../../../../features/admin/guard';
import { getDictionary } from '../../../../../i18n';
import { getLocale } from '../../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.newSection, description: copy.admin.sectionsDescription };
}

/** Creates one homepage section. */
export default async function NewSectionPage() {
  const viewer = await requireAdmin('admin:cms:write', '/admin/cms/sections/new');
  const locale = await getLocale();
  const copy = getDictionary(locale);

  return (
    <AdminSection
      active="content"
      title={copy.admin.newSection}
      description={copy.admin.sectionsDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="max-w-3xl">
        <CmsSectionForm section={null} copy={copy.admin} />
      </div>
    </AdminSection>
  );
}
