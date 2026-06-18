import type { MetadataRoute } from 'next';
import { SITE_NAME, PAGE_TITLE, OG_DESCRIPTION, THEME_COLOR } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PAGE_TITLE,
    short_name: SITE_NAME,
    description: OG_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: THEME_COLOR,
    lang: 'ko',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
