import { EmptyState, JamdaniPattern } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ContentKind } from '../../contentTypes';
import type { CmsEntryRecord } from '../../queries';
import { contentHref } from '../../urls';

export interface ContentIndexViewProps {
  kind: Extract<ContentKind, 'help' | 'journal'>;
  entries: readonly CmsEntryRecord[];
  copy: Dictionary;
  locale: Locale;
}

/** Public index for Help Center articles or Journal posts. */
export function ContentIndexView({ kind, entries, copy, locale }: ContentIndexViewProps) {
  const isHelp = kind === 'help';
  const heading = isHelp ? copy.content.helpTitle : copy.content.journalTitle;
  const description = isHelp ? copy.content.helpDescription : copy.content.journalDescription;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {isHelp ? copy.content.helpTitle : copy.content.journalTitle}
        </p>
        <h1 className="mt-2 font-serif text-display leading-tight text-ink">{heading}</h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">{description}</p>
      </header>

      {entries.length === 0 ? (
        <EmptyState className="mt-10" title={copy.content.noArticles} description={description} />
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {entries.map((entry, index) => (
            <li key={entry.id}>
              <Link
                href={contentHref(kind, entry.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-accent"
              >
                <div
                  className={
                    index % 3 === 0
                      ? 'h-24 bg-accent/10 text-accent'
                      : index % 3 === 1
                        ? 'h-24 bg-highlight/20 text-ink'
                        : 'h-24 bg-secondary/20 text-secondary'
                  }
                >
                  <JamdaniPattern />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-serif text-xl leading-snug text-ink group-hover:text-accent">
                    {locale === 'bn' ? entry.titleBn : entry.titleEn}
                  </h2>
                  {entry.excerptEn || entry.excerptBn ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                      {locale === 'bn' ? entry.excerptBn : entry.excerptEn}
                    </p>
                  ) : null}
                  <p className="mt-auto pt-4 text-xs text-ink-muted">
                    {copy.content.readMore}
                    {entry.publishAt
                      ? ` · ${copy.content.publishedOn} ${formatDate(entry.publishAt, locale)}`
                      : ''}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
