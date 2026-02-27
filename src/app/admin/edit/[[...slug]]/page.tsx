import { notFound } from 'next/navigation';
import Link from 'next/link';
import { verifySession } from '@/lib/auth';
import { getPageBySlug } from '@/lib/content';
import EditForm from '@/components/admin/EditForm';

export default async function AdminEditPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-slate-600">Du må <Link href="/admin" className="text-sauda-accent underline">logge inn</Link> for å redigere.</p>
      </div>
    );
  }

  const { slug } = await params;
  const slugArray = slug && slug.length > 0 ? slug : [];
  const page = await getPageBySlug(slugArray);
  if (!page) notFound();

  return (
    <div className="min-h-screen p-6">
      <EditForm
        slugPath={page.slugPath}
        initialTitle={page.title}
        initialOrder={page.order ?? 999}
        initialChapterTitle={page.chapterTitle ?? ''}
        initialBody={page.rawBody}
      />
    </div>
  );
}
