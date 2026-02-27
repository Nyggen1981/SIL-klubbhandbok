'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  slugPath: string;
  initialTitle: string;
  initialOrder: number;
  initialChapterTitle: string;
  initialBody: string;
};

export default function EditForm({ slugPath, initialTitle, initialOrder, initialChapterTitle, initialBody }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [order, setOrder] = useState(initialOrder);
  const [chapterTitle, setChapterTitle] = useState(initialChapterTitle);
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugPath, title, order, chapterTitle: chapterTitle || undefined, body }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Lagring feilet');
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError('Noe gikk galt');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-4">
        <Link href="/admin" className="text-sm text-sauda-accent hover:underline">← Tilbake til admin</Link>
        <span className="text-slate-500 text-sm">{slugPath}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Tittel</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-slate-700">Rekkefølge</label>
            <input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="chapterTitle" className="block text-sm font-medium text-slate-700">Kapitteltittel</label>
            <input
              id="chapterTitle"
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-slate-700">Innhold (Markdown)</label>
          <textarea
            id="body"
            rows={20}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
            spellCheck="true"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Lagret.</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-sauda-primary px-4 py-2 text-sm font-medium text-white hover:bg-sauda-mid disabled:opacity-50"
          >
            {saving ? 'Lagrer…' : 'Lagre'}
          </button>
          <Link href={`/${slugPath}`} className="rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Se på siden</Link>
        </div>
      </form>
    </div>
  );
}
