import type { ReactNode } from 'react';

export interface FormFieldProps {
  htmlFor: string;
  label: string;
  /** Small supporting line below the control. */
  hint?: string;
  children: ReactNode;
}

/** Label, optional hint and control wrapper used by the profile form. */
export function FormField({ htmlFor, label, hint, children }: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div>
      <label htmlFor={htmlFor} className="text-xs font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
