import { ButtonLink } from '@sd/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminSection } from '../../../../../features/admin/components/AdminSection';
import { ContentVersionHistory } from '../../../../../features/admin/components/ContentVersionHistory';
import { HelpCategoryForm } from '../../../../../features/admin/components/HelpCategoryForm';
import { requireAdmin } from '../../../../../features/admin/guard';
import { restoreHelpCategoryVersionAction } from '../../../../../features/content/helpCategoryActions';
import { getHelpCategory } from '../../../../../features/content/helpCategoryQueries';
import { helpCategoryNotice } from '../../../../../features/content/helpCategoryNotice';
import { SellerNotice } from '../../../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../../../i18n';
import { getLocale } from '../../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return {
    title: copy.admin.helpCategoriesTitle,
    description: copy.admin.helpCategoriesDescription,
  };
}

interface EditHelpCategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; restored?: string; error?: string }>;
}

/** One Help Center category with its editor and version history. */
export default async function EditHelpCategoryPage({
  params,
  searchParams,
}: EditHelpCategoryPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const viewer = await requireAdmin('admin:cms:write', `/admin/cms/help/${id}`);
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const record = await getHelpCategory(id);
  if (!record) notFound();

  const notice = helpCategoryNotice(copy.admin, query);

  return (
    <AdminSection
      active="content"
      title={record.category.nameEn}
      description={record.category.slug}
      role={viewer.role}
      copy={copy}
      actions={
        <ButtonLink href="/admin/cms/help" variant="secondary">
          {copy.admin.helpCategoriesBack}
        </ButtonLink>
      }
    >
      <div className="space-y-5">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-sm border border-line bg-surface p-4">
            <HelpCategoryForm category={record.category} copy={copy.admin} />
          </div>
          <ContentVersionHistory
            versions={record.versions}
            copy={copy.admin}
            locale={locale}
            restoreAction={restoreHelpCategoryVersionAction}
          />
        </div>
      </div>
    </AdminSection>
  );
}
