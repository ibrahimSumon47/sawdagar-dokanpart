'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';
import { hintClass, labelClass } from '../ContentEditorForm/fieldStyles';
import { EditorToolbar } from './EditorToolbar';

export interface RichTextEditorProps {
  /** Form field name the HTML is submitted under. */
  name: string;
  /** Field label in the admin language. */
  label: string;
  /** Stored HTML to start from. */
  initialHtml: string;
  /** Small line under the editor. */
  hint: string;
  /** Called with the new HTML on every edit. */
  onChange: (html: string) => void;
}

const editorClasses =
  'min-h-40 px-3 py-2 text-sm text-ink outline-none [&_a]:text-accent [&_a]:underline ' +
  '[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:italic ' +
  '[&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-xl [&_h3]:mt-3 [&_h3]:font-serif [&_h3]:text-lg ' +
  '[&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-2 [&_ul]:list-disc';

/** Journal body editor: writes HTML for headings, lists, quotes and links. */
export function RichTextEditor({ name, label, initialHtml, hint, onChange }: RichTextEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  // Keep the latest callback in a ref so the editor is not rebuilt on every parent render.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHtml,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: editorClasses, 'aria-label': label } },
    onUpdate: ({ editor: current }) => {
      const next = current.getHTML();
      setHtml(next);
      onChangeRef.current(next);
    },
  });

  return (
    <div className={labelClass}>
      <span>{label}</span>
      <input type="hidden" name={name} value={html} />
      <div className="mt-1 rounded-sm border border-line bg-background focus-within:border-accent">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <span className={hintClass}>{hint}</span>
    </div>
  );
}
