import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/local/Dashboard';

// 로컬 전용. BLOG_AUTO_ROOT(.env.local)가 없는 배포본에서는 404.
export const dynamic = 'force-dynamic';
export const metadata = { title: '로컬 편집기', robots: { index: false, follow: false } };

export default async function LocalPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (!process.env.BLOG_AUTO_ROOT) notFound();
  const { tab } = await searchParams;
  return <Dashboard initialTab={tab === 'published' ? 'published' : 'drafts'} />;
}
