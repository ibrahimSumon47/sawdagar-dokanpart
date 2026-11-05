'use client';

import { demoAccounts } from '@sd/domain';
import type { AuthCopy } from '../../copy';

export interface DemoAccountPickerProps {
  copy: AuthCopy;
  /** Called with the chosen demo email; the form still submits normally. */
  onPick: (email: string) => void;
}

/**
 * Collapsed list of the seeded review accounts.
 *
 * It only writes the email into the sign-in form. The password is the shared
 * demo password set at seed time, so the picker never handles a secret.
 */
export function DemoAccountPicker({ copy, onPick }: DemoAccountPickerProps) {
  return (
    <details className="mt-6 rounded-sm border border-dashed border-line px-4 py-3">
      <summary className="cursor-pointer text-sm font-semibold text-ink">
        {copy.auth.tryTitle}
      </summary>
      <p className="mt-2 text-xs text-ink-muted">{copy.auth.tryBody}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {demoAccounts.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => onPick(account.email)}
              className="w-full rounded-sm border border-line px-3 py-2 text-left text-xs transition-colors hover:border-accent hover:text-accent"
            >
              <span className="block font-semibold text-ink">{copy.roles[account.role]}</span>
              <span className="block text-ink-muted">{account.email}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">{copy.auth.tryNote}</p>
    </details>
  );
}
