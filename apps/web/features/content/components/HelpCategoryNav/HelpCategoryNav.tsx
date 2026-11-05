import Link from 'next/link';
import type { Dictionary, Locale } from '../../../../i18n';
import type { HelpCategoryWithCount } from '../../helpCategoryQueries';
import { categoryName, type CategoryLanguage } from '../../helpCategoryTypes';

export interface HelpCategoryNavProps {
  categories: readonly HelpCategoryWithCount[];
  /** Slug of the category being read, or null for all topics. */
  activeSlug: string | null;
  /** Articles across every category, shown on the all-topics link. */
  totalCount: number;
  copy: Dictionary['content'];
  locale: Locale;
}

const item =
  'flex items-center justify-between gap-3 rounded-sm border px-3 py-2 text-sm transition-colors';

/** Category filter beside the Help Center article list. */
export function HelpCategoryNav({
  categories,
  activeSlug,
  totalCount,
  copy,
  locale,
}: HelpCategoryNavProps) {
  const language: CategoryLanguage = locale === 'bn' ? 'bn' : 'en';
  const rows = [
    { slug: null, name: copy.helpAllTopics, count: totalCount },
    ...categories.map((category) => ({
      slug: category.slug,
      name: categoryName(category, language),
      count: category.articleCount,
    })),
  ];

  return (
    <nav aria-label={copy.helpTopics}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {copy.helpTopics}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col">
        {rows.map((row) => {
          const active = row.slug === activeSlug;
          return (
            <li key={row.slug ?? 'all'} className="lg:w-full">
              <Link
                href={row.slug ? `/help?category=${row.slug}` : '/help'}
                aria-current={active ? 'page' : undefined}
                className={`${item} ${
                  active
                    ? 'border-accent bg-accent/10 font-semibold text-ink'
                    : 'border-line bg-surface text-ink-muted hover:border-accent hover:text-ink'
                }`}
              >
                <span>{row.name}</span>
                <span className="tabular-nums text-xs">{row.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
