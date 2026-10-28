import type { Dictionary } from '../../../../i18n';
import type { Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';

export interface AuditEntryView {
  id: string;
  action: string;
  actorEmail: string;
  createdAt: Date;
}

export interface AuditListProps {
  entries: readonly AuditEntryView[];
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Newest audit entries, with the action code kept visible for operators. */
export function AuditList({ entries, copy, locale }: AuditListProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-sm border border-line bg-surface p-4 text-sm text-ink-muted">
        {copy.noEntries}
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-sm border border-line bg-surface">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line px-4 py-3 last:border-b-0"
        >
          <code className="rounded-sm bg-background px-2 py-0.5 text-xs text-ink">
            {entry.action}
          </code>
          <span className="min-w-0 flex-1 truncate text-xs text-ink-muted">{entry.actorEmail}</span>
          <time
            dateTime={entry.createdAt.toISOString()}
            className="text-xs tabular-nums text-ink-muted"
          >
            {formatDate(entry.createdAt, locale)}
          </time>
        </li>
      ))}
    </ul>
  );
}
