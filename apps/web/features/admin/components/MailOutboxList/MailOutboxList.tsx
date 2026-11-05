import type { Locale } from '../../../../i18n';

export interface OutboxMessage {
  id: string;
  toEmail: string;
  subject: string;
  bodyText: string;
  status: string;
  createdAt: Date;
}

export interface MailOutboxListProps {
  messages: readonly OutboxMessage[];
  /** Shown when nothing has been queued yet. */
  emptyLabel: string;
  locale: Locale;
}

/** Queued mail with the body folded open, used to follow a reset link. */
export function MailOutboxList({ messages, emptyLabel, locale }: MailOutboxListProps) {
  const formatter = new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (messages.length === 0) {
    return (
      <p className="rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((message) => (
        <li key={message.id} className="rounded-sm border border-line bg-surface">
          <details className="group">
            <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-2 p-4 text-sm">
              <span className="font-semibold text-ink">{message.subject}</span>
              <span className="text-ink-muted">{message.toEmail}</span>
              <span className="text-xs uppercase tracking-wide text-ink-muted">
                {message.status} · {formatter.format(message.createdAt)}
              </span>
            </summary>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words border-t border-line p-4 text-xs text-ink">
              {message.bodyText}
            </pre>
          </details>
        </li>
      ))}
    </ul>
  );
}
