import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './slug';

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

export function getAllPages(): ContentPage[] {
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

export function getPageBySlug(slug: string[]): ContentPage | null {
  const pages = getAllPages();
  const slugPath = slug.join('/');
  return pages.find((p) => p.slugPath === slugPath) ?? null;
}

export function getNavigation(): NavChapter[] {
  const pages = getAllPages();
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

  for (const ch of chapterMap.values()) {
    ch.children.sort((a, b) => a.order - b.order);
  }

  return Array.from(chapterMap.values()).sort((a, b) => a.order - b.order);
}
