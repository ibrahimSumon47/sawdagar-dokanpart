import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { StatementRow } from '../../queries';

export interface StatementTableProps {
  statement: readonly StatementRow[];
  copy: Dictionary['seller'];
  locale: Locale;
}

/** Delivered sub-orders with the commission taken and the store's net share. */
export function StatementTable({ statement, copy, locale }: StatementTableProps) {
  return (
    <div className="mt-3 overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
            <th scope="col" className="px-4 py-3 font-medium">
              {copy.tabOrders}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.goods}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.commission}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {copy.netPayout}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {statement.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3">
                <p className="text-ink">{row.number}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {row.orderNumber}
                  {row.deliveredAt ? ` · ${formatDate(row.deliveredAt, locale)}` : ''}
                </p>
              </td>
              <td className="px-4 py-3 text-right">
                <Price amountMinor={row.goodsMinor} locale={locale} size="sm" />
              </td>
              <td className="px-4 py-3 text-right text-ink-muted">
                <Price amountMinor={row.commissionMinor} locale={locale} size="sm" />
              </td>
              <td className="px-4 py-3 text-right">
                <Price amountMinor={row.netMinor} locale={locale} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
