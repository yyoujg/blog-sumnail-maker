import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  PAGE_KEYWORDS,
  OG_DESCRIPTION,
  ADSENSE_CLIENT,
  ADSENSE_SCRIPT_SRC,
  FONT_LINK_HREF,
  GTAG_ID,
  SITE_URL,
} from '@/lib/constants';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlogKit',
    url: SITE_URL,
    description: PAGE_DESCRIPTION,
    inLanguage: 'ko',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'BlogKit 가이드',
    url: `${SITE_URL}/blog`,
    description: '네이버 블로그 CTR·검색유입·썸네일 전략 가이드',
    inLanguage: 'ko',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BlogKit 썸네일 만들기',
    url: SITE_URL,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    description: '가이드를 실습하는 보조 무료 썸네일·스킨 제작 도구',
  },
];


export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: `%s — BlogKit`,
  },
  description: PAGE_DESCRIPTION,
  keywords: PAGE_KEYWORDS,
  openGraph: {
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
    type: 'website',
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.svg',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href={FONT_LINK_HREF} />
        <link rel="preload" as="image" href="/images/260208에디션엠/에디션엠-감귤케이크-딸기음료-메인.JPG" />
        <link rel="preload" as="image" href="/images/260208에디션엠/에디션엠-혜화역카페-내부좌석공간.JPG" />
        {/* 애드센스 전역 스크립트 */}
        <Script src={ADSENSE_SCRIPT_SRC} strategy="afterInteractive" crossOrigin="anonymous" />
      </head>
      <body>
        {children}

        {/* 카카오톡 오픈채팅 플로팅 버튼 */}
        <a
          href="https://open.kakao.com/o/sXbyh0ni"
          target="_blank"
          rel="noopener noreferrer"
          title="오류/제안 카카오톡 오픈채팅"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FEE500',
            color: '#3C1E1E',
            borderRadius: '999px',
            padding: '10px 18px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>💬</span>
          <span>오류·제안</span>
        </a>

        {/* 구조화 데이터 (WebSite + Blog + WebApplication) */}
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Google Tag */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GTAG_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
