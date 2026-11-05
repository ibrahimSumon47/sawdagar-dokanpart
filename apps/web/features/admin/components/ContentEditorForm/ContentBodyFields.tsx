'use client';

import { Skeleton } from '@sd/ui';
import dynamic from 'next/dynamic';
import type { ContentKind } from '../../../content';
import type { RichTextEditorProps } from '../RichTextEditor';
import type { CmsEditorCopy } from './editorCopy';
import { areaClass, labelClass } from './fieldStyles';

// The editor bundle (Tiptap and ProseMirror, about 124 KiB gzipped) is only needed
// where a Journal body is edited, so it loads after the rest of the form instead of
// in the page's first chunk.
const RichTextEditor = dynamic<RichTextEditorProps>(
  () => import('../RichTextEditor/RichTextEditor').then((module) => module.RichTextEditor),
  { ssr: false, loading: () => <Skeleton className="h-52" /> },
);

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
          <div key={code}>
            <input type="hidden" name={code === 'en' ? 'bodyEn' : 'bodyBn'} value={bodies[code]} />
            <RichTextEditor
              label={fieldLabel}
              initialHtml={bodies[code]}
              hint={copy.richTextHint}
              onChange={(html) => onChangeBody(code, html)}
            />
          </div>
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
