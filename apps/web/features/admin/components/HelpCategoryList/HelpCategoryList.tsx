import type { Dictionary } from '../../../../i18n';
import type { HelpCategoryWithCount } from '../../../content/helpCategoryQueries';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';
import { HelpCategoryRow } from './HelpCategoryRow';

export interface HelpCategoryListProps {
  categories: readonly HelpCategoryWithCount[];
  copy: Dictionary['admin'];
  locale: CategoryLanguage;
}

/** Table of every Help Center category in display order. */
export function HelpCategoryList({ categories, copy, locale }: HelpCategoryListProps) {
  if (categories.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
        {copy.helpCategoryEmpty}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-surface">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead className="bg-background text-xs uppercase tracking-wider text-ink-muted">
          <tr>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.helpCategoryNameColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.helpCategoryArticlesColumn}
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              {copy.helpCategoryOrderColumn}
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <HelpCategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
              copy={copy}
              locale={locale}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
