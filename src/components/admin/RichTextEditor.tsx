'use client';

import { useCallback, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { marked } from 'marked';
import TurndownService from 'turndown';

function markdownToHtml(md: string): string {
  if (!md?.trim()) return '<p></p>';
  return marked.parse(md.trim(), { async: false }) as string;
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  td.addRule('image', {
    filter: 'img',
    replacement(_, node) {
      const el = node as HTMLImageElement;
      const alt = el.getAttribute('alt') || '';
      const src = el.getAttribute('src') || '';
      return src ? `![${alt}](${src})` : '';
    },
  });
  return td.turndown(html || '');
}

type Props = {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: string;
};

function Toolbar({ editor }: { editor: Editor | null }) {
  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Bilde-URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Lenke-URL:', editor.getAttributes('link').href);
    if (url === null) return;
    if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 text-sm font-medium ${editor.isActive('bold') ? 'bg-sauda-accent/20 text-sauda-accent' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Fet"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('italic') ? 'bg-sauda-accent/20 text-sauda-accent italic' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Kursiv"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-sauda-accent/20 text-sauda-accent' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Overskrift 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-sauda-accent/20 text-sauda-accent' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Overskrift 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('bulletList') ? 'bg-sauda-accent/20 text-sauda-accent' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Punktliste"
      >
        • Liste
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('orderedList') ? 'bg-sauda-accent/20 text-sauda-accent' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Nummerert liste"
      >
        1. Liste
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`rounded px-2 py-1 text-sm ${editor.isActive('link') ? 'bg-sauda-accent/20 text-sauda-accent' : 'text-slate-600 hover:bg-slate-200'}`}
        title="Lenke"
      >
        Lenke
      </button>
      <button
        type="button"
        onClick={addImage}
        className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-200"
        title="Sett inn bilde"
      >
        Bilde
      </button>
    </div>
  );
}

export default function RichTextEditor({ initialMarkdown, onChange, placeholder, minHeight = '280px' }: Props) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener' } }),
    ],
    content: markdownToHtml(initialMarkdown),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] px-3 py-2 focus:outline-none',
      },
    },
    onUpdate: ({ editor: e }) => {
      onChangeRef.current(htmlToMarkdown(e.getHTML()));
    },
  });

  return (
    <div className="rounded border border-slate-300 bg-white overflow-hidden">
      <Toolbar editor={editor} />
      <div style={{ minHeight }} className="[&_.ProseMirror]:min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
