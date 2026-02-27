import { getNavigation, getAllPages } from '@/lib/content';
import { compileMDX } from '@/lib/mdx';
import AutoPrintTrigger from '@/components/AutoPrintTrigger';
import PdfHeleButton from '@/components/PdfHeleButton';
import type { ContentPage } from '@/lib/content';
import type { NavChapter } from '@/lib/content';

export const metadata = {
  title: 'Hele håndboken – Sauda IL',
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ autoPrint?: string }>;

export default async function PdfHelePage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const autoPrint = params.autoPrint === '1';

  const [chapters, allPages] = await Promise.all([getNavigation(), getAllPages()]);
  const pageBySlug = new Map<string, ContentPage>(allPages.map((p) => [p.slugPath, p]));

  type PageBlock = { title: string; content: React.ReactNode };
  type ChapterBlock = { chapter: NavChapter; pages: PageBlock[] };

  const chapterBlocks: ChapterBlock[] = [];

  for (const ch of chapters) {
    const pages: PageBlock[] = [];
    for (const child of ch.children) {
      const page = pageBySlug.get(child.slugPath);
      if (!page) continue;
      try {
        const { content } = await compileMDX(page.rawBody, page.filePath);
        pages.push({ title: page.title, content });
      } catch {
        pages.push({
          title: page.title,
          content: <p className="text-slate-500">Kunne ikke laste innhold.</p>,
        });
      }
    }
    if (pages.length > 0) {
      chapterBlocks.push({ chapter: ch, pages });
    }
  }

  const hasContent = chapterBlocks.length > 0;

  return (
    <div className="pdf-hele-page max-w-3xl mx-auto print:max-w-none">
      <AutoPrintTrigger autoPrint={autoPrint} />
      <div className="no-print mb-6 flex flex-col gap-2">
        <PdfHeleButton />
        <p className="text-sm text-slate-600">Velg «Lagre som PDF» eller «Skriv ut til PDF» for å laste ned.</p>
      </div>
      {!hasContent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-800 text-sm">
          <p className="font-medium">Ingen innhold i håndboken</p>
          <p className="mt-1">Legg inn sider via admin eller sørg for at databasen er fylt (seed).</p>
        </div>
      ) : (
        <div className="pdf-hele-document text-sauda-dark">
          <header className="pdf-hele-cover mb-10">
            <h1 className="text-2xl font-bold border-b border-slate-300 pb-2">Sauda IL – Klubbhåndbok</h1>
            <p className="mt-6 text-slate-600 text-sm">Innholdsfortegnelse</p>
            <ul className="mt-2 space-y-2 text-sm list-none pl-0">
              {chapterBlocks.map(({ chapter, pages: chPages }) => (
                <li key={chapter.slug} className="mt-4">
                  <span className="font-semibold text-sauda-dark">{chapter.title}</span>
                  <ul className="ml-4 mt-1 font-normal text-slate-600 space-y-0.5 list-disc">
                    {chPages.map((p) => (
                      <li key={p.title}>{p.title}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </header>

          {chapterBlocks.map(({ chapter, pages }, chIndex) => (
            <article
              key={chapter.slug}
              className={chIndex === 0 ? 'pdf-chapter pdf-chapter-first' : 'pdf-chapter'}
            >
              <h2 className="pdf-chapter-title text-xl font-bold text-sauda-dark border-b border-slate-200 pb-2 mb-6">
                {chapter.title}
              </h2>
              {pages.map((p, i) => (
                <section
                  key={`${p.title}-${i}`}
                  className={i === 0 ? 'pdf-section pdf-section-first' : 'pdf-section'}
                >
                  <h3 className="text-lg font-semibold text-sauda-dark mb-3">{p.title}</h3>
                  <div className="prose prose-slate max-w-none">{p.content}</div>
                </section>
              ))}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
