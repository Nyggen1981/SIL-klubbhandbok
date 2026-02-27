import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth';
import { getAllPages } from '@/lib/content';
import { hasDatabase } from '@/lib/db';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminPage() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginForm />
      </div>
    );
  }

  const pages = await getAllPages();

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-sauda-dark">Admin – Klubbhåndbok</h1>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="text-sm text-slate-600 hover:underline">Logg ut</button>
          </form>
        </div>
        {!hasDatabase() && (
          <p className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            DATABASE_URL er ikke satt. Sett opp Neon og legg inn connection string for å lagre endringer. Se NEON.md.
          </p>
        )}
        <p className="mb-4 text-slate-600 text-sm">Velg en side for å redigere. Endringer lagres i databasen (Neon).</p>
        <ul className="space-y-1">
          {pages.map((p) => (
            <li key={p.slugPath}>
              <Link
                href={`/admin/edit/${p.slugPath}`}
                className="block rounded px-3 py-2 text-sauda-accent hover:bg-slate-100 hover:underline"
              >
                {p.title}
                <span className="ml-2 text-slate-500 text-sm">{p.slugPath}</span>
              </Link>
            </li>
          ))}
        </ul>
        {pages.length === 0 && (
          <p className="text-slate-500">Ingen sider funnet. Kjør <code className="rounded bg-slate-100 px-1">node scripts/seed-neon-from-files.mjs</code> for å fylle fra content/-filer, eller legg inn innhold i Neon.</p>
        )}
      </div>
    </div>
  );
}
