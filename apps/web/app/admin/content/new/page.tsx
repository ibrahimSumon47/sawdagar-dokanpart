import type { Metadata } from 'next';
import { AdminSection } from '../../../../features/admin/components/AdminSection';
import { ContentEditorForm } from '../../../../features/admin/components/ContentEditorForm';
import { requireAdmin } from '../../../../features/admin/guard';
import { isContentKind } from '../../../../features/content';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.newContent, description: copy.admin.contentDescription };
}

interface NewContentPageProps {
  searchParams: Promise<{ kind?: string }>;
}

/** Editor for a new CMS entry. */
export default async function NewContentPage({ searchParams }: NewContentPageProps) {
  const params = await searchParams;
  const viewer = await requireAdmin('admin:cms:write', '/admin/content/new');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const defaultKind = isContentKind(params.kind) ? params.kind : 'page';

  return (
    <AdminSection
      active="content"
      title={copy.admin.newContent}
      description={copy.admin.contentDescription}
      role={viewer.role}
      copy={copy}
    >
      <ContentEditorForm entry={null} defaultKind={defaultKind} copy={copy.admin} />
    </AdminSection>
  );
}
