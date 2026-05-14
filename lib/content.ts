import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type DocFrontmatter = {
  title: string;
  description: string;
  order?: number;
  tags?: string[];
  updated?: string;
  toc?: boolean;
  badge?: string;
  draft?: boolean;
};

export type DocEntry = {
  section: string;
  slug: string;        // section/page-name (no extension)
  path: string;        // /docs/section/page-name
  filePath: string;    // absolute path to .mdx file
  data: DocFrontmatter;
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

function walk(dir: string, baseSection?: string): DocEntry[] {
  if (!fs.existsSync(dir)) return [];
  const out: DocEntry[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, baseSection ?? entry.name));
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      const section = baseSection ?? path.basename(dir);
      const slugName = entry.name.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(full, 'utf8');
      const { data } = matter(raw);
      const fm = data as DocFrontmatter;
      if (fm.draft) continue;
      out.push({
        section,
        slug: `${section}/${slugName}`,
        path: `/docs/${section}/${slugName}`,
        filePath: full,
        data: fm,
      });
    }
  }
  return out;
}

let cachedEntries: DocEntry[] | null = null;

export function getAllDocs(): DocEntry[] {
  if (cachedEntries) return cachedEntries;
  cachedEntries = walk(CONTENT_DIR);
  cachedEntries.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
  return cachedEntries;
}

export function getDocBySlug(slugParts: string[]): DocEntry | undefined {
  const slug = slugParts.join('/');
  return getAllDocs().find((d) => d.slug === slug);
}

export function getDocsBySection(section: string): DocEntry[] {
  return getAllDocs()
    .filter((d) => d.section === section)
    .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
}

export function getMdxSource(entry: DocEntry): string {
  return fs.readFileSync(entry.filePath, 'utf8');
}
