import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { requestPayoutAction } from '../../actions';

export interface PayoutRequestFormProps {
  copy: Dictionary['seller'];
}

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Withdrawal request form shown only to a store owner. */
export function PayoutRequestForm({ copy }: PayoutRequestFormProps) {
  return (
    <form
      action={requestPayoutAction}
      className="mt-6 space-y-4 rounded-sm border border-line bg-surface p-5"
    >
      <div>
        <h2 className="font-serif text-xl text-ink">{copy.requestPayoutTitle}</h2>
        <p className="mt-1 text-sm text-ink-muted">{copy.requestPayoutDescription}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className="text-xs font-semibold text-ink">
            {copy.payoutAmount}
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="payout-note" className="text-xs font-semibold text-ink">
            {copy.payoutNote}
          </label>
          <input id="payout-note" name="note" maxLength={200} className={fieldClass} />
        </div>
      </div>
      <Button type="submit">{copy.requestPayout}</Button>
    </form>
  );
}
