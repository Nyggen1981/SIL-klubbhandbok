import Link from 'next/link';
import { getNavigation } from '@/lib/content';

export const metadata = {
  title: 'Last ned hele håndboken – Sauda IL',
};

export default function PdfHelePage() {
  const chapters = getNavigation();

  return (
    <div className="max-w-2xl print:max-w-none">
      <h1 className="text-2xl font-bold text-sauda-dark">Hele klubbhåndboken</h1>
      <p className="mt-2 text-slate-600">
        For å få hele håndboken som én PDF: åpne hvert kapittel i menyen og klikk «Last ned kapittel som PDF», deretter slå sammen PDF-ene i ett dokument. Alternativt kan du skrive ut denne siden for et innholdsfortegnelse.
      </p>
      <ul className="mt-6 space-y-4">
        {chapters.map((ch) => (
          <li key={ch.slug} className="chapter-break">
            <h2 className="text-lg font-semibold">{ch.title}</h2>
            <ul className="ml-4 mt-2 space-y-1">
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
