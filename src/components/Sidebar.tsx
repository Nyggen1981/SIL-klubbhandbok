'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavChapter } from '@/lib/content';

const basePath = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : '';

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  const path = href.startsWith('/') ? href : `/${href}`;
  const to = basePath ? `${basePath}${path}` : path;
  return (
    <Link
      href={to}
      className={`block rounded px-3 py-1.5 text-sm transition-colors ${
        active ? 'bg-sauda-accent/20 text-sauda-accent font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-sauda-dark'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Sidebar({ chapters }: { chapters: NavChapter[] }) {
  const pathname = usePathname();
  const cleanPath = pathname?.replace(basePath, '')?.replace(/^\//, '') ?? '';

  const [openChapters, setOpenChapters] = useState<Set<string>>(() => {
    const currentChapter = cleanPath.split('/')[0];
    return new Set(currentChapter ? [currentChapter] : [chapters[0]?.slug ?? '']);
  });

  const toggle = (slug: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50/80 print:hidden">
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Hovednavigasjon">
        {chapters.map((ch) => {
          const isOpen = openChapters.has(ch.slug);
          return (
            <div key={ch.slug} className="mb-1">
              <button
                type="button"
                onClick={() => toggle(ch.slug)}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm font-medium text-sauda-dark hover:bg-slate-100"
                aria-expanded={isOpen}
              >
                <span>{ch.title}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {isOpen && (
                <div className="ml-2 border-l border-slate-200 pl-2">
                  {ch.children.map((child) => (
                    <NavLink
                      key={child.slugPath}
                      href={`/${child.slugPath}`}
                      active={cleanPath === child.slugPath}
                    >
                      {child.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
