import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import { BookOpen, ArrowRight } from 'lucide-react';
import CoupangCard from '@/components/CoupangCard';

export const metadata: Metadata = {
  title: '블로그 & 가이드',
  description: '네이버 블로그 썸네일 제작에 도움이 되는 팁과 가이드 모음.',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-900 hover:underline text-sm mb-6 inline-block">
          ← 홈으로 돌아가기
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-7 h-7 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">블로그 & 가이드</h1>
        </div>
        <p className="text-gray-500 mb-6">
          네이버 블로그 썸네일 제작에 도움이 되는 팁과 가이드를 모았습니다.
        </p>

        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-8">
          <p className="text-sm text-gray-700 font-medium mb-1">
            블로그 조회수 올리는 방법, 썸네일부터 시작하세요
          </p>
          <Link href="/" className="text-sm font-semibold text-gray-900 underline underline-offset-2">
            썸네일 만들기 →
          </Link>
        </div>

        <div className="space-y-4">
          {blogPosts.flatMap((post, i) => [
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">{formatDate(post.date)}</p>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{post.summary}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" />
              </div>
            </Link>,
            i === 2 ? (
              <CoupangCard
                key="coupang-mid"
                src="https://coupa.ng/clQwQw"
                name="주닉스 ZNS-S16 LED 링 라이트"
                desc="얼굴이나 제품을 균일하게 비춰줘서 그림자 없이 깔끔한 사진을 찍을 수 있어요. 뷰티·요리·제품 리뷰 블로거분들께 특히 추천합니다."
              />
            ) : null,
          ])}
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-gray-900 hover:underline text-sm">
            ← 썸네일 메이커로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
