import { getAllDocs } from '@/lib/content';

export const dynamic = 'force-static';

const SITE_URL = 'https://armhub.dev';

function isoDate(d: Date | string | undefined): string {
  const date = d ? new Date(d) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export async function GET() {
  const docs = getAllDocs();

  const staticRoutes = [
    { loc: `${SITE_URL}/`,             priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/learn/`,        priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/cheatsheets/`,  priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/glossary/`,     priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/contributing/`, priority: '0.5', changefreq: 'yearly' },
  ];

  const docUrls = docs.map((d) => ({
    loc: `${SITE_URL}${d.path}/`,
    lastmod: isoDate(d.data.updated),
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const today = isoDate(undefined);
  const items = [
    ...staticRoutes.map((r) => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`),
    ...docUrls.map((r) => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
