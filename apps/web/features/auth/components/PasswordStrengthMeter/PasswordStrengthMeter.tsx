'use client';

import { passwordStrength } from '@sd/domain';

export interface PasswordStrengthMeterProps {
  /** Current value of the password input. */
  value: string;
  /** Translated band labels from the message catalogue. */
  labels: { weak: string; fair: string; good: string; strong: string };
}

const barClass = ['bg-danger', 'bg-danger', 'bg-accent', 'bg-success', 'bg-success'];

/** Four-step strength hint under the registration password field. */
export function PasswordStrengthMeter({ value, labels }: PasswordStrengthMeterProps) {
  if (!value) return null;

  const strength = passwordStrength(value);
  const label = labels[strength.label];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((step) => (
          <span
            key={step}
            className={`h-1 flex-1 rounded-full ${
              strength.score > step ? barClass[strength.score] : 'bg-line'
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </div>
  );
}
