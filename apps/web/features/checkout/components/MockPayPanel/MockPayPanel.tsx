import { Button, Price } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { failMockPaymentAction, payMockPaymentAction } from '../../actions';
import { SubmitButton } from '../../../auth/components/SubmitButton';
import { formatTemplate } from '../../../shop/formatTemplate';

export interface MockPayPanelProps {
  paymentId: string;
  token: string;
  orderNumber: string;
  amountMinor: number;
  locale: Locale;
  copy: Dictionary['checkout'];
}

/** The demo gateway page: one pay action, one cancel action, no card fields. */
export function MockPayPanel({
  paymentId,
  token,
  orderNumber,
  amountMinor,
  locale,
  copy,
}: MockPayPanelProps) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6">
      <div className="rounded-sm border border-line bg-surface p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{copy.mockPayTitle}</p>
        <h1 className="mt-1 font-serif text-title leading-tight text-ink">{copy.mockPayAmount}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {formatTemplate(copy.mockPayOrder, { number: orderNumber })}
        </p>

        <p className="mt-6 font-serif text-4xl text-ink">
          <Price amountMinor={amountMinor} locale={locale} size="lg" />
        </p>

        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{copy.sandboxNote}</p>

        <form action={payMockPaymentAction} className="mt-6">
          <input type="hidden" name="paymentId" value={paymentId} />
          <input type="hidden" name="token" value={token} />
          <SubmitButton label={copy.payNow} pendingLabel={copy.placingOrder} className="w-full" />
        </form>

        <form action={failMockPaymentAction} className="mt-2">
          <input type="hidden" name="paymentId" value={paymentId} />
          <input type="hidden" name="token" value={token} />
          <Button type="submit" variant="secondary" className="w-full">
            {copy.cancelPayment}
          </Button>
        </form>
      </div>
    </div>
  );
}
