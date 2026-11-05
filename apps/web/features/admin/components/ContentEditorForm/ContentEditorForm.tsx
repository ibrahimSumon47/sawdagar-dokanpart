import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { CmsEntryRecord, ContentKind } from '../../../content';
import { saveContentAction } from '../../../content/actions';
import type { HelpCategoryRecord } from '../../../content/helpCategoryQueries';
import type { CategoryLanguage } from '../../../content/helpCategoryTypes';
import { ContentFields } from './ContentFields';
import { coverUploadConfig } from './coverUpload';
import { toEditorCopy } from './editorCopy';

export interface ContentEditorFormProps {
  /** Existing entry to edit, or null to create a new one. */
  entry: CmsEntryRecord | null;
  /** Default area for a new entry. */
  defaultKind: ContentKind;
  /** Categories that a Help article can be filed under. */
  categories: readonly HelpCategoryRecord[];
  copy: Dictionary['admin'];
  locale: CategoryLanguage;
}

/** Editor form that creates or updates one CMS entry. */
export function ContentEditorForm({
  entry,
  defaultKind,
  categories,
  copy,
  locale,
}: ContentEditorFormProps) {
  return (
    <form action={saveContentAction} className="space-y-6">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <ContentFields
        entry={entry}
        defaultKind={defaultKind}
        categories={categories}
        copy={toEditorCopy(copy)}
        locale={locale}
        upload={coverUploadConfig()}
      />
      <Button type="submit">{copy.saveContent}</Button>
    </form>
  );
}
