import { getAllPages } from '@/lib/content';
import { compileMDX } from '@/lib/mdx';
import PdfHeleButton from '@/components/PdfHeleButton';

export const metadata = {
  title: 'Last ned hele håndboken – Sauda IL',
};

export const dynamic = 'force-dynamic';

export default async function PdfHelePage() {
  const pages = await getAllPages();
  const withContent = await Promise.all(
    pages.map(async (p) => ({
      ...p,
      content: (await compileMDX(p.rawBody, p.filePath)).content,
    }))
  );

  return (
    <div className="max-w-3xl print:max-w-none">
      <div className="no-print mb-6 flex flex-col gap-2">
        <PdfHeleButton />
        <p className="text-sm text-slate-600">
          Klikk knappen over og velg «Lagre som PDF» eller «Skriv ut til PDF» for å laste ned hele håndboken som én fil.
        </p>
      </div>

      <div className="pdf-hele-content">
        <h1 className="text-2xl font-bold text-sauda-dark mb-8">Sauda IL – Klubbhåndbok</h1>
        {withContent.map((item, i) => (
          <section
            key={item.slugPath}
            className={i === 0 ? 'pdf-section pdf-section-first' : 'pdf-section'}
          >
            <h2 className="text-xl font-semibold text-sauda-dark mb-4">{item.title}</h2>
            <div className="prose">{item.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
