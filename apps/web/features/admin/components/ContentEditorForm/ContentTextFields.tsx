'use client';

import type { CmsEditorCopy } from './editorCopy';
import { controlClass, labelClass } from './fieldStyles';

export interface ContentTextFieldsProps {
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  copy: CmsEditorCopy;
}

/** English and Bangla titles and excerpts. */
export function ContentTextFields({
  titleEn,
  titleBn,
  excerptEn,
  excerptBn,
  copy,
}: ContentTextFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {copy.titleEnLabel}
          <input
            type="text"
            name="titleEn"
            required
            maxLength={120}
            defaultValue={titleEn}
            className={controlClass}
          />
        </label>
        <label className={labelClass}>
          {copy.titleBnLabel}
          <input
            type="text"
            name="titleBn"
            required
            maxLength={120}
            defaultValue={titleBn}
            className={controlClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          {copy.excerptEnLabel}
          <textarea
            name="excerptEn"
            rows={2}
            maxLength={240}
            defaultValue={excerptEn}
            className={controlClass}
          />
        </label>
        <label className={labelClass}>
          {copy.excerptBnLabel}
          <textarea
            name="excerptBn"
            rows={2}
            maxLength={240}
            defaultValue={excerptBn}
            className={controlClass}
          />
        </label>
      </div>
    </div>
  );
}
