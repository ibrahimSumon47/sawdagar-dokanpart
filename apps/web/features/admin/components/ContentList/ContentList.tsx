import { Badge } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { CmsEntryRecord, ContentStatus } from '../../../content';
import { contentEditHref } from '../../../content/urls';

export interface ContentListProps {
  entries: readonly CmsEntryRecord[];
  copy: Dictionary['admin'];
  locale: Locale;
}

const statusTone: Record<ContentStatus, 'neutral' | 'success' | 'warning'> = {
  draft: 'neutral',
  scheduled: 'warning',
  published: 'success',
};

/** All CMS entries with area, status and the editor link. */
export function ContentList({ entries, copy, locale }: ContentListProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
        {copy.noContent}
      </p>
    );
  }

  const kindLabel = { page: copy.kindPage, help: copy.kindHelp, journal: copy.kindJournal };
  const statusLabel = {
    draft: copy.statusDraft,
    scheduled: copy.statusScheduled,
    published: copy.statusPublished,
  };

  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead className="bg-background text-xs uppercase tracking-wider text-ink-muted">
          <tr>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.titleColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.kindColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.statusColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.updatedLabel}
            </th>
            <th scope="col" className="px-4 py-2">
              <span className="sr-only">{copy.editContent}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-line">
              <td className="px-4 py-2">
                <p className="font-semibold text-ink">
                  {locale === 'bn' ? entry.titleBn : entry.titleEn}
                </p>
                <p className="text-xs text-ink-muted">/{entry.slug}</p>
              </td>
              <td className="px-4 py-2 text-ink-muted">{kindLabel[entry.kind]}</td>
              <td className="px-4 py-2">
                <Badge tone={statusTone[entry.status]}>{statusLabel[entry.status]}</Badge>
              </td>
              <td className="px-4 py-2 text-xs tabular-nums text-ink-muted">
                {formatDate(entry.updatedAt, locale)}
              </td>
              <td className="px-4 py-2 text-right">
                <Link
                  href={contentEditHref(entry.id)}
                  className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {copy.editContent}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
