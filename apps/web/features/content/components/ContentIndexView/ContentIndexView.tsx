import { EmptyState } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { ContentKind } from '../../contentTypes';
import type { CmsEntryRecord } from '../../queries';
import { pageLayout } from '../../../shell/pageLayout';
import { ContentCard } from '../ContentCard';
import { TagFilter } from '../TagFilter';

export interface ContentIndexViewProps {
  kind: Extract<ContentKind, 'help' | 'journal'>;
  entries: readonly CmsEntryRecord[];
  copy: Dictionary;
  locale: Locale;
  /** Tags shown above the grid; only the Journal passes these. */
  tags?: readonly { tag: string; count: number }[];
  /** Tag currently filtering the list, if any. */
  activeTag?: string | null;
}

/** Public index for Help Center articles or Journal posts. */
export function ContentIndexView({
  kind,
  entries,
  copy,
  locale,
  tags = [],
  activeTag = null,
}: ContentIndexViewProps) {
  const isHelp = kind === 'help';
  const heading = isHelp ? copy.content.helpTitle : copy.content.journalTitle;
  const description = isHelp ? copy.content.helpDescription : copy.content.journalDescription;

  return (
    <div className={pageLayout.content}>
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {isHelp ? copy.content.helpTitle : copy.content.journalTitle}
        </p>
        <h1 className="mt-2 font-serif text-display leading-tight text-ink">{heading}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{description}</p>
      </header>

      {tags.length > 0 ? <TagFilter tags={tags} activeTag={activeTag} copy={copy} /> : null}

      {entries.length === 0 ? (
        <EmptyState
          className="mt-10"
          title={activeTag ? copy.content.noTaggedPosts : copy.content.noArticles}
          description={description}
        />
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {entries.map((entry, index) => (
            <li key={entry.id}>
              <ContentCard kind={kind} entry={entry} copy={copy} locale={locale} index={index} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
