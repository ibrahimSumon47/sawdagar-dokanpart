import { Badge, Price } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import type { SellerInventoryRow } from '../../queries';

export interface SellerInventoryTableProps {
  variants: readonly SellerInventoryRow[];
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Every variant with its SKU, price and stock, lowest stock first. */
export function SellerInventoryTable({ variants, copy, locale }: SellerInventoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.variant}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.sku}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.price}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.stock}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {variants.map((variant) => (
            <tr key={variant.id}>
              <td className="px-4 py-3">
                <Link
                  href={`/seller/products/${variant.productId}`}
                  className="font-medium text-ink hover:text-accent"
                >
                  {locale === 'bn' ? variant.productTitleBn : variant.productTitleEn}
                </Link>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {locale === 'bn' ? variant.nameBn : variant.nameEn}
                </p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">{variant.sku}</td>
              <td className="px-4 py-3 text-right">
                <Price amountMinor={variant.priceMinor} locale={locale} size="sm" />
              </td>
              <td className="px-4 py-3 text-right">
                <Badge tone={variant.stock <= 5 ? 'warning' : 'neutral'}>{variant.stock}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
