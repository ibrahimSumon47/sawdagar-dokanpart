import { JamdaniPattern } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ContentKind } from '../../contentTypes';
import type { CmsEntryRecord } from '../../queries';
import { contentHref } from '../../urls';

export interface ContentCardProps {
  /** help: Help Center article, journal: Journal post. */
  kind: Extract<ContentKind, 'help' | 'journal'>;
  entry: CmsEntryRecord;
  copy: Dictionary;
  locale: Locale;
  /** Position in the list, used to rotate the pattern colour. */
  index: number;
  /** Small label above the title, such as the Help category name. */
  eyebrow?: string | null;
}

const patternTone = [
  'bg-accent/10 text-accent',
  'bg-highlight/20 text-ink',
  'bg-secondary/20 text-secondary',
];

/** One article or post card linking to its page. */
export function ContentCard({ kind, entry, copy, locale, index, eyebrow }: ContentCardProps) {
  return (
    <Link
      href={contentHref(kind, entry.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-accent"
    >
      <div className={`h-24 ${patternTone[index % patternTone.length]}`}>
        <JamdaniPattern />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        ) : null}
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
  );
}
