import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import './print.css';
import { getNavigation } from '@/lib/content';
import Sidebar from '@/components/Sidebar';
import Search from '@/components/Search';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Klubbhåndbok – Sauda IL',
  description: 'Sauda ILs klubbhåndbok med regler, rutiner og retningslinjer.',
};

const basePath = process.env.NODE_ENV === 'production' && process.env.BASE_PATH ? process.env.BASE_PATH : '';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const chapters = getNavigation();

  return (
    <html lang="nb" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        {/* Kun synlig ved utskrift: logo (legg /public/images/logo.png for eget logo) */}
        <div className="print-header hidden print:!block" aria-hidden>
          <div className="px-4 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/images/logo.png`}
              alt="Sauda IL"
              className="h-10 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
            />
            <span className="hidden font-semibold text-sauda-dark">Sauda IL</span>
          </div>
        </div>
        <div className="print-footer hidden print:!block" aria-hidden>
          Sauda IL – Klubbhåndbok
        </div>

        <header className="no-print flex flex-shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 py-3">
          <Link href="/" className="font-semibold text-sauda-dark">
            Sauda IL – Klubbhåndbok
          </Link>
          <div className="flex-1 flex justify-end" role="search">
            <Search />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar chapters={chapters} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
