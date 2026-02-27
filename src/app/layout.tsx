import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import './globals.css';
import './print.css';
import { getNavigation } from '@/lib/content';
import Sidebar from '@/components/Sidebar';
import Search from '@/components/Search';
import PrintHeader from '@/components/PrintHeader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Klubbhåndbok – Sauda IL',
  description: 'Sauda ILs klubbhåndbok med regler, rutiner og retningslinjer.',
};

const basePath = process.env.NODE_ENV === 'production' && process.env.BASE_PATH ? process.env.BASE_PATH : '';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const chapters = await getNavigation();

  return (
    <html lang="nb" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <PrintHeader basePath={basePath} />
        <div className="print-footer hidden print:!block" aria-hidden>
          Sauda IL – Klubbhåndbok
        </div>

        <header className="no-print flex flex-shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <Link href="/" className="flex items-center gap-3 font-semibold text-sauda-dark">
            <Image
              src="/images/Logo.png"
              alt="Sauda Idrettslag 1919"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
            Sauda IL – Klubbhåndbok
          </Link>
          <div className="flex-1 flex items-center justify-end gap-3" role="search">
            <Search />
            <Link href="/admin" className="text-sm text-slate-600 hover:text-sauda-accent no-print">
              Admin
            </Link>
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
