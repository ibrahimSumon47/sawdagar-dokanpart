import type { Dictionary, Locale } from '../../../../i18n';
import type { SettlementRow } from '../../labData';
import { Price } from '@sd/ui';

/** What one settlement run pays and what it carries into the next run. */
export interface SettlementTableProps {
  rows: SettlementRow[];
  run: { count: number; paidPoisha: number; carriedPoisha: number };
  copy: Dictionary['csLab'];
  locale: Locale;
}

export function SettlementTable({ rows, run, copy, locale }: SettlementTableProps) {
  return (
    <div>
      <ul className="divide-y divide-line rounded-sm border border-line">
        {rows.map((row) => (
          <li
            key={row.amountMinor}
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
          >
            <Price amountMinor={row.amountMinor} locale={locale} size="sm" />
            <span className="text-xs text-ink-muted">
              {row.status === 'paid' ? copy.paid : copy.carried}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink">
        <span>
          {copy.paid}: <Price amountMinor={run.paidPoisha} locale={locale} size="sm" />
        </span>
        <span>
          {copy.carried}: <Price amountMinor={run.carriedPoisha} locale={locale} size="sm" />
        </span>
      </p>
    </div>
  );
}
