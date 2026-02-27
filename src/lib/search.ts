import FlexSearch from 'flexsearch';
import type { ContentPage } from './content';

export type SearchDoc = { id: string; slugPath: string; title: string; text: string };

let index: FlexSearch.Index | null = null;
let docs: SearchDoc[] = [];

export function buildSearchIndex(pages: ContentPage[]): SearchDoc[] {
  docs = pages.map((p) => ({
    id: p.slugPath,
    slugPath: p.slugPath,
    title: p.title,
    text: `${p.title} ${p.rawBody.replace(/#{1,6}\s/g, '').replace(/\s+/g, ' ')}`,
  }));

  index = new FlexSearch.Index({ tokenize: 'forward', cache: true });

  docs.forEach((doc, i) => {
    index!.add(i, `${doc.title} ${doc.text}`);
  });

  return docs;
}

export function search(query: string): SearchDoc[] {
  if (!index || !query.trim()) return [];

  const results = index.search(query, { limit: 30 });
  return (Array.isArray(results) ? results : [results]).map((i) => docs[i as number]).filter(Boolean);
}

export function getSearchDocs(): SearchDoc[] {
  return docs;
}
