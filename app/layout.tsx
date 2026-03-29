import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  ADSENSE_CLIENT,
  FONT_LINK_HREF,
  GTAG_ID,
  SITE_URL,
} from '@/lib/constants';


export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: `%s — 네이버 블로그 썸네일 메이커`,
  },
  description: PAGE_DESCRIPTION,
  keywords: '네이버 블로그 썸네일 만들기, 블로그 썸네일 무료, 썸네일 자동 생성, 블로그 조회수 올리는 썸네일, 체험단 썸네일, 네이버 썸네일 사이즈 1:1, 블로그 대표 이미지 만들기, 썸네일 메이커, 블로그 스킨 만들기',
  openGraph: {
    title: PAGE_TITLE,
    description: '프로그램 설치 없이 웹에서 바로 만드는 깔끔한 블로그 썸네일 이미지',
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
      },
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.svg',
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
        <link rel="preload" as="image" href="/images/260320일상엔베이커리/일상엔-바닐라라떼-아메리카노-두바이초코몽블랑-메인.JPG" />
        <link rel="preload" as="image" href="/images/260208에디션엠/에디션엠-혜화역카페-내부인테리어.JPG" />
      </head>
      <body>
        {children}

        {/* 구조화 데이터 (SoftwareApplication) */}
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@type":"SoftwareApplication","name":"네이버 블로그 썸네일 메이커","operatingSystem":"Web","applicationCategory":"DesignApplication","offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"},"url":"${SITE_URL}","description":"${PAGE_DESCRIPTION}"}` }}
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
