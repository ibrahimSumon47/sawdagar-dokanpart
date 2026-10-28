import type { Metadata } from 'next';
import { ButtonLink } from '@sd/ui';
import { SellerNotice } from '../../../features/seller/components/SellerNotice';
import { SellerProductTable } from '../../../features/seller/components/SellerProductTable';
import { SellerSection } from '../../../features/seller/components/SellerSection';
import { SellerEmpty } from '../../../features/seller/components/SellerEmpty';
import { sellerNotice } from '../../../features/seller/notice';
import { getSellerProducts } from '../../../features/seller/queries';
import { requireSellerPage } from '../../../features/seller/session';
import { getDictionary } from '../../../i18n';
import { getLocale } from '../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.productsTitle };
}

interface SellerProductsPageProps {
  searchParams: Promise<{ saved?: string; created?: string; error?: string }>;
}

/** Product list with create, edit and CSV export actions. */
export default async function SellerProductsPage({ searchParams }: SellerProductsPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/products');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const products = await getSellerProducts(access.organizationId);
  const notice = sellerNotice(copy.seller, params);

  return (
    <SellerSection
      active="products"
      title={copy.seller.productsTitle}
      description={copy.seller.productsDescription}
      copy={copy.seller}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        {access.canManage ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/seller/products/new" size="sm">
                {copy.seller.newProduct}
              </ButtonLink>
              <ButtonLink href="/seller/products/export" variant="secondary" size="sm">
                {copy.seller.exportCsv}
              </ButtonLink>
            </div>
            <p className="text-xs text-ink-muted">{copy.seller.exportHint}</p>
          </div>
        ) : null}

        {products.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            {copy.seller.noProducts}
          </p>
        ) : (
          <SellerProductTable
            products={products}
            copy={copy.seller}
            locale={locale}
            canManage={access.canManage}
          />
        )}
      </div>
    </SellerSection>
  );
}
