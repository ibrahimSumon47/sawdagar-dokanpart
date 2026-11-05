import type { Metadata } from 'next';
import { AdminSection } from '../../../../features/admin/components/AdminSection';
import { HelpCategoryForm } from '../../../../features/admin/components/HelpCategoryForm';
import { HelpCategoryList } from '../../../../features/admin/components/HelpCategoryList';
import { requireAdmin } from '../../../../features/admin/guard';
import { getHelpCategories } from '../../../../features/content/helpCategoryQueries';
import { helpCategoryNotice } from '../../../../features/content/helpCategoryNotice';
import { SellerNotice } from '../../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return {
    title: copy.admin.helpCategoriesTitle,
    description: copy.admin.helpCategoriesDescription,
  };
}

interface HelpCategoriesPageProps {
  searchParams: Promise<{ saved?: string; restored?: string; error?: string }>;
}

/** Help Center categories in display order, plus the create form. */
export default async function AdminHelpCategoriesPage({ searchParams }: HelpCategoriesPageProps) {
  const params = await searchParams;
  const viewer = await requireAdmin('admin:cms:write', '/admin/cms/help');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const categories = await getHelpCategories();
  const notice = helpCategoryNotice(copy.admin, params);

  return (
    <AdminSection
      active="content"
      title={copy.admin.helpCategoriesTitle}
      description={copy.admin.helpCategoriesDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="space-y-5">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <HelpCategoryList categories={categories} copy={copy.admin} locale={locale} />
        <section className="space-y-3 rounded-sm border border-line bg-surface p-4">
          <h2 className="font-serif text-lg text-ink">{copy.admin.helpCategoryNewTitle}</h2>
          <HelpCategoryForm category={null} copy={copy.admin} />
        </section>
      </div>
    </AdminSection>
  );
}
