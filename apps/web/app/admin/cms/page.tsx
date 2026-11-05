import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { CmsModuleLinks, type CmsModule } from '../../../features/admin/components/CmsModuleLinks';
import { requireAdmin } from '../../../features/admin/guard';
import { getCmsEntries } from '../../../features/content/queries';
import { getCmsSections } from '../../../features/content/sectionQueries';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.cmsTitle, description: copy.admin.cmsDescription };
}

/** Admin home for the CMS modules. */
export default async function AdminCmsPage() {
  const viewer = await requireAdmin('admin:cms:write', '/admin/cms');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const [sections, entries] = await Promise.all([getCmsSections(), getCmsEntries()]);
  const countOf = (kind: 'page' | 'help' | 'journal') =>
    entries.filter((entry) => entry.kind === kind).length;
  const modules: CmsModule[] = [
    {
      key: 'sections',
      title: copy.admin.cmsSectionsCard,
      body: copy.admin.cmsSectionsCardBody,
      href: '/admin/cms/sections',
      count: sections.length,
      countLabel: copy.admin.sectionCount,
    },
    {
      key: 'entries',
      title: copy.admin.cmsEntriesCard,
      body: copy.admin.cmsEntriesCardBody,
      href: '/admin/content',
      count: countOf('page') + countOf('help'),
      countLabel: copy.admin.entryCount,
    },
    {
      key: 'journal',
      title: copy.admin.cmsJournalCard,
      body: copy.admin.cmsJournalCardBody,
      href: '/admin/content',
      count: countOf('journal'),
      countLabel: copy.admin.entryCount,
    },
    {
      key: 'settings',
      title: copy.admin.cmsSettingsCard,
      body: copy.admin.cmsSettingsCardBody,
      href: '/admin/cms/settings',
    },
  ];

  return (
    <AdminSection
      active="content"
      title={copy.admin.cmsTitle}
      description={copy.admin.cmsDescription}
      role={viewer.role}
      copy={copy}
    >
      <CmsModuleLinks modules={modules} linkLabel={copy.admin.cmsOpen} />
    </AdminSection>
  );
}
