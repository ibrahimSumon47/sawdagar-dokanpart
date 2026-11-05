import type { Dictionary } from '../../../../i18n';
import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';
import { categoryName } from '../../../content/helpCategoryTypes';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';

export interface HelpCategorySelectProps {
  /** Categories available to file the article under. */
  categories: HelpCategoryRecord[];
  /** Category already chosen for this entry, or null. */
  selectedId: string | null;
  /** Admin copy for the label and the empty option. */
  copy: Dictionary['admin'];
  /** Language used to label the options. */
  locale: CategoryLanguage;
}

const control =
  'mt-1 block min-h-10 w-full rounded-sm border border-line bg-background px-2 py-1.5 text-sm text-ink';

/** Category picker for Help articles; other kinds ignore the value on save. */
export function HelpCategorySelect({
  categories,
  selectedId,
  copy,
  locale,
}: HelpCategorySelectProps) {
  return (
    <label className="block text-xs font-semibold text-ink">
      {copy.helpCategoryLabel}
      <select name="helpCategoryId" defaultValue={selectedId ?? ''} className={control}>
        <option value="">{copy.helpCategoryNone}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {categoryName(category, locale)}
          </option>
        ))}
      </select>
      <span className="mt-1 block text-xs font-normal text-ink-muted">{copy.helpCategoryHint}</span>
    </label>
  );
}
