import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { SellerOrderDetail } from '../../queries';

export interface SellerOrderSummaryProps {
  order: SellerOrderDetail;
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Delivery address, buyer note, order lines and the money breakdown. */
export function SellerOrderSummary({ order, copy, locale }: SellerOrderSummaryProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-sm border border-line bg-surface p-5">
        <h2 className="font-serif text-xl text-ink">{copy.shippingTo}</h2>
        <p className="mt-2 text-sm text-ink">{order.buyerName}</p>
        <p className="text-sm text-ink-muted">{order.shippingPhone}</p>
        <p className="mt-1 text-sm text-ink-muted">
          {order.shippingLine}, {order.shippingUpazila}, {order.shippingDistrict}
        </p>
        {order.notes ? (
          <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">
            {copy.orderNotes}: {order.notes}
          </p>
        ) : null}
      </section>

      <section className="overflow-x-auto rounded-sm border border-line bg-surface">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
              <th scope="col" className="px-4 py-3 font-medium">
                {copy.orderLines}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                {copy.quantity}
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                {copy.total}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">
                    {locale === 'bn' ? item.titleBn : item.titleEn}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {locale === 'bn' ? item.variantNameBn : item.variantNameEn} · {item.sku}
                  </p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right">
                  <Price amountMinor={item.lineTotalMinor} locale={locale} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-sm border border-line bg-surface p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">{copy.subtotal}</dt>
            <dd>
              <Price amountMinor={order.subtotalMinor} locale={locale} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">{copy.shipping}</dt>
            <dd>
              <Price amountMinor={order.shippingMinor} locale={locale} size="sm" />
            </dd>
          </div>
          {order.discountMinor > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">{copy.discount}</dt>
              <dd>
                <Price amountMinor={order.discountMinor} locale={locale} size="sm" />
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3 border-t border-line pt-2 font-semibold">
            <dt>{copy.total}</dt>
            <dd>
              <Price amountMinor={order.totalMinor} locale={locale} size="sm" />
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
