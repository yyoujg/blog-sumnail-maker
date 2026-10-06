import { notFound } from 'next/navigation';
import { FinancePage } from '@/components/local/FinancePage';

export const dynamic = 'force-dynamic';
export const metadata = { title: '금융 썸네일', robots: { index: false, follow: false } };

export default function Page() {
  if (!process.env.BLOG_AUTO_ROOT) notFound();
  return <FinancePage />;
}
