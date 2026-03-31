import { ImageResponse } from 'next/og';
import { blogPosts } from '@/data/blogPosts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? '블로그 가이드';
  const summary = post?.summary ?? '네이버 블로그 운영 팁';

  const MAX = 20;
  const spaceIdx = title.lastIndexOf(' ', MAX);
  const breakAt = spaceIdx > 0 ? spaceIdx : MAX;
  const line1 = title.length > MAX ? title.slice(0, breakAt) : title;
  const line2 = title.length > MAX ? title.slice(breakAt).trim() : '';
  const shortSummary = summary.length > 80 ? summary.slice(0, 80) + '…' : summary;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 태그 */}
        <div style={{ display: 'flex' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '6px 18px',
              color: '#94a3b8',
              fontSize: 17,
              fontWeight: 600,
              display: 'flex',
            }}
          >
            블로그 가이드
          </div>
        </div>

        {/* 제목 + 요약 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                color: '#ffffff',
                fontSize: line2 ? 50 : 56,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: -0.5,
              }}
            >
              {line1}
            </span>
            {line2 ? (
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 50,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: -0.5,
                }}
              >
                {line2}
              </span>
            ) : null}
          </div>
          <span style={{ color: '#94a3b8', fontSize: 22, fontWeight: 400, lineHeight: 1.5 }}>
            {shortSummary}
          </span>
        </div>

        {/* 하단 브랜드 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569', fontSize: 18 }}>www.blogsumnail.com</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: '#ffffff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 14, height: 14, background: '#0f172a', borderRadius: 2, display: 'flex' }} />
            </div>
            <span style={{ color: '#64748b', fontSize: 20, fontWeight: 600 }}>BlogKit</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
