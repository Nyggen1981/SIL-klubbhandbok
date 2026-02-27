import Link from 'next/link';
import { getNavigation } from '@/lib/content';

export default async function HomePage() {
  const chapters = await getNavigation();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-sauda-dark">Klubbhåndbok</h1>
      <p className="mt-2 text-slate-600">
        Velkommen til Sauda ILs klubbhåndbok. Bruk menyen til venstre eller søkefeltet øverst for å finne innhold.
      </p>
      <ul className="mt-6 space-y-2">
        {chapters.map((ch) => (
          <li key={ch.slug}>
            <span className="font-medium text-sauda-dark">{ch.title}</span>
            <ul className="ml-4 mt-1 space-y-0.5">
              {ch.children.map((child) => (
                <li key={child.slugPath}>
                  <Link href={`/${child.slugPath}`} className="text-sauda-accent hover:underline">
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
