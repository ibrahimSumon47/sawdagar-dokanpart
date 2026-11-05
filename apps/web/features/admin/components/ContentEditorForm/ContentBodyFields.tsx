'use client';

import type { ContentKind } from '../../../content';
import { RichTextEditor } from '../RichTextEditor';
import type { CmsEditorCopy } from './editorCopy';
import { areaClass, labelClass } from './fieldStyles';

export interface ContentBodyFieldsProps {
  /** Journal posts use the rich editor, everything else plain paragraphs. */
  kind: ContentKind;
  bodyEn: string;
  bodyBn: string;
  onChangeBody: (language: 'en' | 'bn', value: string) => void;
  copy: CmsEditorCopy;
}

const languages = [
  { code: 'en', label: 'bodyEnLabel' },
  { code: 'bn', label: 'bodyBnLabel' },
] as const;

/** English and Bangla bodies, as editor HTML for Journal posts and text for other kinds. */
export function ContentBodyFields({
  kind,
  bodyEn,
  bodyBn,
  onChangeBody,
  copy,
}: ContentBodyFieldsProps) {
  const bodies = { en: bodyEn, bn: bodyBn };

  return (
    <div className="space-y-4">
      {languages.map(({ code, label }) => {
        const fieldLabel = copy[label];
        return kind === 'journal' ? (
          <RichTextEditor
            key={code}
            name={code === 'en' ? 'bodyEn' : 'bodyBn'}
            label={fieldLabel}
            initialHtml={bodies[code]}
            hint={copy.richTextHint}
            onChange={(html) => onChangeBody(code, html)}
          />
        ) : (
          <label key={code} className={labelClass}>
            {fieldLabel}
            <textarea
              name={code === 'en' ? 'bodyEn' : 'bodyBn'}
              required
              maxLength={12_000}
              value={bodies[code]}
              onChange={(event) => onChangeBody(code, event.target.value)}
              className={areaClass}
            />
          </label>
        );
      })}
    </div>
  );
}
