import fs from 'node:fs';
import { getAllDocs } from '@/lib/content';
import { wordCount } from '@/lib/utils';

export type SearchEntry = {
  /** /docs/section/slug — what we navigate to. */
  href: string;
  /** Page title (frontmatter). */
  title: string;
  /** Short description (frontmatter). */
  description: string;
  /** Section key e.g. "cortex-m". */
  section: string;
  /** Pre-extracted plain-text body (heavily trimmed). */
  excerpt: string;
  /** Optional badge from frontmatter. */
  badge?: string;
};

const EXCERPT_WORDS = 60;

function makeExcerpt(mdx: string): string {
  let s = mdx;
  // Strip frontmatter, code fences, JSX components, links, code, punctuation
  s = s.replace(/^---[\s\S]*?\n---\s*/m, '');
  s = s.replace(/```[\s\S]*?```/g, ' ');
  s = s.replace(/<[A-Z][\s\S]*?\/>/g, ' ');
  s = s.replace(/<[A-Z][\s\S]*?<\/[A-Z][^>]*>/g, ' ');
  s = s.replace(/<\/?[A-Za-z][^>]*>/g, ' ');
  s = s.replace(/\[([^\]]*)\]\([^)]+\)/g, '$1');
  s = s.replace(/`[^`]+`/g, ' ');
  s = s.replace(/[#*_~>|\\[\]\-]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  const tokens = s.split(' ').slice(0, EXCERPT_WORDS);
  return tokens.join(' ');
}

let cache: SearchEntry[] | null = null;

export function getSearchIndex(): SearchEntry[] {
  if (cache) return cache;
  cache = getAllDocs().map((d) => {
    const raw = fs.readFileSync(d.filePath, 'utf8');
    return {
      href: `${d.path}/`,
      title: d.data.title,
      description: d.data.description,
      section: d.section,
      excerpt: makeExcerpt(raw),
      badge: d.data.badge,
    } satisfies SearchEntry;
  });
  // Stable order — alphabetical by title
  cache.sort((a, b) => a.title.localeCompare(b.title));
  return cache;
}

export { wordCount };
