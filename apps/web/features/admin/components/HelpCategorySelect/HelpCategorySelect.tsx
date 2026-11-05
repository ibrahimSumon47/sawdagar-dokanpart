import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';
import { categoryName } from '../../../content/helpCategoryTypes';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';
import { controlClass, hintClass, labelClass } from '../ContentEditorForm/fieldStyles';

export interface HelpCategorySelectProps {
  /** Categories available to file the article under. */
  categories: HelpCategoryRecord[];
  /** Category already chosen for this entry, or null. */
  selectedId: string | null;
  /** Field label. */
  label: string;
  /** Text of the "no category" option. */
  noneLabel: string;
  /** Small line under the field. */
  hint: string;
  /** Language used to label the options. */
  locale: CategoryLanguage;
}

/** Category picker for Help articles; other kinds ignore the value on save. */
export function HelpCategorySelect({
  categories,
  selectedId,
  label,
  noneLabel,
  hint,
  locale,
}: HelpCategorySelectProps) {
  return (
    <label className={labelClass}>
      {label}
      <select name="helpCategoryId" defaultValue={selectedId ?? ''} className={controlClass}>
        <option value="">{noneLabel}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {categoryName(category, locale)}
          </option>
        ))}
      </select>
      <span className={hintClass}>{hint}</span>
    </label>
  );
}
