'use client';

import type { CmsEntryRecord } from '../../../content';
import { instantToDateInput } from '../../../content/urls';
import type { CmsEditorCopy } from './editorCopy';
import { controlClass, labelClass } from './fieldStyles';

export interface ContentPublishFieldsProps {
  /** Entry being edited, or null for a new one. */
  entry: CmsEntryRecord | null;
  copy: CmsEditorCopy;
}

/** Draft, scheduled or published, with the date a scheduled entry goes live. */
export function ContentPublishFields({ entry, copy }: ContentPublishFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={labelClass}>
        {copy.statusLabel}
        <select name="status" defaultValue={entry?.status ?? 'draft'} className={controlClass}>
          <option value="draft">{copy.statusDraft}</option>
          <option value="scheduled">{copy.statusScheduled}</option>
          <option value="published">{copy.statusPublished}</option>
        </select>
      </label>
      <label className={labelClass}>
        {copy.publishDateLabel}
        <input
          type="date"
          name="publishDate"
          defaultValue={instantToDateInput(entry?.publishAt ?? null)}
          className={controlClass}
        />
      </label>
    </div>
  );
}
