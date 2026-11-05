'use client';

import type { CmsEntryRecord } from '../../../content';
import type { CmsEditorCopy } from './editorCopy';
import { controlClass, labelClass } from './fieldStyles';

export interface ContentSeoFieldsProps {
  /** Entry being edited, or null for a new one. */
  entry: CmsEntryRecord | null;
  copy: CmsEditorCopy;
}

/** Optional search title and description for each language. */
export function ContentSeoFields({ entry, copy }: ContentSeoFieldsProps) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        SEO
      </legend>
      <label className={labelClass}>
        {copy.seoTitleLabel} · EN
        <input
          type="text"
          name="seoTitleEn"
          maxLength={120}
          defaultValue={entry?.seoTitleEn ?? ''}
          className={controlClass}
        />
      </label>
      <label className={labelClass}>
        {copy.seoTitleLabel} · BN
        <input
          type="text"
          name="seoTitleBn"
          maxLength={120}
          defaultValue={entry?.seoTitleBn ?? ''}
          className={controlClass}
        />
      </label>
      <label className={labelClass}>
        {copy.seoDescriptionLabel} · EN
        <textarea
          name="seoDescriptionEn"
          rows={2}
          maxLength={200}
          defaultValue={entry?.seoDescriptionEn ?? ''}
          className={controlClass}
        />
      </label>
      <label className={labelClass}>
        {copy.seoDescriptionLabel} · BN
        <textarea
          name="seoDescriptionBn"
          rows={2}
          maxLength={200}
          defaultValue={entry?.seoDescriptionBn ?? ''}
          className={controlClass}
        />
      </label>
    </fieldset>
  );
}
