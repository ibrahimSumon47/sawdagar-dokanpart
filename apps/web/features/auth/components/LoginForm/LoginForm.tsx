'use client';

import { ButtonLink } from '@sd/ui';
import { useActionState, useRef } from 'react';
import type { Dictionary } from '../../../../i18n';
import { signInAction } from '../../actions';
import { emptyAuthState } from '../../state';
import { authMessage } from '../../messages';
import { AuthField } from '../AuthField';
import { AuthSetupNotice } from '../AuthSetupNotice';
import { DemoAccountPicker } from '../DemoAccountPicker';
import { FormMessages } from '../FormMessages';
import { SubmitButton } from '../SubmitButton';

export interface LoginFormProps {
  copy: Dictionary;
  /** Internal page to open after a successful sign-in. */
  next: string;
  /** Deployment has the database and auth secret. */
  configured: boolean;
  /** Show the confirmation that a password was just reset. */
  resetDone?: boolean;
}

/** Email and password sign-in form; the only way into an account. */
export function LoginForm({ copy, next, configured, resetDone }: LoginFormProps) {
  const [state, formAction] = useActionState(signInAction, emptyAuthState);
  const emailRef = useRef<HTMLInputElement>(null);
  const errors = state.fieldErrors ?? {};

  return (
    <>
      {configured ? null : <AuthSetupNotice copy={copy} />}
      {resetDone ? (
        <p className="mb-5 rounded-sm border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          {copy.auth.resetDone}
        </p>
      ) : null}

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <FormMessages copy={copy} message={state.error} />
        <AuthField
          name="email"
          label={copy.auth.email}
          type="email"
          autoComplete="email"
          inputMode="email"
          inputRef={emailRef}
          error={authMessage(copy, errors.email)}
          required
        />
        <AuthField
          name="password"
          label={copy.auth.password}
          type="password"
          autoComplete="current-password"
          error={authMessage(copy, errors.password)}
          required
        />
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="remember" className="size-4 accent-accent" />
            {copy.auth.remember}
          </label>
          <ButtonLink href="/forgot-password" variant="ghost" size="sm">
            {copy.auth.forgot}
          </ButtonLink>
        </div>
        <SubmitButton
          label={copy.auth.signIn}
          pendingLabel={copy.auth.signingIn}
          className="w-full"
          disabled={!configured}
        />
      </form>

      {configured ? (
        <DemoAccountPicker
          copy={copy}
          onPick={(email) => {
            if (!emailRef.current) return;
            emailRef.current.value = email;
            emailRef.current.focus();
          }}
        />
      ) : null}
    </>
  );
}
