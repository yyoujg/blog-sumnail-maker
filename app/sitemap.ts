import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogPosts';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(blogPosts[0].date),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogRoutes,
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
