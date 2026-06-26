import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path((?!ads\\.txt$).*)',
        has: [{ type: 'host', value: 'blogsumnail.com' }],
        destination: 'https://www.blogsumnail.com/:path',
        permanent: true,
      },
      {
        source: '/cmd_sco',
        destination: '/',
        permanent: false,
      },
      // 구 슬러그 → 현재 슬러그 301 리다이렉트
      { source: '/blog/smartphone-blog-photo', destination: '/blog/blog-photo-tips', permanent: true },
      { source: '/blog/monetize-blog', destination: '/blog/blog-monetization-guide', permanent: true },
      { source: '/blog/thumbnail-ctr-guide', destination: '/blog/high-ctr-thumbnail', permanent: true },
      { source: '/blog/thumbnail-changed-views', destination: '/blog/high-ctr-thumbnail', permanent: true },
      { source: '/blog/adsense-approval-2026', destination: '/blog/adsense-guide', permanent: true },
      { source: '/blog/naver-blog-top-exposure', destination: '/blog/naver-blog-increase-visitors', permanent: true },
      // 썸네일 클러스터 통폐합 301
      { source: '/blog/thumbnail-real-cases-copy-patterns-by-niche', destination: '/blog/how-to-make-blog-thumbnail', permanent: true },
      { source: '/blog/thumbnail-text-tips', destination: '/blog/how-to-make-blog-thumbnail', permanent: true },
      { source: '/blog/thumbnail-design-examples', destination: '/blog/how-to-make-blog-thumbnail', permanent: true },
      { source: '/blog/thumbnail-color-guide', destination: '/blog/how-to-make-blog-thumbnail', permanent: true },
      { source: '/blog/thumbnail-structure-guide', destination: '/blog/how-to-make-blog-thumbnail', permanent: true },
      { source: '/blog/thumbnail-quick-creation', destination: '/blog/how-to-make-blog-thumbnail', permanent: true },
      { source: '/blog/thumbnail-size-best', destination: '/blog/naver-blog-thumbnail-size', permanent: true },
      { source: '/blog/thumbnail-failure-cases', destination: '/blog/high-ctr-thumbnail', permanent: true },
      { source: '/blog/thumbnail-low-vs-high-ctr', destination: '/blog/high-ctr-thumbnail', permanent: true },
      // 키워드 클러스터 통폐합 301
      { source: '/blog/blog-keyword-research', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
      { source: '/blog/blog-keyword-structure-1000-visitors', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
      { source: '/blog/main-vs-sub-keyword-guide', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
      { source: '/blog/indexed-vs-buried-posts-keyword', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
      { source: '/blog/keyword-placement-title-body', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
      { source: '/blog/keyword-order-and-views', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
      { source: '/blog/sub-keyword-traffic-boost', destination: '/blog/blog-keyword-strategy-complete', permanent: true },
    ];
  },
};

export default nextConfig;
