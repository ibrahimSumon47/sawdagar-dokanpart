import type { Metadata } from 'next';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { SellerReturnList } from '../../../features/seller/components/SellerReturnList';
import { SellerSection } from '../../../features/seller/components/SellerSection';
import { sellerNotice } from '../../../features/seller/notice';
import { getSellerReturns } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.returnsTitle };
}

interface ReturnsPageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Return requests made against this store's delivered lines. */
export default async function SellerReturnsPage({ searchParams }: ReturnsPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/returns');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const returns = await getSellerReturns(access.organizationId);
  const notice = sellerNotice(copy.seller, params);

  return (
    <SellerSection
      active="returns"
      title={copy.seller.returnsTitle}
      description={copy.seller.returnsDescription}
      copy={copy.seller}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        {returns.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.seller.noReturns}
          </p>
        ) : (
          <SellerReturnList returns={returns} copy={copy.seller} locale={locale} />
        )}
      </div>
    </SellerSection>
  );
}
