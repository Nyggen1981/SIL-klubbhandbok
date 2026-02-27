import { neon } from '@neondatabase/serverless';

export interface DbPage {
  slug_path: string;
  title: string;
  sort_order: number;
  chapter_title: string | null;
  body: string;
  updated_at: string;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export async function dbGetAllPages(): Promise<DbPage[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    SELECT slug_path, title, sort_order, chapter_title, body, updated_at
    FROM handbook_pages
    ORDER BY sort_order ASC, slug_path ASC
  `;
  return rows as DbPage[];
}

export async function dbGetPage(slugPath: string): Promise<DbPage | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`
    SELECT slug_path, title, sort_order, chapter_title, body, updated_at
    FROM handbook_pages
    WHERE slug_path = ${slugPath}
    LIMIT 1
  `;
  return (rows[0] as DbPage) ?? null;
}

export async function dbSavePage(data: {
  slugPath: string;
  title: string;
  order?: number;
  chapterTitle?: string;
  body: string;
}): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not set');
  await sql`
    INSERT INTO handbook_pages (slug_path, title, sort_order, chapter_title, body, updated_at)
    VALUES (
      ${data.slugPath},
      ${data.title},
      ${data.order ?? 999},
      ${data.chapterTitle ?? null},
      ${data.body},
      NOW()
    )
    ON CONFLICT (slug_path) DO UPDATE SET
      title = EXCLUDED.title,
      sort_order = EXCLUDED.sort_order,
      chapter_title = EXCLUDED.chapter_title,
      body = EXCLUDED.body,
      updated_at = NOW()
  `;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
