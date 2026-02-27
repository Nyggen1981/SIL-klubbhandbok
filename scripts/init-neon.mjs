/**
 * Oppretter tabell handbook_pages i Neon.
 * Kjør én gang når DATABASE_URL er satt (f.eks. lokalt: node scripts/init-neon.mjs).
 *
 * node scripts/init-neon.mjs
 */
if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL ikke satt – hopper over init-neon');
  process.exit(0);
}

async function main() {
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS handbook_pages (
      slug_path TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 999,
      chapter_title TEXT,
      body TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('Tabell handbook_pages er opprettet eller finnes allerede.');

  await sql`
    CREATE INDEX IF NOT EXISTS idx_handbook_pages_sort ON handbook_pages (sort_order, slug_path)
  `;
  console.log('Indeks er opprettet eller finnes allerede.');
  console.log('Neon er klar. Kjør eventuelt: node scripts/seed-neon-from-files.mjs');
}

main().catch((e) => {
  console.error('Feil:', e.message || e);
  process.exit(1);
});
