'use client';

import { Button, type ButtonSize } from '@sd/ui';
import { useFormStatus } from 'react-dom';

export interface SubmitButtonProps {
  /** Label shown while the form is idle. */
  label: string;
  /** Label shown while the server action runs. */
  pendingLabel: string;
  size?: ButtonSize;
  className?: string;
}

/** Submit button that reports its pending state without extra client state. */
export function SubmitButton({ label, pendingLabel, size, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size={size} disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
