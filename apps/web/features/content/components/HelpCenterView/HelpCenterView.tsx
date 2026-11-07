import { ButtonLink, EmptyState } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import type { HelpArticleRecord, HelpCategoryWithCount } from '../../helpCategoryQueries';
import { categoryName, type CategoryLanguage } from '../../helpCategoryTypes';
import { pageLayout } from '../../../shell/pageLayout';
import { ContentCard } from '../ContentCard';
import { HelpCategoryNav } from '../HelpCategoryNav';
import { HelpSearchForm } from '../HelpSearchForm';

export interface HelpCenterViewProps {
  /** Articles matching the category and search filters. */
  articles: readonly HelpArticleRecord[];
  categories: readonly HelpCategoryWithCount[];
  /** Category filter in the URL, already checked against the category list. */
  activeCategory: HelpCategoryWithCount | null;
  /** Search phrase in the URL, or an empty string. */
  query: string;
  /** Visible articles across all categories. */
  totalCount: number;
  copy: Dictionary;
  locale: Locale;
}

/** Help Center landing: category filter, search and the matching articles. */
export function HelpCenterView({
  articles,
  categories,
  activeCategory,
  query,
  totalCount,
  copy,
  locale,
}: HelpCenterViewProps) {
  const language: CategoryLanguage = locale === 'bn' ? 'bn' : 'en';
  const trimmed = query.trim();

  return (
    <div className={pageLayout.content}>
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {copy.content.helpTitle}
        </p>
        <h1 className="mt-2 font-serif text-display leading-tight text-ink">
          {copy.content.helpTitle}
        </h1>
        <p className="mt-3 text-lead leading-relaxed text-ink-muted">
          {copy.content.helpDescription}
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <HelpCategoryNav
          categories={categories}
          activeSlug={activeCategory?.slug ?? null}
          totalCount={totalCount}
          copy={copy.content}
          locale={locale}
        />

        <div>
          <HelpSearchForm
            query={query}
            categorySlug={activeCategory?.slug ?? null}
            copy={copy.content}
          />
          <p aria-live="polite" className="mt-4 text-sm text-ink-muted">
            {trimmed
              ? copy.content.helpResultsFor.replace('{query}', trimmed)
              : activeCategory
                ? categoryName(activeCategory, language)
                : copy.content.helpAllArticles}
            {' · '}
            {articles.length}
          </p>

          {articles.length === 0 ? (
            // A named region keeps the empty state findable by assistive technology and by a
            // test that must not match the same copy inside the streamed RSC payload.
            <section aria-label={copy.content.helpNoResultsTitle}>
              <EmptyState
                className="mt-6"
                title={copy.content.helpNoResultsTitle}
                description={copy.content.helpNoResultsBody}
                action={<ButtonLink href="/help">{copy.content.helpSearchClear}</ButtonLink>}
              />
            </section>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {articles.map((article, index) => (
                <li key={article.id}>
                  <ContentCard
                    kind="help"
                    entry={article}
                    copy={copy}
                    locale={locale}
                    index={index}
                    eyebrow={
                      article.category ? categoryName(article.category, language) : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
