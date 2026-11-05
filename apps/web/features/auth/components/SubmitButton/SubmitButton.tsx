'use client';

import { Button, type ButtonSize, type ButtonVariant } from '@sd/ui';
import { useFormStatus } from 'react-dom';

export interface SubmitButtonProps {
  /** Label shown while the form is idle. */
  label: string;
  /** Label shown while the server action runs. */
  pendingLabel: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  /** Also disables the button when the deployment cannot accept the form. */
  disabled?: boolean;
}

/** Submit button that reports its pending state without extra client state. */
export function SubmitButton({
  label,
  pendingLabel,
  size,
  variant,
  className,
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={size}
      variant={variant}
      disabled={pending || disabled}
      className={className}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}
