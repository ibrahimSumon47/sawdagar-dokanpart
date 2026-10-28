'use client';

import type { Dictionary } from '../../../../i18n';
import type { PaymentMethod } from '../../inputs';

export interface PaymentOptionsProps {
  value: PaymentMethod;
  onChange: (next: PaymentMethod) => void;
  copy: Dictionary['checkout'];
}

const cardClass =
  'flex cursor-pointer gap-3 rounded-sm border border-line bg-surface p-4 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5';

/** Cash on delivery and the sandbox gateway, as one accessible radio group. */
export function PaymentOptions({ value, onChange, copy }: PaymentOptionsProps) {
  return (
    <fieldset className="mt-4 grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">{copy.paymentTitle}</legend>
      <label className={cardClass}>
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          checked={value === 'cod'}
          onChange={() => onChange('cod')}
          className="mt-1 size-4 accent-[var(--color-accent)]"
        />
        <span>
          <span className="block text-sm font-semibold text-ink">{copy.codTitle}</span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{copy.codBody}</span>
        </span>
      </label>

      <label className={cardClass}>
        <input
          type="radio"
          name="paymentMethod"
          value="mockpay"
          checked={value === 'mockpay'}
          onChange={() => onChange('mockpay')}
          className="mt-1 size-4 accent-[var(--color-accent)]"
        />
        <span>
          <span className="block text-sm font-semibold text-ink">{copy.mockPayTitle}</span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
            {copy.mockPayBody}
          </span>
        </span>
      </label>
    </fieldset>
  );
}
