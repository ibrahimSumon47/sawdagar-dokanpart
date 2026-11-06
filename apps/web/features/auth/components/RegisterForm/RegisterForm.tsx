'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { AuthCopy } from '../../copy';
import { registerAction } from '../../actions';
import { emptyAuthState } from '../../state';
import { authMessage } from '../../messages';
import { AuthField } from '../AuthField';
import { AuthSetupNotice } from '../AuthSetupNotice';
import { FormMessages } from '../FormMessages';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { SubmitButton } from '../SubmitButton';

export interface RegisterFormProps {
  copy: AuthCopy;
  /** Deployment has the database and auth secret. */
  configured: boolean;
  /** Prefills the email field, for example from a guest order's email. */
  defaultEmail?: string;
}

const roleCard =
  'flex cursor-pointer gap-3 rounded-sm border border-line p-3 text-sm transition-colors has-checked:border-accent has-checked:bg-accent/5';

/** Buyer or seller registration. Seller requests are reviewed before approval. */
export function RegisterForm({ copy, configured, defaultEmail }: RegisterFormProps) {
  const [state, formAction] = useActionState(registerAction, emptyAuthState);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [password, setPassword] = useState('');
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {configured ? null : <AuthSetupNotice copy={copy} />}
      <FormMessages copy={copy} message={state.error} />
      <AuthField
        name="name"
        label={copy.auth.name}
        autoComplete="name"
        error={authMessage(copy, errors.name)}
        required
      />
      <AuthField
        name="email"
        label={copy.auth.email}
        type="email"
        autoComplete="email"
        inputMode="email"
        defaultValue={defaultEmail}
        error={authMessage(copy, errors.email)}
        required
      />
      <AuthField
        name="phone"
        label={copy.auth.phone}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        hint={copy.auth.phoneHint}
        error={authMessage(copy, errors.phone)}
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold text-ink">{copy.auth.roleLegend}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className={roleCard}>
            <input
              type="radio"
              name="role"
              value="buyer"
              checked={role === 'buyer'}
              onChange={() => setRole('buyer')}
              className="mt-0.5 size-4 accent-accent"
            />
            <span>
              <span className="block font-semibold text-ink">{copy.auth.roleBuyer}</span>
              <span className="block text-xs text-ink-muted">{copy.auth.roleBuyerHint}</span>
            </span>
          </label>
          <label className={roleCard}>
            <input
              type="radio"
              name="role"
              value="seller"
              checked={role === 'seller'}
              onChange={() => setRole('seller')}
              className="mt-0.5 size-4 accent-accent"
            />
            <span>
              <span className="block font-semibold text-ink">{copy.auth.roleSeller}</span>
              <span className="block text-xs text-ink-muted">{copy.auth.roleSellerHint}</span>
            </span>
          </label>
        </div>
      </fieldset>

      {role === 'seller' ? (
        <AuthField
          name="businessName"
          label={copy.auth.businessName}
          autoComplete="organization"
          error={authMessage(copy, errors.businessName)}
          required
        />
      ) : null}

      <div>
        <AuthField
          name="password"
          label={copy.auth.password}
          type="password"
          autoComplete="new-password"
          hint={copy.auth.passwordHint}
          error={authMessage(copy, errors.password)}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
        />
        <PasswordStrengthMeter value={password} labels={copy.auth.strength} />
      </div>
      <AuthField
        name="confirmPassword"
        label={copy.auth.confirmPassword}
        type="password"
        autoComplete="new-password"
        error={authMessage(copy, errors.confirmPassword)}
        required
      />

      <div className="flex items-start gap-2">
        <input
          id="acceptTerms"
          type="checkbox"
          name="acceptTerms"
          className="mt-1 size-4 shrink-0 accent-accent"
          aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
        />
        <div className="text-sm text-ink">
          <label htmlFor="acceptTerms">{copy.auth.termsLead}</label>{' '}
          <Link href="/help/terms" className="underline underline-offset-2 hover:text-accent">
            {copy.auth.termsLink}
          </Link>{' '}
          <span>{copy.auth.termsTail}</span>{' '}
          <Link href="/help/privacy" className="underline underline-offset-2 hover:text-accent">
            {copy.auth.privacyLink}
          </Link>
          {errors.acceptTerms ? (
            <p id="acceptTerms-error" className="mt-1 text-xs text-danger">
              {authMessage(copy, errors.acceptTerms)}
            </p>
          ) : null}
        </div>
      </div>

      <SubmitButton
        label={copy.auth.create}
        pendingLabel={copy.auth.creating}
        className="w-full"
        disabled={!configured}
      />
    </form>
  );
}
