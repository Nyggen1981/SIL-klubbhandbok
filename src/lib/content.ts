import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './slug';
import { hasDatabase, dbGetAllPages, dbGetPage } from './db';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface ContentPage {
  slug: string[];
  slugPath: string;
  filePath: string;
  title: string;
  order?: number;
  chapterTitle?: string;
  rawBody: string;
  frontmatter: Record<string, unknown>;
  /** Sist oppdatert (fra DB); kun satt for sider fra Neon */
  updatedAt?: string;
}

export interface NavChapter {
  title: string;
  slug: string;
  order: number;
  children: { title: string; slugPath: string; order: number }[];
}

function getOrderFromSlug(slug: string): number {
  const match = slug.match(/kapittel-(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}

function getAllPagesFromFiles(): ContentPage[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const paths = getAllMdxPaths(CONTENT_DIR);
  const pages: ContentPage[] = [];

  for (const { relativePath, slug } of paths) {
    const raw = fs.readFileSync(relativePath, 'utf-8');
    const { data, content } = matter(raw);
    const title = (data.title as string) || slug[slug.length - 1] || 'Untitled';
    const order = typeof data.order === 'number' ? data.order : getOrderFromSlug(slug[0] || '');
    const chapterTitle = (data.chapterTitle as string) || (slug[0] ? slug[0] : undefined);

    pages.push({
      slug,
      slugPath: slug.join('/'),
      filePath: relativePath,
      title,
      order,
      chapterTitle,
      rawBody: content,
      frontmatter: data,
    });
  }

  pages.sort((a, b) => {
    const aChapter = getOrderFromSlug(a.slug[0] || '');
    const bChapter = getOrderFromSlug(b.slug[0] || '');
    if (aChapter !== bChapter) return aChapter - bChapter;
    return (a.order ?? 999) - (b.order ?? 999);
  });

  return pages;
}

function getAllMdxPaths(dir: string, base: string[] = []): { relativePath: string; slug: string[] }[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result: { relativePath: string; slug: string[] }[] = [];

  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    const relPath = [...base, ent.name];

    if (ent.isDirectory()) {
      result.push(...getAllMdxPaths(fullPath, relPath));
    } else if (ent.isFile() && ent.name.endsWith('.mdx')) {
      const slug = relPath.map((p) => slugify(p.replace(/\.mdx$/, '')));
      result.push({ relativePath: path.join(dir, ent.name), slug });
    }
  }

  return result;
}

function dbPageToContentPage(row: { slug_path: string; title: string; sort_order: number; chapter_title: string | null; body: string; updated_at?: string }): ContentPage {
  const slug = row.slug_path.split('/').filter(Boolean);
  return {
    slug,
    slugPath: row.slug_path,
    filePath: '',
    title: row.title,
    order: row.sort_order,
    chapterTitle: row.chapter_title ?? undefined,
    rawBody: row.body,
    frontmatter: { title: row.title, order: row.sort_order, chapterTitle: row.chapter_title },
    updatedAt: row.updated_at,
  };
}

/** Hent alle sider – fra Neon når DATABASE_URL er satt, ellers fra filer. */
export async function getAllPages(): Promise<ContentPage[]> {
  if (hasDatabase()) {
    const rows = await dbGetAllPages();
    return rows.map(dbPageToContentPage);
  }
  return getAllPagesFromFiles();
}

/** Hent én side – fra Neon når DATABASE_URL er satt, ellers fra filer. */
export async function getPageBySlug(slug: string[]): Promise<ContentPage | null> {
  const normalizedSlug = slug.map((s) => slugify(s)).filter(Boolean);
  const slugPath = normalizedSlug.join('/');
  if (hasDatabase()) {
    const row = await dbGetPage(slugPath);
    return row ? dbPageToContentPage(row) : null;
  }
  const pages = getAllPagesFromFiles();
  return pages.find((p) => p.slugPath === slugPath) ?? null;
}

/** Navigasjon til sidebar – fra Neon hvis DATABASE_URL er satt, ellers fra filer. */
export async function getNavigation(): Promise<NavChapter[]> {
  const pages = await getAllPages();
  const chapterMap = new Map<string, NavChapter>();

  for (const p of pages) {
    const chapterSlug = p.slug[0] || 'generelt';
    const chapterOrder = getOrderFromSlug(chapterSlug);

    if (!chapterMap.has(chapterSlug)) {
      chapterMap.set(chapterSlug, {
        title: p.chapterTitle || chapterSlug,
        slug: chapterSlug,
        order: chapterOrder,
        children: [],
      });
    }

    const ch = chapterMap.get(chapterSlug)!;
    ch.children.push({
      title: p.title,
      slugPath: p.slugPath,
      order: p.order ?? 999,
    });
  }

  Array.from(chapterMap.values()).forEach((ch) => {
    ch.children.sort((a, b) => a.order - b.order);
  });

  return Array.from(chapterMap.values()).sort((a, b) => a.order - b.order);
}
