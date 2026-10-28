import { ButtonLink } from '@sd/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SellerEmpty } from '../../../../features/seller/components/SellerEmpty';
import { SellerNotice } from '../../../../features/seller/components/SellerNotice';
import { SellerProductForm } from '../../../../features/seller/components/SellerProductForm';
import { SellerSection } from '../../../../features/seller/components/SellerSection';
import { SellerVariantForm } from '../../../../features/seller/components/SellerVariantForm';
import { sellerNotice } from '../../../../features/seller/notice';
import { getSellerCategories, getSellerProduct } from '../../../../features/seller/queries';
import { requireSellerPage } from '../../../../features/seller/session';
import { getDictionary } from '../../../../i18n';
import { getLocale } from '../../../../i18n/getLocale';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.seller.productEditTitle };
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}

/** Product fields plus per-variant price and stock editing. */
export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { access } = await requireSellerPage(`/seller/products/${id}`);
  const locale = await getLocale();
  const copy = getDictionary(locale);
  if (!access) return <SellerEmpty copy={copy.seller} />;

  const product = await getSellerProduct(access.organizationId, id);
  if (!product) notFound();

  const categories = await getSellerCategories();
  const notice = sellerNotice(copy.seller, query);

  return (
    <SellerSection
      active="products"
      title={copy.seller.productEditTitle}
      description={copy.seller.productEditDescription}
      copy={copy.seller}
    >
      <div className="space-y-5">
        <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />
        <ButtonLink href="/seller/products" variant="secondary" size="sm">
          {copy.seller.back}
        </ButtonLink>

        {access.canManage ? (
          <SellerProductForm product={product} categories={categories} copy={copy.seller} />
        ) : null}

        <section>
          <h2 className="font-serif text-xl text-ink">{copy.seller.variantsTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.seller.variantsDescription}</p>
          <ul className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            {product.variants.map((variant) => (
              <li
                key={variant.id}
                className="flex flex-wrap items-end justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {locale === 'bn' ? variant.nameBn : variant.nameEn}
                  </p>
                  <p className="font-mono text-xs text-ink-muted">{variant.sku}</p>
                </div>
                {access.canManage ? (
                  <SellerVariantForm variant={variant} copy={copy.seller} />
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SellerSection>
  );
}
