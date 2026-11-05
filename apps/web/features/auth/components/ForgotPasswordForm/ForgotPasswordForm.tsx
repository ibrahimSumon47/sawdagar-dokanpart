'use client';

import { useActionState } from 'react';
import type { Dictionary } from '../../../../i18n';
import { requestPasswordResetAction } from '../../actions';
import { emptyAuthState } from '../../state';
import { authMessage } from '../../messages';
import { AuthField } from '../AuthField';
import { FormMessages } from '../FormMessages';
import { SubmitButton } from '../SubmitButton';

export interface ForgotPasswordFormProps {
  copy: Dictionary;
}

/** Requests a reset link; the same confirmation is shown for unknown emails. */
export function ForgotPasswordForm({ copy }: ForgotPasswordFormProps) {
  const [state, formAction] = useActionState(requestPasswordResetAction, emptyAuthState);

  if (state.sent) {
    return (
      <p
        role="status"
        className="rounded-sm border border-success/30 bg-success/5 px-4 py-3 text-sm text-success"
      >
        {copy.auth.forgotSent}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormMessages copy={copy} message={state.error} />
      <AuthField
        name="email"
        label={copy.auth.email}
        type="email"
        autoComplete="email"
        inputMode="email"
        error={authMessage(copy, state.fieldErrors?.email)}
        required
      />
      <SubmitButton
        label={copy.auth.forgotSubmit}
        pendingLabel={copy.auth.forgotSending}
        className="w-full"
      />
    </form>
  );
}
