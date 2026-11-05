import { ButtonLink } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { resendVerificationAction } from '../../actions';
import { SubmitButton } from '../SubmitButton';

export interface VerifyEmailPanelProps {
  copy: Dictionary;
  /** Address the verification mail was sent to, when known. */
  email?: string;
  /** The signed-in user has already verified the address. */
  verified?: boolean;
  /** The link was just re-sent. */
  justSent?: boolean;
  /** The link in the address bar could not be used. */
  invalid?: boolean;
}

/**
 * Tells the visitor what happened to their verification email.
 *
 * Verification is optional for signing in, so a missing or expired link never
 * blocks the account; the panel only explains how to get a fresh one.
 */
export function VerifyEmailPanel({
  copy,
  email,
  verified,
  justSent,
  invalid,
}: VerifyEmailPanelProps) {
  const status = verified
    ? copy.auth.verified
    : invalid
      ? copy.auth.verifyInvalid
      : copy.auth.unverified;

  return (
    <div className="space-y-4">
      <p
        role="status"
        className={`rounded-sm border px-4 py-3 text-sm ${
          verified
            ? 'border-success/30 bg-success/5 text-success'
            : 'border-line bg-background text-ink-muted'
        }`}
      >
        {status}
      </p>
      {email ? <p className="text-sm text-ink">{email}</p> : null}
      <p className="text-sm text-ink-muted">{copy.auth.verifyBody}</p>
      {justSent ? <p className="text-sm text-success">{copy.auth.verifySent}</p> : null}

      {verified ? (
        <ButtonLink href="/account">{copy.account.title}</ButtonLink>
      ) : (
        <form action={resendVerificationAction}>
          <SubmitButton
            label={copy.auth.verifyResend}
            pendingLabel={copy.auth.verifyResending}
            variant="secondary"
          />
        </form>
      )}
    </div>
  );
}
