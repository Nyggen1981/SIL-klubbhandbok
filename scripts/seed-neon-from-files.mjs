/**
 * Fyll Neon-tabell handbook_pages fra eksisterende MDX-filer i content/.
 * Kjør én gang etter at du har kjørt init-neon.sql og satt DATABASE_URL.
 *
 * node scripts/seed-neon-from-files.mjs
 */
import fs from 'fs';
import path from 'path';

// Bruk cwd slik at seed fungerer både lokalt og under Vercel build
const contentDir = path.join(process.cwd(), 'content');

function slugify(value) {
  if (!value || typeof value !== 'string') return '';
  const map = { æ: 'e', ø: 'o', å: 'a', Æ: 'e', Ø: 'o', Å: 'a' };
  let s = value.trim();
  for (const [from, to] of Object.entries(map)) s = s.split(from).join(to);
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getAllMdxPaths(dir, base = []) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    const relPath = [...base, ent.name];
    if (ent.isDirectory()) {
      result.push(...getAllMdxPaths(fullPath, relPath));
    } else if (ent.isFile() && ent.name.endsWith('.mdx')) {
      const slug = relPath.map((p) => slugify(p.replace(/\.mdx$/, '')));
      result.push({ fullPath, slug });
    }
  }
  return result;
}

function matterParse(raw, slug) {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!fm) return { title: slug[slug.length - 1] || '', order: 999, chapterTitle: '', body: raw };
  const body = fm[2];
  const titleMatch = fm[1].match(/title:\s*["']?([^"'\n]+)["']?/);
  const orderMatch = fm[1].match(/order:\s*(\d+)/);
  const chapterMatch = fm[1].match(/chapterTitle:\s*["']?([^"'\n]*)["']?/);
  return {
    title: titleMatch ? titleMatch[1].trim() : slug[slug.length - 1] || '',
    order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
    chapterTitle: chapterMatch ? chapterMatch[1].trim() : '',
    body,
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL ikke satt – hopper over seed');
    process.exit(0);
  }

  const paths = getAllMdxPaths(contentDir);
  if (paths.length === 0) {
    console.log('Ingen MDX-filer funnet i content/');
    process.exit(0);
  }

  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);

  for (const { fullPath, slug } of paths) {
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { title, order, chapterTitle, body } = matterParse(raw, slug);
    const slugPath = slug.join('/');
    await sql`
      INSERT INTO handbook_pages (slug_path, title, sort_order, chapter_title, body, updated_at)
      VALUES (${slugPath}, ${title}, ${order}, ${chapterTitle || null}, ${body}, NOW())
      ON CONFLICT (slug_path) DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        chapter_title = EXCLUDED.chapter_title,
        body = EXCLUDED.body,
        updated_at = NOW()
    `;
    console.log('  ', slugPath);
  }

  console.log('Seed fullført:', paths.length, 'sider');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
