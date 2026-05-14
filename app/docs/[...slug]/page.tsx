import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllDocs, getDocBySlug, getMdxSource } from '@/lib/content';
import { sectionMap } from '@/lib/nav';
import { mdxComponents } from '@/components/mdx/components';
import { DocSidebar } from '@/components/doc-sidebar';
import { DocToc } from '@/components/doc-toc';
import { DocPager } from '@/components/doc-pager';
import { MobileSectionNav } from '@/components/mobile-section-nav';
import { AnchorCopy } from '@/components/anchor-copy';
import { Badge } from '@/components/ui/badge';
import { formatDate, readingTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug.split('/') }));
}

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDocBySlug(slug);
  if (!entry) return {};
  const ogUrl = `/og/${entry.slug}`;
  return {
    title: entry.data.title,
    description: entry.data.description,
    openGraph: {
      title: entry.data.title,
      description: entry.data.description,
      type: 'article',
      url: `${entry.path}/`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.data.title,
      description: entry.data.description,
      images: [ogUrl],
    },
  };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getDocBySlug(slug);
  if (!entry) notFound();

  const source = getMdxSource(entry);
  const section = sectionMap[entry.section];

  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              properties: {
                className: ['heading-anchor'],
                ariaLabel: 'Copy link to this section',
                title: 'Copy link',
              },
              content: {
                type: 'element',
                tagName: 'svg',
                properties: {
                  width: 14, height: 14, viewBox: '0 0 24 24',
                  fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
                  strokeLinecap: 'round', strokeLinejoin: 'round',
                  ariaHidden: 'true',
                },
                children: [
                  { type: 'element', tagName: 'path', properties: { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }, children: [] },
                  { type: 'element', tagName: 'path', properties: { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }, children: [] },
                ],
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: { light: 'github-light', dark: 'github-dark-dimmed' },
              keepBackground: false,
              defaultLang: 'plaintext',
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  const updated = formatDate(entry.data.updated);
  const { minutes, words } = readingTime(source);

  return (
    <div className="container grid gap-8 min-w-0 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_14rem]">
      <DocSidebar />
      <article className="min-w-0 max-w-full py-6 sm:py-8 lg:py-10">
        <nav className="mb-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">~</Link>
          {section && (
            <>
              <span>/</span>
              <Link href={section.links[0]?.href ?? `/docs/${section.key}`} className="hover:text-foreground">
                {section.title.toLowerCase()}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground break-all">{entry.slug.split('/').pop()}</span>
        </nav>

        {section && <MobileSectionNav section={section} />}

        <header className="mb-8 border-b pb-6 sm:pb-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {section && <Badge variant="secondary">{section.title}</Badge>}
            {entry.data.badge && <Badge variant="outline">{entry.data.badge}</Badge>}
          </div>
          <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] font-semibold tracking-tight text-balance leading-tight break-words">
            {entry.data.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
            {entry.data.description}
          </p>
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {minutes} min read
              <span className="text-muted-foreground/60"> · {words.toLocaleString()} words</span>
            </span>
            {updated && <span>updated · {updated}</span>}
          </div>
        </header>

        <div className="prose max-w-none">{content}</div>
        <AnchorCopy />

        {section && <DocPager section={section} currentHref={entry.path} />}

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
          <a
            href={`https://github.com/sitharaj88/armhub/edit/main/content/${entry.slug}.mdx`}
            className="hover:text-foreground"
            target="_blank"
            rel="noopener"
          >
            Edit this page on GitHub →
          </a>
          <a href="#top" className="hover:text-foreground">Back to top ↑</a>
        </footer>
      </article>
      <DocToc />
    </div>
  );
}
