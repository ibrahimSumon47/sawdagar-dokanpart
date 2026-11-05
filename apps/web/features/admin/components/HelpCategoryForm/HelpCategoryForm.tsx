import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { saveHelpCategoryAction } from '../../../content/helpCategoryActions';
import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';
import { HelpCategoryFields } from './HelpCategoryFields';

export interface HelpCategoryFormProps {
  /** Category to edit, or null to create a new one. */
  category: HelpCategoryRecord | null;
  /** Admin copy for the labels and the submit button. */
  copy: Dictionary['admin'];
}

/** Creates or updates one Help Center category. */
export function HelpCategoryForm({ category, copy }: HelpCategoryFormProps) {
  return (
    <form action={saveHelpCategoryAction} className="space-y-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <HelpCategoryFields category={category} copy={copy} />
      <Button type="submit">{copy.helpCategorySave}</Button>
    </form>
  );
}
