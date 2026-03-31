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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 브랜드 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: '#ffffff',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 18, height: 18, background: '#0f172a', borderRadius: 3, display: 'flex' }} />
          </div>
          <span style={{ color: '#94a3b8', fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>
            BlogKit
          </span>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: '6px 16px',
                color: '#94a3b8',
                fontSize: 16,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              무료 · 설치 없음 · 바로 시작
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#ffffff', fontSize: 60, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1 }}>
              네이버 블로그
            </span>
            <span style={{ color: '#ffffff', fontSize: 60, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1 }}>
              썸네일 메이커
            </span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: 26, fontWeight: 500 }}>
            조회수 잘 나오는 썸네일, 1분 완성
          </span>
        </div>

        {/* 하단 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569', fontSize: 18 }}>www.blogsumnail.com</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {['썸네일 메이커', '스킨 메이커', '블로그 가이드'].map((t) => (
              <div
                key={t}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: '#64748b',
                  fontSize: 15,
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
