import { Badge, Price } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { ProductMedia } from '../../../catalog/components/ProductMedia';
import { normaliseProductTone } from '../../../catalog/queries';
import type { OrderRecord } from '../../queries';
import { subOrderStatusLabel, statusTone } from '../../labels';

export interface OrderItemsProps {
  order: OrderRecord;
  copy: Dictionary['checkout'];
  locale: Locale;
}

/** Seller groups with their items, quantities, SKUs and line totals. */
export function OrderItems({ order, copy, locale }: OrderItemsProps) {
  return (
    <div className="space-y-5">
      {order.subOrders.map((subOrder) => (
        <section key={subOrder.id} className="rounded-sm border border-line bg-surface">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">{subOrder.vendorName}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-muted">{subOrder.number}</span>
              <Badge tone={statusTone(subOrder.status)}>
                {subOrderStatusLabel(copy, subOrder.status)}
              </Badge>
            </div>
          </header>

          <ul className="divide-y divide-line px-4">
            {subOrder.items.map((item) => (
              <li key={item.id} className="flex gap-3 py-4">
                <ProductMedia
                  tone={normaliseProductTone(item.tone)}
                  className="size-14 shrink-0 rounded-sm"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="line-clamp-2 text-sm font-medium text-ink hover:text-accent"
                  >
                    {locale === 'bn' ? item.titleBn : item.titleEn}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {locale === 'bn' ? item.variantNameBn : item.variantNameEn} · {item.sku}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {copy.quantity}: {item.quantity} ·{' '}
                    <Price amountMinor={item.unitPriceMinor} locale={locale} size="sm" />
                  </p>
                </div>
                <p className="text-sm font-medium text-ink">
                  <Price amountMinor={item.lineTotalMinor} locale={locale} size="sm" />
                </p>
              </li>
            ))}
          </ul>

          <footer className="flex justify-between border-t border-line px-4 py-3 text-sm">
            <span className="text-ink-muted">{copy.total}</span>
            <Price amountMinor={subOrder.totalMinor} locale={locale} size="sm" />
          </footer>
        </section>
      ))}
    </div>
  );
}
