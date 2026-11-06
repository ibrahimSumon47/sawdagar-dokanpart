'use client';

import { cn } from '@sd/ui';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackOrderAction, type TrackingFormState } from '../actions';

export interface TrackOrderFormProps {
  /** Labels and messages for the active language. */
  labels: TrackOrderLabels;
}

/** Text shown on the tracking form, supplied by the page so it follows the locale. */
export interface TrackOrderLabels {
  codeLabel: string;
  contactLabel: string;
  submit: string;
  pending: string;
  codeInvalid: string;
  contactInvalid: string;
  failed: string;
}

const initialState: TrackingFormState = {};

/**
 * Public tracking form: an order code plus the phone or email used at checkout.
 * A matched order navigates to its timeline; every other failure shows one sentence.
 */
export function TrackOrderForm({ labels }: TrackOrderFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(trackOrderAction, initialState);

  useEffect(() => {
    if (state.redirectTo) router.push(state.redirectTo);
  }, [state.redirectTo, router]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <label className="block text-sm font-medium text-ink">
        {labels.codeLabel}
        <input
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
          aria-invalid={state.fieldError === 'code' || undefined}
          className={cn(
            'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 font-mono uppercase tracking-wider text-ink',
            state.fieldError === 'code' && 'field-shake border-danger',
          )}
        />
        {state.fieldError === 'code' ? (
          <span className="mt-1 block text-sm text-danger">{labels.codeInvalid}</span>
        ) : null}
      </label>
      <label className="block text-sm font-medium text-ink">
        {labels.contactLabel}
        <input
          name="contact"
          autoComplete="off"
          required
          aria-invalid={state.fieldError === 'contact' || undefined}
          className={cn(
            'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-ink',
            state.fieldError === 'contact' && 'field-shake border-danger',
          )}
        />
        {state.fieldError === 'contact' ? (
          <span className="mt-1 block text-sm text-danger">{labels.contactInvalid}</span>
        ) : null}
      </label>
      {state.failed ? (
        <p role="alert" className="text-sm text-danger">
          {labels.failed}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-brand px-4 py-2.5 text-sm font-semibold text-on-brand disabled:opacity-60"
      >
        {pending ? labels.pending : labels.submit}
      </button>
    </form>
  );
}
