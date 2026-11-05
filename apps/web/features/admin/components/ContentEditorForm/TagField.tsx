'use client';

import type { CmsEditorCopy } from './editorCopy';
import { controlClass, hintClass, labelClass } from './fieldStyles';

export interface TagFieldProps {
  /** Comma separated tags as typed. */
  value: string;
  onChange: (value: string) => void;
  copy: CmsEditorCopy;
}

/** Comma separated tags; the server lowercases them and removes duplicates. */
export function TagField({ value, onChange, copy }: TagFieldProps) {
  return (
    <label className={labelClass}>
      {copy.tagsLabel}
      <input
        type="text"
        name="tags"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={controlClass}
      />
      <span className={hintClass}>{copy.tagsHint}</span>
    </label>
  );
}
