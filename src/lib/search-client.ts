'use client';

export type SearchDoc = { slugPath: string; title: string; text: string };

let index: import('flexsearch').Index | null = null;
let docs: SearchDoc[] = [];
let initPromise: Promise<void> | null = null;

async function init() {
  if (index && docs.length) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const base = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${base}/search-docs.json`);
    docs = await res.json();
    const FlexSearch = (await import('flexsearch')).default;
    index = new FlexSearch.Index({ tokenize: 'forward', cache: true });
    docs.forEach((d, i) => index!.add(i, `${d.title} ${d.text}`));
  })();

  return initPromise;
}

function doSearch(query: string): SearchDoc[] {
  if (!index || !query.trim()) return [];
  const results = index.search(query, { limit: 30 });
  const indices = Array.isArray(results) ? results : [results];
  return indices.map((i) => docs[i as number]).filter(Boolean);
}

export async function searchAsync(query: string): Promise<SearchDoc[]> {
  if (typeof window === 'undefined') return [];
  await init();
  return doSearch(query);
}

/** Returnerer et kort utdrag rundt første treff for visning i søkeresultater */
export function getSnippet(doc: SearchDoc, query: string, maxLen = 120): string {
  const q = query.trim().toLowerCase();
  const text = (doc.title + ' ' + doc.text).replace(/\s+/g, ' ');
  if (!q) return text.slice(0, maxLen) + (text.length > maxLen ? '…' : '');
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text.slice(0, maxLen) + (text.length > maxLen ? '…' : '');
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + q.length + 80);
  let snip = text.slice(start, end).trim();
  if (start > 0) snip = '…' + snip;
  if (end < text.length) snip = snip + '…';
  return snip.length > maxLen ? snip.slice(0, maxLen) + '…' : snip;
}
