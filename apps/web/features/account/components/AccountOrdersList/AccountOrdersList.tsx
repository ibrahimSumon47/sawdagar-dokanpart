import { Badge, ButtonLink, EmptyState, Price } from '@sd/ui';
import { Package } from 'lucide-react';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import { orderStatusLabel, statusTone } from '../../../checkout/labels';
import type { BuyerOrderRecord } from '../../../reviews/queries';

export interface AccountOrdersListProps {
  orders: BuyerOrderRecord[];
  copy: Dictionary['account'];
  checkoutCopy: Dictionary['checkout'];
  locale: Locale;
}

/** Order history rows linking to each receipt. */
export function AccountOrdersList({ orders, copy, checkoutCopy, locale }: AccountOrdersListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package aria-hidden="true" className="size-8" />}
        title={copy.ordersEmptyTitle}
        description={copy.ordersEmptyBody}
        action={<ButtonLink href="/catalog">{copy.ordersEmptyAction}</ButtonLink>}
      />
    );
  }

  return (
    <ul className="divide-y divide-line rounded-sm border border-line bg-surface">
      {orders.map((order) => (
        <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <p className="font-medium text-ink">{order.number}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {formatDate(order.placedAt, locale)} · {copy.orderItems(String(order.itemCount))} ·{' '}
              {copy.orderSellers(String(order.sellerCount))}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={statusTone(order.status)}>
              {orderStatusLabel(checkoutCopy, order.status)}
            </Badge>
            <Price amountMinor={order.totalMinor} locale={locale} size="sm" />
            <ButtonLink href={`/orders/${order.number}`} variant="secondary" size="sm">
              {copy.viewOrder}
            </ButtonLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
