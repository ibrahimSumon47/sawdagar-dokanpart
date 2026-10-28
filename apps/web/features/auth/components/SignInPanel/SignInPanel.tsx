import { demoAccounts } from '@sd/domain';
import type { Dictionary } from '../../../../i18n';
import type { DemoSignInError } from '../../actions';
import { DemoAccountCard } from '../DemoAccountCard';
import { SetupNotice } from '../SetupNotice';

export interface SignInPanelProps {
  copy: Dictionary;
  /** Internal page to continue to after sign-in. */
  next: string;
  /** Deployment has both auth secrets. */
  configured: boolean;
  error?: DemoSignInError;
}

const errorCopy = {
  unknown: (copy: Dictionary) => copy.signIn.errorUnknown,
  failed: (copy: Dictionary) => copy.signIn.errorFailed,
  'not-configured': (copy: Dictionary) => copy.signIn.errorNotConfigured,
} as const;

/** Sign-in page body: demo role cards, or a setup notice without secrets. */
export function SignInPanel({ copy, next, configured, error }: SignInPanelProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {copy.common.demoNotice}
        </p>
        <h1 className="mt-3 text-display font-serif leading-tight text-ink">{copy.signIn.title}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{copy.signIn.description}</p>
      </header>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {errorCopy[error](copy)}
        </p>
      ) : null}

      {configured ? (
        <section className="mt-10" aria-labelledby="demo-heading">
          <h2 id="demo-heading" className="font-serif text-2xl text-ink">
            {copy.signIn.demoTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">{copy.signIn.demoBody}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {demoAccounts.map((account) => (
              <li key={account.email}>
                <DemoAccountCard
                  email={account.email}
                  name={account.name}
                  roleLabel={copy.roles[account.role]}
                  next={next}
                  labels={{
                    tryDemo: copy.signIn.tryDemo,
                    pending: copy.signIn.pending,
                  }}
                />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ink-muted">{copy.signIn.notice}</p>
        </section>
      ) : (
        <SetupNotice
          title={copy.signIn.notConfiguredTitle}
          body={copy.signIn.notConfiguredBody}
          hint={copy.signIn.notConfiguredHint}
        />
      )}
    </div>
  );
}
