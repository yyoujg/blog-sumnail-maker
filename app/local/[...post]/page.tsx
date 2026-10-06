import { notFound } from 'next/navigation';
import { Workspace } from '@/components/local/Workspace';

export const dynamic = 'force-dynamic';
export const metadata = { title: '글 작업대', robots: { index: false, follow: false } };

export default async function WorkspacePage({ params }: { params: Promise<{ post: string[] }> }) {
  if (!process.env.BLOG_AUTO_ROOT) notFound();
  const { post } = await params;
  return <Workspace post={post.map(decodeURIComponent).join('/')} />;
}
