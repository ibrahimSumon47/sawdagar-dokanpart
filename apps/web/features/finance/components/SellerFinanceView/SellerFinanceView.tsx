import type { Dictionary, Locale } from '../../../../i18n';
import { SellerNotice } from '../../../seller/components/SellerNotice';
import { SellerSection } from '../../../seller/components/SellerSection';
import type { SellerNoticeResult } from '../../../seller/notice';
import type { SellerFinance } from '../../queries';
import { PayoutHistoryList } from '../PayoutHistoryList';
import { PayoutRequestForm } from '../PayoutRequestForm';
import { RefundHistoryList } from '../RefundHistoryList';
import { SellerFinanceStats } from '../SellerFinanceStats';
import { StatementTable } from '../StatementTable';

export interface SellerFinanceViewProps {
  finance: SellerFinance;
  copy: Dictionary['seller'];
  locale: Locale;
  canManage: boolean;
  notice: SellerNoticeResult | null;
}

/** Seller finance page: balance tiles, withdrawal request, history and statement. */
export function SellerFinanceView({
  finance,
  copy,
  locale,
  canManage,
  notice,
}: SellerFinanceViewProps) {
  return (
    <SellerSection
      active="finance"
      title={copy.financeTitle}
      description={copy.financeDescription}
      copy={copy}
    >
      <SellerNotice message={notice?.message ?? null} tone={notice?.tone} />

      <div className="mt-4">
        <SellerFinanceStats finance={finance} copy={copy} locale={locale} />
      </div>

      {canManage ? <PayoutRequestForm copy={copy} /> : null}

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.payoutHistory}</h2>
        {finance.payouts.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noPayouts}
          </p>
        ) : (
          <PayoutHistoryList payouts={finance.payouts} copy={copy} locale={locale} />
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.refundHistoryTitle}</h2>
        <p className="mt-1 text-sm text-ink-muted">{copy.refundHistoryDescription}</p>
        {finance.refunds.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noRefunds}
          </p>
        ) : (
          <RefundHistoryList refunds={finance.refunds} copy={copy} locale={locale} />
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">{copy.statementTitle}</h2>
        <p className="mt-1 text-sm text-ink-muted">{copy.statementDescription}</p>
        {finance.statement.length === 0 ? (
          <p className="mt-3 rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
            {copy.noStatement}
          </p>
        ) : (
          <StatementTable statement={finance.statement} copy={copy} locale={locale} />
        )}
      </section>
    </SellerSection>
  );
}
