import { getSearchIndex } from '@/lib/search-index';

export const dynamic = 'force-static';

export async function GET() {
  const idx = getSearchIndex();
  return new Response(JSON.stringify(idx), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
