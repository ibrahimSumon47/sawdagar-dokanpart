import { ButtonLink } from '@sd/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminSection } from '../../../../features/admin/components/AdminSection';
import { ContentEditorForm } from '../../../../features/admin/components/ContentEditorForm';
import { ContentPreview } from '../../../../features/admin/components/ContentPreview';
import { ContentVersionHistory } from '../../../../features/admin/components/ContentVersionHistory';
import { requireAdmin } from '../../../../features/admin/guard';
import { contentEditHref, contentHref } from '../../../../features/content';
import { getCmsEntry } from '../../../../features/content/queries';
import { contentNotice } from '../../../../features/content/notice';
import { SellerNotice } from '../../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.contentTitle, description: copy.admin.contentDescription };
}

interface EditContentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; restored?: string; error?: string }>;
}

/** One CMS entry with the editor, a preview and its version history. */
export default async function EditContentPage({ params, searchParams }: EditContentPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const viewer = await requireAdmin('admin:cms:write', contentEditHref(id));
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const record = await getCmsEntry(id);
  if (!record) notFound();

  const notice = contentNotice(copy.admin, query);

  return (
    <AdminSection
      active="content"
      title={record.entry.titleEn}
      description={record.entry.slug}
      role={viewer.role}
      copy={copy}
      actions={
        record.entry.status === 'published' ? (
          <ButtonLink href={contentHref(record.entry.kind, record.entry.slug)} variant="secondary">
            {copy.admin.viewPublic}
          </ButtonLink>
        ) : undefined
      }
    >
      <div className="space-y-5">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-sm border border-line bg-surface p-4">
            <ContentEditorForm
              entry={record.entry}
              defaultKind={record.entry.kind}
              copy={copy.admin}
            />
          </div>
          <div className="space-y-4">
            <ContentPreview entry={record.entry} copy={copy.admin} locale={locale} />
            <ContentVersionHistory versions={record.versions} copy={copy.admin} locale={locale} />
          </div>
        </div>
      </div>
    </AdminSection>
  );
}
