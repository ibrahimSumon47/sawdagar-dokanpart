import type { ChangeEventHandler, Ref } from 'react';

export interface AuthFieldProps {
  /** Input id and name; the label points at it. */
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  /** Autocomplete hint so password managers fill the right box. */
  autoComplete?: string;
  defaultValue?: string;
  /** Already-translated message shown under the input. */
  error?: string;
  hint?: string;
  required?: boolean;
  inputMode?: 'text' | 'tel' | 'email';
  placeholder?: string;
  /** Ref to the input, used when another control should fill the field. */
  inputRef?: Ref<HTMLInputElement>;
  /** Fires on every keystroke, for live hints such as the strength meter. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const inputClass =
  'mt-1 min-h-11 w-full rounded-sm border border-line bg-background px-3 text-sm text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40';

/** Label, input, optional hint and inline error used across the auth forms. */
export function AuthField({
  name,
  label,
  type = 'text',
  autoComplete,
  defaultValue,
  error,
  hint,
  required,
  inputMode,
  placeholder,
  inputRef,
  onChange,
}: AuthFieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold text-ink">
        {label}
      </label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={onChange}
        className={`${inputClass} ${error ? 'border-danger' : ''}`}
      />
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
