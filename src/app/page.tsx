import Link from 'next/link';
import Image from 'next/image';
import { getNavigation } from '@/lib/content';

export default async function HomePage() {
  const chapters = await getNavigation();

  return (
    <div className="-m-6 min-h-full">
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden px-6 py-16 sm:py-24 text-white">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Image
            src="/images/Logo.png"
            alt="Sauda Idrettslag 1919"
            width={100}
            height={100}
            className="mx-auto mb-6 h-24 w-auto drop-shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
            Klubbhåndbok
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-blue-100/90 max-w-xl mx-auto">
            Sauda Idrettslag – stiftet 1919
          </p>
          <p className="mt-4 text-sm text-blue-200/70 max-w-lg mx-auto leading-relaxed">
            Håndboken er et oppslagsverk for alle medlemmer, tillitsvalgte og frivillige.
            Bruk menyen til venstre eller søkefeltet for å finne det du leter etter.
          </p>
        </div>
      </section>

      {/* Chapter grid */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
          Innhold
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch, i) => (
            <div
              key={ch.slug}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-sauda-accent/40"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sauda-primary/10 text-xs font-bold text-sauda-primary">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-sauda-dark">{ch.title}</h3>
              </div>
              <ul className="space-y-1">
                {ch.children.map((child) => (
                  <li key={child.slugPath}>
                    <Link
                      href={`/${child.slugPath}`}
                      className="block text-sm text-slate-600 hover:text-sauda-accent transition-colors pl-1"
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
