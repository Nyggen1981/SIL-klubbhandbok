/**
 * Bygger public/search-docs.json fra Neon (handbook_pages).
 * Kjøres kun hvis DATABASE_URL er satt. Overstyrer eventuell fil-basert search-docs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(path.dirname(__dirname), 'public', 'search-docs.json');

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL ikke satt – hopper over build-search-from-db');
  process.exit(0);
}

async function main() {
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    SELECT slug_path, title, body
    FROM handbook_pages
    ORDER BY sort_order ASC, slug_path ASC
  `;
  const docs = rows.map((r) => ({
    slugPath: r.slug_path,
    title: r.title,
    text: `${r.title} ${(r.body || '').replace(/#{1,6}\s/g, '').replace(/\s+/g, ' ')}`.trim(),
  }));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(docs), 'utf-8');
  console.log('Wrote search-docs.json from Neon with', docs.length, 'documents');
}

main().catch((e) => {
  console.warn('build-search-from-db: hopper over (tabell handbook_pages finnes kanskje ikke ennå – kjør init-neon.sql i Neon):', e.message || e);
  process.exit(0);
});
