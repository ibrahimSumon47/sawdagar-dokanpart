import type { Dictionary } from '../../../../i18n';
import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';

export interface HelpCategoryFieldsProps {
  /** Category being edited, or null when creating one. */
  category: HelpCategoryRecord | null;
  /** Admin copy for every label. */
  copy: Dictionary['admin'];
}

const control =
  'mt-1 block min-h-10 w-full rounded-sm border border-line bg-background px-2 py-1.5 text-sm text-ink';
const area = `${control} min-h-20 leading-relaxed`;
const label = 'text-xs font-semibold text-ink';

/** Slug, bilingual names and descriptions for one Help category. */
export function HelpCategoryFields({ category, copy }: HelpCategoryFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.helpCategorySlugLabel}
          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            maxLength={40}
            defaultValue={category?.slug ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.helpCategoryNameEnLabel}
          <input
            type="text"
            name="nameEn"
            required
            maxLength={60}
            defaultValue={category?.nameEn ?? ''}
            className={control}
          />
        </label>
        <label className={label}>
          {copy.helpCategoryNameBnLabel}
          <input
            type="text"
            name="nameBn"
            required
            maxLength={60}
            defaultValue={category?.nameBn ?? ''}
            className={control}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {copy.helpCategoryDescriptionEnLabel}
          <textarea
            name="descriptionEn"
            rows={2}
            maxLength={240}
            defaultValue={category?.descriptionEn ?? ''}
            className={area}
          />
        </label>
        <label className={label}>
          {copy.helpCategoryDescriptionBnLabel}
          <textarea
            name="descriptionBn"
            rows={2}
            maxLength={240}
            defaultValue={category?.descriptionBn ?? ''}
            className={area}
          />
        </label>
      </div>
    </div>
  );
}
