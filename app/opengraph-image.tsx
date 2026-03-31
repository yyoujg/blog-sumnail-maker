import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '네이버 블로그 썸네일 메이커';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
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
          padding: '64px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 브랜드 */}
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
          <span style={{ color: '#6b7280', fontSize: 20, fontWeight: 600, letterSpacing: 1 }}>
            BlogKit
          </span>
        </div>

        {/* 메인 타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span
            style={{
              color: '#111827',
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            네이버 블로그
          </span>
          <span
            style={{
              color: '#111827',
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            썸네일 메이커
          </span>
          <span style={{ color: '#6b7280', fontSize: 24, fontWeight: 400, marginTop: 8 }}>
            조회수 잘 나오는 썸네일, 1분 완성 — 무료
          </span>
        </div>

        {/* 하단 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af', fontSize: 18 }}>www.blogsumnail.com</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['썸네일', '스킨', '가이드'].map((t) => (
              <div
                key={t}
                style={{
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 8,
                  padding: '8px 18px',
                  color: '#9ca3af',
                  fontSize: 16,
                  display: 'flex',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
