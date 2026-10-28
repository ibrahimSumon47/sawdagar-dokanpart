'use client';

import { QuantityStepper } from '@sd/ui';
import { useState } from 'react';

export interface QuantityDemoProps {
  label: string;
  decrease: string;
  increase: string;
}

/** Holds local quantity state so the gallery can exercise the stepper. */
export function QuantityDemo({ label, decrease, increase }: QuantityDemoProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <QuantityStepper
      value={quantity}
      onChange={setQuantity}
      label={label}
      labels={{ decrease, increase }}
    />
  );
}
