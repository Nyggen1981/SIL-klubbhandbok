'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchAsync, getSnippet, type SearchDoc } from '@/lib/search-client';

const basePath = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : '';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const runSearch = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchAsync(q).then(setResults);
    }, 150);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleSelect = useCallback(
    (slugPath: string) => {
      const path = basePath ? `${basePath}/${slugPath}` : `/${slugPath}`;
      router.push(path);
      setQuery('');
      setResults([]);
      setFocused(false);
    },
    [router]
  );

  const showDropdown = focused && (query.length > 0 || results.length > 0);

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="handbook-search" className="sr-only">
        Søk i håndboken
      </label>
      <input
        ref={inputRef}
        id="handbook-search"
        type="search"
        role="combobox"
        value={query}
        onChange={(e) => runSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 180)}
        placeholder="Søk i håndboken…"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus:border-sauda-accent focus:outline-none focus:ring-1 focus:ring-sauda-accent"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls="search-results"
      />
      {showDropdown && (
        <ul
          id="search-results"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">Ingen treff</li>
          ) : (
            results.map((doc) => (
              <li key={doc.slugPath} role="option" aria-selected={false}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(doc.slugPath);
                  }}
                >
                  <span className="font-medium block">{doc.title}</span>
                  <span className="text-slate-500 text-xs block mt-0.5">{doc.slugPath}</span>
                  <span className="text-slate-600 block mt-1 line-clamp-2">{getSnippet(doc, query)}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
