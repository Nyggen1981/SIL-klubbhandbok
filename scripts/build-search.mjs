import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(path.dirname(__dirname), 'content');
const outPath = path.join(path.dirname(__dirname), 'public', 'search-docs.json');

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
  if (!fm) return { title: slug[slug.length - 1] || '', body: raw };
  const body = fm[2];
  const titleMatch = fm[1].match(/title:\s*["']?([^"'\n]+)["']?/);
  const title = titleMatch ? titleMatch[1].trim() : slug[slug.length - 1] || '';
  return { title, body };
}

const paths = getAllMdxPaths(contentDir);
const docs = paths.map(({ fullPath, slug }) => {
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { title, body } = matterParse(raw, slug);
  const text = `${title} ${body.replace(/#{1,6}\s/g, '').replace(/\s+/g, ' ')}`.trim();
  return { slugPath: slug.join('/'), title, text };
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(docs), 'utf-8');
console.log('Wrote search-docs.json with', docs.length, 'documents');
