import { notFound } from 'next/navigation';
import { getAllPages, getPageBySlug } from '@/lib/content';
import { compileMDX } from '@/lib/mdx';
import PdfActions from '@/components/PdfActions';

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function MdxPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const { content } = await compileMDX(page.rawBody, page.filePath);
  const chapters = getAllPages().filter((p) => p.slug[0] === page.slug[0]);
  const currentChapterSlug = page.slug[0] ?? '';

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
    </article>
  );
}
