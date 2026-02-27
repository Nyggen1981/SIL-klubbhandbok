'use client';

export default function PdfActions({
  currentSlugPath,
  chapterSlug,
  chapterPagePaths,
}: {
  currentSlugPath: string;
  chapterSlug: string;
  chapterPagePaths: string[];
}) {
  const printChapter = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={printChapter}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-sauda-dark hover:bg-slate-50"
      >
        Last ned kapittel som PDF
      </button>
      <a
        href="/pdf-hele"
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-sauda-dark hover:bg-slate-50"
      >
        Last ned hele håndboken (PDF)
      </a>
    </div>
  );
}
