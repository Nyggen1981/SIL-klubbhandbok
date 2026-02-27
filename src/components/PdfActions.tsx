'use client';

import { useState, useRef, useCallback } from 'react';

export default function PdfActions({
  currentSlugPath,
  chapterSlug,
  chapterPagePaths,
}: {
  currentSlugPath: string;
  chapterSlug: string;
  chapterPagePaths: string[];
}) {
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const printChapter = () => {
    window.print();
  };

  const printFullHandbook = useCallback(() => {
    setLoading(true);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Utskrift hele håndboken');
    iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;left:-9999px;top:0;';
    iframe.src = '/pdf-hele?autoPrint=1';
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const onLoad = () => {
      try {
        iframe.contentWindow?.print();
      } catch {
        // Tverrdomene: åpne i ny fane som fallback
        window.open('/pdf-hele?autoPrint=1', '_blank', 'noopener');
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
        iframeRef.current = null;
        setLoading(false);
      }, 500);
    };

    iframe.onload = onLoad;
    // Fallback: fjern spinner etter max 15 sek
    setTimeout(() => {
      if (iframeRef.current === iframe && iframe.parentNode) {
        try {
          document.body.removeChild(iframe);
        } catch {}
        iframeRef.current = null;
        setLoading(false);
      }
    }, 15000);
  }, []);

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={printChapter}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-sauda-dark hover:bg-slate-50"
      >
        Last ned kapittel som PDF
      </button>
      <button
        type="button"
        onClick={printFullHandbook}
        disabled={loading}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-sauda-dark hover:bg-slate-50 disabled:opacity-60"
      >
        {loading ? 'Laster…' : 'Last ned hele håndboken (PDF)'}
      </button>
    </div>
  );
}
