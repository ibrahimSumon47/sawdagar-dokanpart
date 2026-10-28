import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import type { CmsEntryRecord, ContentKind } from '../../../content';
import { saveContentAction } from '../../../content/actions';
import { ContentFields } from './ContentFields';

export interface ContentEditorFormProps {
  /** Existing entry to edit, or null to create a new one. */
  entry: CmsEntryRecord | null;
  /** Default area for a new entry. */
  defaultKind: ContentKind;
  copy: Dictionary['admin'];
}

/** Editor form that creates or updates one CMS entry. */
export function ContentEditorForm({ entry, defaultKind, copy }: ContentEditorFormProps) {
  return (
    <form action={saveContentAction} className="space-y-6">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <ContentFields entry={entry} defaultKind={defaultKind} copy={copy} />
      <Button type="submit">{copy.saveContent}</Button>
    </form>
  );
}
