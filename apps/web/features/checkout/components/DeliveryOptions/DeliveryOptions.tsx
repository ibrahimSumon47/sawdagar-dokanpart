'use client';

import type { Dictionary } from '../../../../i18n';
import type { DeliveryMethod } from '../../inputs';

export interface DeliveryOptionsProps {
  value: DeliveryMethod;
  onChange: (next: DeliveryMethod) => void;
  copy: Dictionary['checkout'];
}

const methods: DeliveryMethod[] = ['standard', 'express'];

/** Standard or express delivery choice, as one accessible radio group. */
export function DeliveryOptions({ value, onChange, copy }: DeliveryOptionsProps) {
  return (
    <fieldset className="mt-3 grid gap-2 sm:grid-cols-2">
      <legend className="sr-only">{copy.deliveryTitle}</legend>
      {methods.map((method) => (
        <label
          key={method}
          className="flex cursor-pointer gap-3 rounded-sm border border-line bg-background p-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/5"
        >
          <input
            type="radio"
            name="deliveryMethod"
            value={method}
            checked={value === method}
            onChange={() => onChange(method)}
            className="mt-0.5 size-4 accent-[var(--color-accent)]"
          />
          <span className="font-medium text-ink">
            {method === 'standard' ? copy.deliveryStandard : copy.deliveryExpress}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
