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
      { source: '/blog/thumbnail-changed-views', destination: '/blog/thumbnail-low-vs-high-ctr', permanent: true },
      { source: '/blog/adsense-approval-2026', destination: '/blog/adsense-guide', permanent: true },
      { source: '/blog/naver-blog-top-exposure', destination: '/blog/naver-blog-increase-visitors', permanent: true },
    ];
  },
};

export default nextConfig;
