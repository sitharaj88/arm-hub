import { getAllDocs } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://armhub.dev';
const SITE_TITLE = 'armhub.dev';
const SITE_DESC = 'The modern reference for ARM development — architecture, peripherals, RTOSes, toolchains, vendors, and real-world system designs.';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const docs = getAllDocs();
  // Sort by `updated` (newest first), fall back to title
  const sorted = [...docs].sort((a, b) => {
    const da = a.data.updated ? new Date(a.data.updated).getTime() : 0;
    const db = b.data.updated ? new Date(b.data.updated).getTime() : 0;
    return db - da || a.data.title.localeCompare(b.data.title);
  });

  const lastBuild = new Date().toUTCString();
  const items = sorted
    .map((d) => {
      const url = `${SITE_URL}${d.path}/`;
      const pubDate = d.data.updated ? new Date(d.data.updated).toUTCString() : lastBuild;
      return `    <item>
      <title>${escapeXml(d.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(d.data.description)}</description>
      <category>${escapeXml(d.section)}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
