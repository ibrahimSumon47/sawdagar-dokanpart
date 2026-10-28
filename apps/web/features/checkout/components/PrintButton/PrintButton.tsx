'use client';

import { Button } from '@sd/ui';

export interface PrintButtonProps {
  label: string;
}

/** Opens the browser print dialog for the invoice page. */
export function PrintButton({ label }: PrintButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => window.print()}
      className="print:hidden"
    >
      {label}
    </Button>
  );
}
