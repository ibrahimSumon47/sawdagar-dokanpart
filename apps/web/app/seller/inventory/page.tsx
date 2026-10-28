import type { Metadata } from 'next';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { SellerInventoryTable } from '../../../features/seller/components/SellerInventoryTable';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { SellerSection } from '../../../features/seller/components/SellerSection';
import { StockAdjustForm } from '../../../features/seller/components/StockAdjustForm';
import { sellerNotice } from '../../../features/seller/notice';
import { getSellerInventory } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.inventoryTitle };
}

interface InventoryPageProps {
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Variant stock table and the signed adjustment form. */
export default async function SellerInventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/inventory');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const variants = await getSellerInventory(access.organizationId);
  const notice = sellerNotice(copy.seller, params);

  return (
    <SellerSection
      active="inventory"
      title={copy.seller.inventoryTitle}
      description={copy.seller.inventoryDescription}
      copy={copy.seller}
    >
      <div className="space-y-6">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        {access.canManage && variants.length > 0 ? (
          <StockAdjustForm variants={variants} copy={copy.seller} locale={locale} />
        ) : null}
        {variants.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.seller.noProducts}
          </p>
        ) : (
          <SellerInventoryTable variants={variants} copy={copy.seller} locale={locale} />
        )}
      </div>
    </SellerSection>
  );
}
