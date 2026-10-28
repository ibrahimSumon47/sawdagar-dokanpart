import { planSettlement } from '@sd/cs-core';
import { Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { PayoutRecord } from '../../queries';

export interface SettlementPreviewProps {
  payouts: PayoutRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

/**
 * Shows what the next payout batch would pay and what it would carry forward,
 * using the settlement rules exercised by the Java reference in CI.
 */
export function SettlementPreview({ payouts, copy, locale }: SettlementPreviewProps) {
  const queue = payouts.filter(
    (payout) => payout.status === 'requested' || payout.status === 'approved',
  );
  const run = planSettlement(
    queue.map((payout) => ({ id: payout.id, amountPoisha: payout.amountMinor })),
  );

  return (
    <section className="mt-8 rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-xl text-ink">{copy.settlementTitle}</h2>
      <p className="mt-1 max-w-3xl text-sm text-ink-muted">{copy.settlementBody}</p>

      {run.count === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{copy.settlementEmpty}</p>
      ) : (
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">
              {copy.settlementReady(String(run.count))}
            </dt>
            <dd className="mt-1 text-lg text-ink">
              <Price amountMinor={run.paidPoisha} locale={locale} size="md" />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">
              {copy.settlementCarried}
            </dt>
            <dd className="mt-1 text-lg text-ink">
              <Price amountMinor={run.carriedPoisha} locale={locale} size="md" />
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
