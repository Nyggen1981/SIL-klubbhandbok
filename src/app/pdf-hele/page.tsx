import { getAllPages } from '@/lib/content';
import { compileMDX } from '@/lib/mdx';
import PdfHeleButton from '@/components/PdfHeleButton';
import AutoPrintTrigger from '@/components/AutoPrintTrigger';

export const metadata = {
  title: 'Last ned hele håndboken – Sauda IL',
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ autoPrint?: string }>;

export default async function PdfHelePage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const autoPrint = params.autoPrint === '1';

  const pages = await getAllPages();
  const withContent = await Promise.all(
    pages.map(async (p) => ({
      ...p,
      content: (await compileMDX(p.rawBody, p.filePath)).content,
    }))
  );

  return (
    <div className="max-w-3xl print:max-w-none">
      <AutoPrintTrigger autoPrint={autoPrint} />
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
