import { notFound } from 'next/navigation';
import { getAllPages, getPageBySlug } from '@/lib/content';
import { compileMDX } from '@/lib/mdx';
import PdfActions from '@/components/PdfActions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function MdxPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const { content } = await compileMDX(page.rawBody, page.filePath);
  const allPages = await getAllPages();
  const chapters = allPages.filter((p) => p.slug[0] === page.slug[0]);
  const currentChapterSlug = page.slug[0] ?? '';

  const updatedAtFormatted =
    page.updatedAt &&
    (() => {
      try {
        const d = new Date(page.updatedAt);
        if (Number.isNaN(d.getTime())) return null;
        return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch {
        return null;
      }
    })();

  return (
    <article className="max-w-3xl">
      <div className="no-print mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-sauda-dark">{page.title}</h1>
        <PdfActions
          currentSlugPath={page.slugPath}
          chapterSlug={currentChapterSlug}
          chapterPagePaths={chapters.map((p) => p.slugPath)}
        />
      </div>
      <div className="prose">{content}</div>
      {updatedAtFormatted && (
        <p className="mt-6 text-center text-xs text-slate-400 no-print" aria-label="Sist oppdatert">
          Sist oppdatert: {updatedAtFormatted}
        </p>
      )}
    </article>
  );
}
