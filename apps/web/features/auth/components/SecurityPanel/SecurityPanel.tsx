'use client';

import { ButtonLink } from '@sd/ui';
import { useActionState } from 'react';
import type { AuthCopy } from '../../copy';
import { changePasswordAction, signOut } from '../../actions';
import { emptyAuthState } from '../../state';
import { authMessage } from '../../messages';
import { AuthField } from '../AuthField';
import { FormMessages } from '../FormMessages';
import { SubmitButton } from '../SubmitButton';

export interface SecurityPanelProps {
  copy: AuthCopy;
  /** Address on the account, shown so the visitor knows which one is verified. */
  email: string;
  /** Better Auth has marked the address verified. */
  verified: boolean;
}

/** Password change, email verification status and the sign-out control. */
export function SecurityPanel({ copy, email, verified }: SecurityPanelProps) {
  const [state, formAction] = useActionState(changePasswordAction, emptyAuthState);

  return (
    <div className="space-y-8">
      <section aria-labelledby="verification-heading">
        <h2 id="verification-heading" className="font-serif text-xl text-ink">
          {copy.auth.verifyTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {email} · {verified ? copy.auth.verified : copy.auth.unverified}
        </p>
        {verified ? null : (
          <ButtonLink href="/verify-email" variant="secondary" size="sm" className="mt-3">
            {copy.auth.verifyResend}
          </ButtonLink>
        )}
      </section>

      <section aria-labelledby="password-heading">
        <h2 id="password-heading" className="font-serif text-xl text-ink">
          {copy.auth.changePassword}
        </h2>
        <form action={formAction} className="mt-3 max-w-sm space-y-4" noValidate>
          {state.saved ? (
            <p role="status" className="text-sm text-success">
              {copy.auth.passwordChanged}
            </p>
          ) : null}
          <FormMessages copy={copy} message={state.error} />
          <AuthField
            name="currentPassword"
            label={copy.auth.currentPassword}
            type="password"
            autoComplete="current-password"
            error={authMessage(copy, state.fieldErrors?.currentPassword)}
            required
          />
          <AuthField
            name="newPassword"
            label={copy.auth.newPassword}
            type="password"
            autoComplete="new-password"
            hint={copy.auth.passwordHint}
            error={authMessage(copy, state.fieldErrors?.newPassword)}
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
            label={copy.auth.changePassword}
            pendingLabel={copy.auth.changingPassword}
          />
        </form>
        <p className="mt-3 max-w-md text-xs text-ink-muted">{copy.auth.sessionsBody}</p>
      </section>

      <form action={signOut}>
        <SubmitButton
          label={copy.auth.signOut}
          pendingLabel={copy.auth.signOut}
          variant="secondary"
        />
      </form>
    </div>
  );
}
