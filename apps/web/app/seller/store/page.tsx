import type { Metadata } from 'next';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { SellerStoreView } from '../../../features/seller/components/SellerStoreView';
import { sellerNotice } from '../../../features/seller/notice';
import { getSellerStore } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.storeTitle };
}

interface StoreSettingsPageProps {
  searchParams: Promise<{ saved?: string; kyc?: string; error?: string }>;
}

/** Storefront CMS fields and KYC submission. */
export default async function SellerStorePage({ searchParams }: StoreSettingsPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/store');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const store = await getSellerStore(access.organizationId);
  if (!store) return <SellerEmpty copy={copy.seller} />;

  const notice = sellerNotice(copy.seller, params);

  return (
    <div>
      {notice ? (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <SellerNotice message={notice.message} tone={notice.tone} />
        </div>
      ) : null}
      <SellerStoreView
        store={store}
        copy={copy.seller}
        canManage={access.canManage}
        locale={locale}
      />
    </div>
  );
}
