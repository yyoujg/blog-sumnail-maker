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
        source: '/:path*',
        has: [{ type: 'host', value: 'blogsumnail.com' }],
        destination: 'https://www.blogsumnail.com/:path*',
        permanent: true,
      },
      {
        source: '/cmd_sco',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
