import { JamdaniPattern } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import { formatDate } from '../../../../lib/formatDate';
import type { ContentKind } from '../../contentTypes';
import type { CmsEntryRecord } from '../../queries';
import { ArticleBody } from '../ArticleBody';

export interface ContentArticleViewProps {
  entry: CmsEntryRecord;
  kind: ContentKind;
  copy: Dictionary;
  locale: Locale;
}

const backHref: Record<ContentKind, string> = {
  page: '/',
  help: '/help',
  journal: '/journal',
};

/** One published Help article, Journal post or static page. */
export function ContentArticleView({ entry, kind, copy, locale }: ContentArticleViewProps) {
  const backLabel =
    kind === 'help'
      ? copy.content.backToHelp
      : kind === 'journal'
        ? copy.content.backToJournal
        : copy.nav.home;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={backHref[kind]}
        className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-accent hover:underline"
      >
        ← {backLabel}
      </Link>
      <div className="mt-6 h-32 overflow-hidden rounded-sm bg-accent/10 text-accent">
        <JamdaniPattern />
      </div>
      <header className="mt-6">
        <h1 className="font-serif text-display leading-tight text-ink">
          {locale === 'bn' ? entry.titleBn : entry.titleEn}
        </h1>
        {entry.publishAt ? (
          <p className="mt-2 text-xs uppercase tracking-wider text-ink-muted">
            {copy.content.publishedOn} {formatDate(entry.publishAt, locale)}
          </p>
        ) : null}
        {entry.excerptEn || entry.excerptBn ? (
          <p className="mt-4 text-lead leading-relaxed text-ink-muted">
            {locale === 'bn' ? entry.excerptBn : entry.excerptEn}
          </p>
        ) : null}
      </header>
      <div className="mt-8 border-t border-line pt-8">
        <ArticleBody body={locale === 'bn' ? entry.bodyBn : entry.bodyEn} />
      </div>
    </article>
  );
}
