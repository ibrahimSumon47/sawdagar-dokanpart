'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Localised accessible name for the whole control, for example "Quantity". */
  label: string;
  /** Localised accessible names for the two buttons. */
  labels: { decrease: string; increase: string };
  className?: string;
}

/** Accessible quantity control used on product and cart pages. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  labels,
  className,
}: QuantityStepperProps) {
  const step = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) onChange(next);
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center rounded-sm border border-line bg-surface', className)}
    >
      <button
        type="button"
        aria-label={labels.decrease}
        onClick={() => step(-1)}
        disabled={value <= min}
        className="grid size-11 place-items-center text-ink transition-colors hover:text-accent disabled:opacity-40"
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <output aria-live="polite" className="w-8 text-center text-sm tabular-nums">
        {value}
      </output>
      <button
        type="button"
        aria-label={labels.increase}
        onClick={() => step(1)}
        disabled={value >= max}
        className="grid size-11 place-items-center text-ink transition-colors hover:text-accent disabled:opacity-40"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
