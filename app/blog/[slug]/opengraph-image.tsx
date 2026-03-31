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

  const MAX = 18;
  const spaceIdx = title.lastIndexOf(' ', MAX);
  const breakAt = spaceIdx > 0 ? spaceIdx : MAX;
  const line1 = title.length > MAX ? title.slice(0, breakAt) : title;
  const line2 = title.length > MAX ? title.slice(breakAt).trim() : '';
  const shortSummary = summary.length > 75 ? summary.slice(0, 75) + '…' : summary;
  const fontSize = line2 ? 56 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 카테고리 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 28,
              background: '#111827',
              borderRadius: 4,
              display: 'flex',
            }}
          />
          <span style={{ color: '#6b7280', fontSize: 20, fontWeight: 600 }}>
            블로그 가이드
          </span>
        </div>

        {/* 제목 + 요약 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                color: '#111827',
                fontSize,
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: -1,
              }}
            >
              {line1}
            </span>
            {line2 ? (
              <span
                style={{
                  color: '#111827',
                  fontSize,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  letterSpacing: -1,
                }}
              >
                {line2}
              </span>
            ) : null}
          </div>
          <span style={{ color: '#6b7280', fontSize: 22, fontWeight: 400, lineHeight: 1.5 }}>
            {shortSummary}
          </span>
        </div>

        {/* 하단 브랜드 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af', fontSize: 18 }}>www.blogsumnail.com</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 22,
                background: '#d1d5db',
                borderRadius: 3,
                display: 'flex',
              }}
            />
            <span style={{ color: '#9ca3af', fontSize: 18, fontWeight: 600 }}>BlogKit</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
