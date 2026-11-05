'use client';

import { useActionState } from 'react';
import type { Dictionary } from '../../../../i18n';
import { resetPasswordAction } from '../../actions';
import { emptyAuthState } from '../../state';
import { authMessage } from '../../messages';
import { AuthField } from '../AuthField';
import { FormMessages } from '../FormMessages';
import { SubmitButton } from '../SubmitButton';

export interface ResetPasswordFormProps {
  copy: Dictionary;
  /** Token taken from the reset link. */
  token: string;
}

/** Sets a new password from the emailed token, then returns to sign-in. */
export function ResetPasswordForm({ copy, token }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(resetPasswordAction, emptyAuthState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessages copy={copy} message={state.error} />
      <AuthField
        name="password"
        label={copy.auth.newPassword}
        type="password"
        autoComplete="new-password"
        hint={copy.auth.passwordHint}
        error={authMessage(copy, state.fieldErrors?.password)}
        required
      />
      <AuthField
        name="confirmPassword"
        label={copy.auth.confirmPassword}
        type="password"
        autoComplete="new-password"
        error={authMessage(copy, state.fieldErrors?.confirmPassword)}
        required
      />
      <SubmitButton
        label={copy.auth.resetSubmit}
        pendingLabel={copy.auth.resetSaving}
        className="w-full"
      />
    </form>
  );
}
