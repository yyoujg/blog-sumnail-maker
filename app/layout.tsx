import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  ADSENSE_CLIENT,
  ADSENSE_SCRIPT_SRC,
  FONT_LINK_HREF,
  HTML2CANVAS_SCRIPT_SRC,
  GTAG_ID,
  SITE_URL,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: `%s — 네이버 블로그 썸네일 메이커`,
  },
  description: PAGE_DESCRIPTION,
  keywords: '블로그 썸네일 만들기, 네이버 블로그 썸네일, 썸네일 메이커, 무료 썸네일, 블로그 배너 만들기, 체험단 블로그 꾸미기, 블로그 수익화, 네이버 썸네일 사이즈, 블로그 스킨 만들기',
  openGraph: {
    title: PAGE_TITLE,
    description: '프로그램 설치 없이 웹에서 바로 만드는 깔끔한 블로그 썸네일 이미지',
    type: 'website',
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
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
      </head>
      <body>
        {children}

        {/* html2canvas */}
        <Script src={HTML2CANVAS_SCRIPT_SRC} strategy="afterInteractive" />

        {/* Google AdSense */}
        <Script
          src={ADSENSE_SCRIPT_SRC}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Kakao AdFit */}
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
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
            gtag('config', 'GT-P842BZSS');
          `}
        </Script>
      </body>
    </html>
  );
}
