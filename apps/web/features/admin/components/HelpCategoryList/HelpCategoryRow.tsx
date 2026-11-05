import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import { moveHelpCategoryAction } from '../../../content/helpCategoryActions';
import type { HelpCategoryWithCount } from '../../../content/helpCategoryQueries';
import { categoryName } from '../../../content/helpCategoryTypes';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';

export interface HelpCategoryRowProps {
  category: HelpCategoryWithCount;
  /** True for the first row: the move-up button is disabled. */
  isFirst: boolean;
  /** True for the last row: the move-down button is disabled. */
  isLast: boolean;
  copy: Dictionary['admin'];
  locale: CategoryLanguage;
}

const moveButton =
  'min-h-9 min-w-9 rounded-sm border border-line bg-background text-sm text-ink disabled:opacity-40';

/** One category row: names, article count, ordering and the edit link. */
export function HelpCategoryRow({ category, isFirst, isLast, copy, locale }: HelpCategoryRowProps) {
  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3">
        <Link href={`/admin/cms/help/${category.id}`} className="font-medium text-ink underline">
          {categoryName(category, locale)}
        </Link>
        <span className="mt-1 block text-xs text-ink-muted">{category.slug}</span>
      </td>
      <td className="px-4 py-3 text-ink-muted">
        {category.articleCount} {copy.helpCategoryArticles}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {(['up', 'down'] as const).map((direction) => (
            <form key={direction} action={moveHelpCategoryAction}>
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="direction" value={direction} />
              <button
                type="submit"
                className={moveButton}
                disabled={direction === 'up' ? isFirst : isLast}
                aria-label={`${categoryName(category, locale)}: ${direction === 'up' ? copy.helpCategoryMoveUp : copy.helpCategoryMoveDown}`}
              >
                {direction === 'up' ? '↑' : '↓'}
              </button>
            </form>
          ))}
        </div>
      </td>
    </tr>
  );
}
