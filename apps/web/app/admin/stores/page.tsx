import type { Metadata } from 'next';
import { AdminSection } from '../../../features/admin/components/AdminSection';
import { StoreApprovalList } from '../../../features/admin/components/StoreApprovalList';
import { requireAdmin } from '../../../features/admin/guard';
import { getAdminStores } from '../../../features/admin/storeQueries';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.admin.storesTitle, description: copy.admin.storesDescription };
}

interface StoresPageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Store KYC queue: pending stores first, with approve and reject controls. */
export default async function AdminStoresPage({ searchParams }: StoresPageProps) {
  const params = await searchParams;
  const viewer = await requireAdmin('admin:moderate:catalog', '/admin/stores');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const stores = await getAdminStores();

  const notice = params.error
    ? { message: copy.admin.storeInvalid, tone: 'error' as const }
    : params.saved
      ? { message: copy.admin.storeSaved, tone: 'success' as const }
      : null;

  return (
    <AdminSection
      active="stores"
      title={copy.admin.storesTitle}
      description={copy.admin.storesDescription}
      role={viewer.role}
      copy={copy}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <StoreApprovalList stores={stores} copy={copy.admin} locale={locale} />
      </div>
    </AdminSection>
  );
}
