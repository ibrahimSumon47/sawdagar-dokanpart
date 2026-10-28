import type { Metadata } from 'next';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { SellerPromotionForm } from '../../../features/seller/components/SellerPromotionForm';
import { SellerPromotionList } from '../../../features/seller/components/SellerPromotionList';
import { SellerSection } from '../../../features/seller/components/SellerSection';
import { sellerNotice } from '../../../features/seller/notice';
import { getSellerPromotions } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.promotionsTitle };
}

interface PromotionsPageProps {
  searchParams: Promise<{ saved?: string; toggled?: string; error?: string }>;
}

/** Store coupon list and the create form. */
export default async function SellerPromotionsPage({ searchParams }: PromotionsPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/promotions');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const promotions = await getSellerPromotions(access.organizationId);
  const notice = sellerNotice(copy.seller, {
    saved: params.saved ?? params.toggled,
    error: params.error,
  });

  return (
    <SellerSection
      active="promotions"
      title={copy.seller.promotionsTitle}
      description={copy.seller.promotionsDescription}
      copy={copy.seller}
    >
      <div className="space-y-6">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        {access.canManage ? <SellerPromotionForm copy={copy.seller} /> : null}
        {promotions.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.seller.noPromotions}
          </p>
        ) : (
          <SellerPromotionList promotions={promotions} copy={copy.seller} locale={locale} />
        )}
      </div>
    </SellerSection>
  );
}
