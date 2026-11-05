import type { AuthCopy } from '../../copy';
import { authMessage } from '../../messages';

export interface FormMessagesProps {
  copy: AuthCopy;
  /** Message key returned by the action's form state, if any. */
  message?: string;
  tone?: 'error' | 'success';
}

const toneClass = {
  error: 'border-danger/30 bg-danger/5 text-danger',
  success: 'border-success/30 bg-success/5 text-success',
} as const;

/** Shows one translated error or confirmation inside an auth form. */
export function FormMessages({ copy, message, tone = 'error' }: FormMessagesProps) {
  if (!message) return null;

  return (
    <p role="alert" className={`rounded-sm border px-4 py-3 text-sm ${toneClass[tone]}`}>
      {authMessage(copy, message)}
    </p>
  );
}
