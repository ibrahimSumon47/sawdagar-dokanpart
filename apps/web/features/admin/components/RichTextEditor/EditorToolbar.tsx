'use client';

import type { Editor } from '@tiptap/react';

export interface EditorToolbarProps {
  /** Editor the buttons act on; null until the editor mounts. */
  editor: Editor | null;
}

interface ToolbarButton {
  /** Short visible label. */
  label: string;
  /** Accessible name and tooltip. */
  title: string;
  run: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

const buttons: ToolbarButton[] = [
  {
    label: 'B',
    title: 'Bold',
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    label: 'I',
    title: 'Italic',
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    label: 'H2',
    title: 'Heading 2',
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive('heading', { level: 2 }),
  },
  {
    label: 'H3',
    title: 'Heading 3',
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive('heading', { level: 3 }),
  },
  {
    label: '•',
    title: 'Bullet list',
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    label: '1.',
    title: 'Numbered list',
    run: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    label: '❝',
    title: 'Quote',
    run: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
  {
    label: 'Link',
    title: 'Link',
    run: (editor) => {
      const href = window.prompt('Link address', 'https://');
      if (!href) return;
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    },
    isActive: (e) => e.isActive('link'),
  },
];

/** Formatting buttons above the Journal body editor. */
export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 border-b border-line p-1">
      {buttons.map((button) => {
        const active = button.isActive?.(editor) ?? false;
        return (
          <button
            key={button.title}
            type="button"
            title={button.title}
            aria-label={button.title}
            aria-pressed={active}
            onClick={() => button.run(editor)}
            className={`min-h-8 min-w-8 rounded-sm px-2 text-sm ${
              active ? 'bg-accent text-surface' : 'text-ink-muted hover:bg-surface-muted'
            }`}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
}
