import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: Date | string | undefined): string | null {
  if (!d) return null;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

const WORDS_PER_MIN = 220;

/**
 * Plain-text word counter for MDX source. Strips:
 *  - frontmatter (--- block)
 *  - JSX components & their attrs (<Foo … />)
 *  - markdown links/images (keeps the visible text)
 *  - fenced code blocks (don't count code towards reading)
 *  - inline code, HTML tags, markdown punctuation
 * Result is a count of *visible prose words*.
 */
export function wordCount(mdx: string): number {
  let s = mdx;
  s = s.replace(/^---[\s\S]*?\n---\s*/m, '');                      // frontmatter
  s = s.replace(/```[\s\S]*?```/g, '');                             // fenced code
  s = s.replace(/<[A-Z][^>]*\/?>[\s\S]*?(<\/[A-Z][^>]+>|(?=\n\n))/g, ''); // JSX components (paired or self-closing run)
  s = s.replace(/<\/?[A-Za-z][^>]*>/g, '');                         // stray HTML/JSX tags
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, '');                       // images
  s = s.replace(/\[([^\]]*)\]\([^)]+\)/g, '$1');                    // links → visible text
  s = s.replace(/`[^`]*`/g, '');                                    // inline code
  s = s.replace(/[#*_~>|\\[\]\-]/g, ' ');                           // markdown punctuation
  const tokens = s.split(/\s+/).filter((t) => /\w/.test(t));
  return tokens.length;
}

export function readingTime(mdx: string): { minutes: number; words: number } {
  const words = wordCount(mdx);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MIN));
  return { minutes, words };
}
