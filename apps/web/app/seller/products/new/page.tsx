import type { Metadata } from 'next';
import { SellerEmpty } from '../../../../features/seller/components/SellerEmpty';
import { SellerNotice } from '../../../../features/seller/components/SellerNotice';
import { SellerProductForm } from '../../../../features/seller/components/SellerProductForm';
import { SellerSection } from '../../../../features/seller/components/SellerSection';
import { sellerNotice } from '../../../../features/seller/notice';
import { getSellerCategories } from '../../../../features/seller/queries';
import { requireSellerPage } from '../../../../features/seller/session';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.productNewTitle };
}

interface NewProductPageProps {
  searchParams: Promise<{ error?: string }>;
}

/** Create form for a new product; the first variant is made with it. */
export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const params = await searchParams;
  const { access } = await requireSellerPage('/seller/products/new');
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;
  if (!access.canManage) return <SellerEmpty copy={copy.seller} />;

  const categories = await getSellerCategories();
  const notice = sellerNotice(copy.seller, params);

  return (
    <SellerSection
      active="products"
      title={copy.seller.productNewTitle}
      description={copy.seller.productNewDescription}
      copy={copy.seller}
    >
      <div className="space-y-4">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <SellerProductForm categories={categories} copy={copy.seller} />
      </div>
    </SellerSection>
  );
}
