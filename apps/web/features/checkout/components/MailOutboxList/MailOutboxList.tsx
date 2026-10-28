import { Badge, EmptyState } from '@sd/ui';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { MailRecord } from '../../queries';

export interface MailOutboxListProps {
  messages: MailRecord[];
  copy: Dictionary['mail'];
  locale: Locale;
}

/** Read-only list of the messages a real deployment would email. */
export function MailOutboxList({ messages, copy, locale }: MailOutboxListProps) {
  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<Mail aria-hidden="true" className="size-8" />}
        title={copy.emptyTitle}
        description={copy.emptyBody}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((message) => (
        <li key={message.id} className="rounded-sm border border-line bg-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">{copy.subject}</p>
              <h2 className="mt-0.5 font-medium text-ink">{message.subject}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-muted">
                {formatDate(message.createdAt, locale)}
              </span>
              <Badge tone="neutral">{copy.queued}</Badge>
            </div>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {copy.to}: {message.toEmail}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
            {message.bodyText}
          </p>
          {message.orderNumber ? (
            <Link
              href={`/orders/${message.orderNumber}`}
              className="mt-3 inline-block text-sm font-medium text-accent underline underline-offset-4"
            >
              {copy.orderLink}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
