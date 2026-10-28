import { Button } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { CmsVersionRecord } from '../../../content';
import { restoreContentVersionAction } from '../../../content/actions';

export interface ContentVersionHistoryProps {
  versions: readonly CmsVersionRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

/** Saved snapshots with a restore control for each one. */
export function ContentVersionHistory({ versions, copy, locale }: ContentVersionHistoryProps) {
  return (
    <section className="rounded-sm border border-line bg-surface p-4">
      <h2 className="font-serif text-lg text-ink">{copy.versionsTitle}</h2>
      <p className="mt-1 text-xs text-ink-muted">{copy.versionsDescription}</p>
      {versions.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{copy.noVersions}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {versions.map((version) => (
            <li
              key={version.id}
              className="flex flex-wrap items-center gap-3 rounded-sm border border-line px-3 py-2"
            >
              <span className="text-sm font-semibold tabular-nums text-ink">
                {copy.versionLabel} {version.version}
              </span>
              <span className="min-w-0 flex-1 text-xs text-ink-muted">
                {version.note ?? formatDate(version.createdAt, locale)}
              </span>
              <time
                dateTime={version.createdAt.toISOString()}
                className="text-xs tabular-nums text-ink-muted"
              >
                {formatDate(version.createdAt, locale)}
              </time>
              <form action={restoreContentVersionAction}>
                <input type="hidden" name="versionId" value={version.id} />
                <Button type="submit" variant="secondary" size="sm">
                  {copy.restore}
                </Button>
              </form>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
