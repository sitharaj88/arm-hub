import { ImageResponse } from 'next/og';
import { getAllDocs, getDocBySlug } from '@/lib/content';
import { sectionMap } from '@/lib/nav';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug.split('/') }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await ctx.params;
  const entry = getDocBySlug(slug);

  const title = entry?.data.title ?? 'armhub.dev';
  const description = entry?.data.description ?? 'The modern reference for ARM development.';
  const sectionTitle = entry ? sectionMap[entry.section]?.title ?? null : null;

  const safeTitle = title.length > 80 ? title.slice(0, 77) + '…' : title;
  const safeDesc = description.length > 160 ? description.slice(0, 157) + '…' : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0f',
          backgroundImage:
            'radial-gradient(at 15% 5%, rgba(124,58,237,0.32) 0px, transparent 50%),' +
            'radial-gradient(at 85% 10%, rgba(14,165,233,0.24) 0px, transparent 50%),' +
            'radial-gradient(at 80% 90%, rgba(245,158,11,0.20) 0px, transparent 50%)',
          color: '#fafafa',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 14,
              border: '1px solid rgba(124,58,237,0.4)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7" stroke="#7c3aed" strokeWidth="2.4" fill="none" />
              <circle cx="12" cy="12" r="1.5" fill="#fafafa" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
            armhub<span style={{ color: '#8a8a93' }}>.dev</span>
          </div>
          {sectionTitle && (
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                fontSize: 15,
                color: '#a5a5af',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8,
                padding: '6px 12px',
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            >
              {sectionTitle}
            </div>
          )}
        </div>

        {/* Title block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            flex: 1,
            marginTop: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#fafafa',
            }}
          >
            {safeTitle}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 24,
              lineHeight: 1.4,
              color: '#b8b8c1',
              maxWidth: 1000,
            }}
          >
            {safeDesc}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            display: 'flex',
            height: 6,
            marginTop: 36,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #7c3aed 0%, #0ea5e9 55%, #f59e0b 100%)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
