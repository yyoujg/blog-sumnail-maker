import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/data/blogPosts';
import { BookOpen, ArrowRight, Image, TrendingUp, Gift, Search, Smartphone, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '블로그 & 가이드',
  description: '네이버 블로그 운영에 도움이 되는 썸네일, 수익화, 체험단, SEO 가이드 모음.',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function readingTime(post: BlogPost) {
  const chars = post.sections.reduce((acc, s) => acc + s.content.length, 0);
  return Math.max(1, Math.round(chars / 500));
}

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  slugs: string[];
};

const CATEGORIES: Category[] = [
  {
    id: 'thumbnail',
    label: '썸네일 만들기',
    icon: <Image className="w-4 h-4" />,
    slugs: [
      'naver-blog-thumbnail-size', 'how-to-make-blog-thumbnail', 'thumbnail-text-tips',
      'thumbnail-design-examples', 'high-ctr-thumbnail', 'thumbnail-low-vs-high-ctr',
      'thumbnail-color-guide', 'thumbnail-structure-guide', 'thumbnail-size-best',
      'thumbnail-quick-creation', 'thumbnail-failure-cases',
    ],
  },
  {
    id: 'monetize',
    label: '수익화',
    icon: <TrendingUp className="w-4 h-4" />,
    slugs: [
      'blog-monetization-guide', 'adsense-guide', 'coupang-partners-income',
      'blog-income-100k', 'blog-side-job-start', 'review-blog-income',
      'blog-affiliate-platforms-2026',
    ],
  },
  {
    id: 'review',
    label: '체험단',
    icon: <Gift className="w-4 h-4" />,
    slugs: [
      'review-blog-tips', 'free-product-blog', 'review-blog-selection',
      'experiential-sites-2026', 'review-schedule-apps-2026',
    ],
  },
  {
    id: 'seo',
    label: 'SEO & 방문자',
    icon: <Search className="w-4 h-4" />,
    slugs: [
      'naver-blog-seo-guide', 'blog-views-zero-reasons', 'naver-blog-increase-visitors',
      'blog-keyword-research', 'blog-keyword-tools-2026',
    ],
  },
  {
    id: 'basics',
    label: '블로그 기초 & 앱',
    icon: <Smartphone className="w-4 h-4" />,
    slugs: [
      'naver-blog-category-setup', 'blog-writing-tips', 'blog-photo-tips', 'blog-apps-2026',
    ],
  },
];

function PostCard({ post }: { post: BlogPost }) {
  const mins = readingTime(post);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex items-start justify-between gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">읽는 시간 {mins}분</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors leading-snug mb-1 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.summary}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 flex-shrink-0 mt-1 transition-colors" />
    </Link>
  );
}

export default function BlogListPage() {
  const slugSet = new Set(blogPosts.map((p) => p.slug));

  // 카테고리별로 매핑
  const categorized = CATEGORIES.map((cat) => ({
    ...cat,
    posts: cat.slugs
      .filter((s) => slugSet.has(s))
      .map((s) => blogPosts.find((p) => p.slug === s)!)
      .filter(Boolean),
  })).filter((cat) => cat.posts.length > 0);

  // 카테고리에 속하지 않는 포스트
  const categorizedSlugs = new Set(CATEGORIES.flatMap((c) => c.slugs));
  const uncategorized = blogPosts.filter((p) => !categorizedSlugs.has(p.slug));

  const totalPosts = blogPosts.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">

        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          홈으로
        </Link>

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <BookOpen className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900">블로그 가이드</h1>
          </div>
          <p className="text-sm text-gray-500">
            네이버 블로그 운영에 도움이 되는 가이드 <span className="font-medium text-gray-700">{totalPosts}개</span>
          </p>
        </div>

        {/* 카테고리 바로가기 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categorized.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              {cat.icon}
              {cat.label}
              <span className="text-gray-400">{categorized.find(c => c.id === cat.id)?.posts.length}</span>
            </a>
          ))}
        </div>

        {/* 카테고리별 섹션 */}
        <div className="space-y-12">
          {categorized.map((cat) => (
            <section key={cat.id} id={cat.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 bg-gray-900 text-white rounded-lg">
                  {cat.icon}
                </span>
                <h2 className="text-base font-bold text-gray-900">{cat.label}</h2>
                <span className="text-xs text-gray-400 ml-1">{cat.posts.length}개</span>
              </div>
              <div className="space-y-2.5">
                {cat.posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}

          {/* 미분류 포스트 */}
          {uncategorized.length > 0 && (
            <section id="etc">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-900">기타</h2>
                <span className="text-xs text-gray-400">{uncategorized.length}개</span>
              </div>
              <div className="space-y-2.5">
                {uncategorized.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 하단 CTA */}
        <div className="mt-12 p-6 bg-gray-900 rounded-xl text-center">
          <p className="text-sm text-gray-400 mb-3">조회수 잘 나오는 썸네일, 지금 바로 만들어보세요</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            썸네일 메이커 사용하기
          </Link>
        </div>

      </div>
    </div>
  );
}
