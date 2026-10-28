import { Badge, ButtonLink, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { SellerProductRecord } from '../../queries';

export interface SellerProductTableProps {
  products: readonly SellerProductRecord[];
  copy: Dictionary['seller'];
  locale: Locale;
  canManage: boolean;
}

function statusTone(status: string): 'success' | 'warning' | 'neutral' {
  if (status === 'active') return 'success';
  if (status === 'draft') return 'warning';
  return 'neutral';
}

/** Product rows with status, category, price, stock and an edit link. */
export function SellerProductTable({ products, copy, locale, canManage }: SellerProductTableProps) {
  const statusLabel = (status: string) =>
    status === 'active'
      ? copy.productActive
      : status === 'draft'
        ? copy.productDraft
        : copy.productArchived;

  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[42rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.productName}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.category}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.status}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.price}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.stock}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.updated}
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">{copy.edit}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">
                  {locale === 'bn' ? product.titleBn : product.titleEn}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {product.variants.length} {copy.variantsTitle.toLowerCase()} · {product.slug}
                </p>
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {locale === 'bn' ? product.categoryNameBn : product.categoryNameEn}
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(product.status)}>{statusLabel(product.status)}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Price amountMinor={product.priceMinor} locale={locale} size="sm" />
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                {product.totalStock}
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted">
                {formatDate(product.updatedAt, locale)}
              </td>
              <td className="px-4 py-3 text-right">
                {canManage ? (
                  <ButtonLink href={`/seller/products/${product.id}`} variant="secondary" size="sm">
                    {copy.edit}
                  </ButtonLink>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
