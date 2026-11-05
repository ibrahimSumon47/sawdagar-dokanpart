import { JamdaniPattern } from '@sd/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ContentKind } from '../../contentTypes';
import type { CmsEntryRecord } from '../../queries';
import { pageLayout } from '../../../shell/pageLayout';
import { ArticleBody } from '../ArticleBody';
import { ContentCover } from '../ContentCover';
import { ContentTagChips } from '../ContentTagChips';

export interface ContentArticleViewProps {
  entry: CmsEntryRecord;
  kind: ContentKind;
  copy: Dictionary;
  locale: Locale;
  /** Extra blocks shown under the body, such as the helpful-vote panel. */
  children?: ReactNode;
}

const backHref: Record<ContentKind, string> = {
  page: '/',
  help: '/help',
  journal: '/journal',
};

/** One published Help article, Journal post or static page. */
export function ContentArticleView({
  entry,
  kind,
  copy,
  locale,
  children,
}: ContentArticleViewProps) {
  const backLabel =
    kind === 'help'
      ? copy.content.backToHelp
      : kind === 'journal'
        ? copy.content.backToJournal
        : copy.nav.home;
  const title = locale === 'bn' ? entry.titleBn : entry.titleEn;
  const excerpt = locale === 'bn' ? entry.excerptBn : entry.excerptEn;
  const coverAlt = locale === 'bn' ? entry.coverImageAltBn : entry.coverImageAltEn;
  const hasCover = kind === 'journal' && Boolean(entry.coverImageUrl);

  return (
    <article className={pageLayout.article}>
      <Link
        href={backHref[kind]}
        className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-accent hover:underline"
      >
        ← {backLabel}
      </Link>
      {hasCover ? (
        <div className="mt-6">
          <ContentCover
            src={entry.coverImageUrl ?? ''}
            alt={coverAlt}
            title={title}
            width={1200}
            variant="hero"
          />
        </div>
      ) : (
        <div className="mt-6 h-32 overflow-hidden rounded-sm bg-accent/10 text-accent">
          <JamdaniPattern />
        </div>
      )}
      <header className="mt-6">
        <h1 className="font-serif text-display leading-tight text-ink">{title}</h1>
        {entry.publishAt ? (
          <p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">
            {copy.content.publishedOn} {formatDate(entry.publishAt, locale)}
          </p>
        ) : null}
        {excerpt ? (
          <p className="mt-4 text-lead leading-relaxed text-ink-muted">{excerpt}</p>
        ) : null}
        {kind === 'journal' ? (
          <ContentTagChips tags={entry.tags} copy={copy} className="mt-4" />
        ) : null}
      </header>
      <div className="mt-8 border-t border-line pt-8">
        <ArticleBody
          body={locale === 'bn' ? entry.bodyBn : entry.bodyEn}
          format={kind === 'journal' ? 'rich' : 'plain'}
        />
      </div>
      {children}
    </article>
  );
}
