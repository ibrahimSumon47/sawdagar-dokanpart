import { Badge, ButtonLink, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { subOrderStatusLabel, statusTone } from '../../../checkout/labels';
import type { SellerOrderRecord } from '../../queries';

export interface SellerOrderTableProps {
  orders: readonly SellerOrderRecord[];
  copy: Dictionary['seller'];
  checkoutCopy: Dictionary['checkout'];
  locale: Locale;
}

/** Sub-order rows with buyer, item count, total and current status. */
export function SellerOrderTable({ orders, copy, checkoutCopy, locale }: SellerOrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[40rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.tabOrders}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.buyer}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.status}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.items}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.total}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.placed}
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">{copy.openOrder}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{order.number}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{order.orderNumber}</p>
              </td>
              <td className="px-4 py-3 text-ink-muted">{order.buyerName}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(order.status)}>
                  {subOrderStatusLabel(checkoutCopy, order.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                {order.itemCount}
              </td>
              <td className="px-4 py-3 text-right">
                <Price amountMinor={order.totalMinor} locale={locale} size="sm" />
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted">
                {formatDate(order.createdAt, locale)}
              </td>
              <td className="px-4 py-3 text-right">
                <ButtonLink href={`/seller/orders/${order.id}`} variant="secondary" size="sm">
                  {copy.openOrder}
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
