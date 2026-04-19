import { blogPosts } from '@/data/blogPosts';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export function GET() {
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: '2026-04-19', changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/blog`, lastmod: blogPosts[0].date, changefreq: 'weekly', priority: '0.9' },
    ...blogPosts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    { loc: `${SITE_URL}/guide/thumbnail`, lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE_URL}/guide/blog-seo`, lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE_URL}/about`, lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/contact`, lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/privacy`, lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_URL}/terms`, lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.5' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
