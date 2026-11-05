import { JamdaniPattern } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ContentKind } from '../../contentTypes';
import type { CmsEntryRecord } from '../../queries';
import { contentHref } from '../../urls';
import { ContentCover } from '../ContentCover';
import { ContentTagChips } from '../ContentTagChips';

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
  const title = locale === 'bn' ? entry.titleBn : entry.titleEn;
  const coverAlt = locale === 'bn' ? entry.coverImageAltBn : entry.coverImageAltEn;

  return (
    <Link
      href={contentHref(kind, entry.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-accent"
    >
      {kind === 'journal' && entry.coverImageUrl ? (
        <ContentCover src={entry.coverImageUrl} alt={coverAlt} title={title} width={640} />
      ) : (
        <div className={`h-24 ${patternTone[index % patternTone.length]}`}>
          <JamdaniPattern />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-xl leading-snug text-ink group-hover:text-accent">
          {title}
        </h2>
        {entry.excerptEn || entry.excerptBn ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
            {locale === 'bn' ? entry.excerptBn : entry.excerptEn}
          </p>
        ) : null}
        {kind === 'journal' ? (
          <ContentTagChips tags={entry.tags} copy={copy} className="mt-3" linked={false} />
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
