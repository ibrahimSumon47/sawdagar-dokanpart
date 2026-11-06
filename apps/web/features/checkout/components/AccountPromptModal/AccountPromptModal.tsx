'use client';

import { ButtonLink } from '@sd/ui';
import { useEffect, useRef } from 'react';
import type { Dictionary } from '../../../../i18n';

export interface AccountPromptModalProps {
  copy: Dictionary['checkout'];
  /** Email from the guest order, used to prefill the sign-up and sign-in pages. */
  email: string | null;
}

/**
 * Account prompt shown once on the confirmation page. Closing the dialog in any
 * way (button, Escape or backdrop) counts as Continue as guest, so the guest
 * stays on the page and the order is untouched.
 */
export function AccountPromptModal({ copy, email }: AccountPromptModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const query = email ? `?email=${encodeURIComponent(email)}` : '';

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="account-prompt-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-sm border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-ink/40"
    >
      <div className="space-y-4 p-6">
        <h2 id="account-prompt-title" className="font-serif text-2xl text-ink">
          {copy.accountPromptTitle}
        </h2>
        <p className="text-sm leading-relaxed text-ink-muted">{copy.accountPromptBody}</p>
        <div className="flex flex-col gap-2">
          <ButtonLink href={`/register${query}`} className="w-full">
            {copy.createAccount}
          </ButtonLink>
          <ButtonLink href={`/login${query}`} variant="secondary" className="w-full">
            {copy.signInInstead}
          </ButtonLink>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 rounded-sm text-sm font-medium text-accent underline underline-offset-4"
          >
            {copy.continueAsGuest}
          </button>
        </div>
      </div>
    </dialog>
  );
}
