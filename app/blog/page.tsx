import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/data/blogPosts';
import {
  BookOpen,
  ArrowRight,
  Image,
  TrendingUp,
  Compass,
  KeyRound,
  Type,
  FileText,
  Sprout,
  BarChart3,
  Wrench,
  ShieldAlert,
  Settings2,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: '블로그 CTR·검색·썸네일 전략 가이드',
  description: '네이버 블로그 CTR, 검색 노출, 키워드, 제목, 썸네일 문구, 수익화·체험단까지 80편 이상의 실전 가이드 모음.',
  keywords: '네이버 블로그 CTR, 블로그 검색 노출, 키워드 전략, 썸네일 문구, 블로그 제목, 블로그 SEO, 블로그 조회수',
  alternates: {
    canonical: 'https://www.blogsumnail.com/blog',
  },
  openGraph: {
    title: '블로그 CTR·검색·썸네일 전략 가이드 — BlogKit',
    description: '네이버 블로그 CTR, 검색 노출, 키워드, 제목, 썸네일 문구까지 실전 가이드 80편 이상.',
    type: 'website',
    url: 'https://www.blogsumnail.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: '블로그 CTR·검색·썸네일 전략 가이드 — BlogKit',
    description: '네이버 블로그 CTR, 검색 노출, 키워드, 제목, 썸네일 문구까지 실전 가이드 80편 이상.',
  },
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
      'how-to-make-blog-thumbnail',
      'naver-blog-thumbnail-size',
      'high-ctr-thumbnail',
    ],
  },
  {
    id: 'operation',
    label: '블로그 운영 전략',
    icon: <Compass className="w-4 h-4" />,
    slugs: [
      'blog-direction-mistakes-beginners',
      'blog-start-guide',
      'blog-content-planning',
      'naver-vs-tistory-2026',
    ],
  },
  {
    id: 'keyword',
    label: '키워드 & 검색 노출',
    icon: <KeyRound className="w-4 h-4" />,
    slugs: [
      'blog-keyword-strategy-complete',
      'blog-keyword-tools-2026',
      'naver-blog-seo-guide',
    ],
  },
  {
    id: 'title-ctr',
    label: '제목 작성법 (CTR)',
    icon: <Type className="w-4 h-4" />,
    slugs: [
      'blog-title-formula-ctr',
    ],
  },
  {
    id: 'writing',
    label: '글쓰기 전략 (본문)',
    icon: <FileText className="w-4 h-4" />,
    slugs: [
      'blog-post-structure-ranking',
      'readable-writing-three-tips',
      'blog-writing-basic-structure',
      'blog-writing-tips',
    ],
  },
  {
    id: 'growth',
    label: '블로그 성장 전략',
    icon: <Sprout className="w-4 h-4" />,
    slugs: [
      'early-blog-posts-what-to-write',
      'raise-blog-index-case-study',
      'blog-real-experience',
    ],
  },
  {
    id: 'visitors',
    label: '방문자 상승 전략',
    icon: <BarChart3 className="w-4 h-4" />,
    slugs: [
      'naver-blog-increase-visitors',
    ],
  },
  {
    id: 'practical',
    label: '운영 실전 팁',
    icon: <Wrench className="w-4 h-4" />,
    slugs: [
      'blog-writing-speed-5-tips',
      'draft-save-naver-blog',
      'blog-writing-templates',
      'writers-block-blog-ideas',
      'blog-apps-2026',
      'blog-photo-tips',
      'review-schedule-apps-2026',
      'cafe-food-photo-guide',
    ],
  },
  {
    id: 'penalties',
    label: '금지사항 & 패널티',
    icon: <ShieldAlert className="w-4 h-4" />,
    slugs: [
      'blog-posts-that-get-suppressed',
      'keyword-stuffing-problems',
      'forbidden-blog-expressions',
      'exaggerated-claims-blog-why-bad',
    ],
  },
  {
    id: 'settings',
    label: '설정 & 기능 활용',
    icon: <Settings2 className="w-4 h-4" />,
    slugs: [
      'blog-features-100-usage',
      'blog-spam-block-settings',
      'neighbor-vs-mutual-neighbor',
      'blog-category-move-caution',
      'check-who-scrapped-post',
      'naver-blog-category-setup',
    ],
  },
  {
    id: 'monetize',
    label: '수익화 전략',
    icon: <TrendingUp className="w-4 h-4" />,
    slugs: [
      'blog-monetization-guide',
      'adsense-guide',
      'review-blog-monetization',
      'review-blog-income',
      'blog-affiliate-platforms-2026',
      'free-product-blog',
      'review-blog-tips',
      'review-blog-selection',
      'experiential-sites-2026',
    ],
  },
];

const PILLAR_SLUGS = [
  'naver-blog-increase-visitors',
  'how-to-make-blog-thumbnail',
  'high-ctr-thumbnail',
  'naver-blog-thumbnail-size',
  'blog-keyword-strategy-complete',
  'blog-photo-tips',
  'cafe-food-photo-guide',
  'blog-writing-templates',
  'blog-monetization-guide',
] as const;

function PostCard({ post }: { post: BlogPost }) {
  const mins = readingTime(post);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex items-start justify-between gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
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
  const pillarSlugSet = new Set<string>(PILLAR_SLUGS);
  const pillarPosts = PILLAR_SLUGS
    .filter((s) => slugSet.has(s))
    .map((s) => blogPosts.find((p) => p.slug === s)!)
    .filter(Boolean);

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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.blogsumnail.com' },
      { '@type': 'ListItem', position: 2, name: '블로그 가이드', item: 'https://www.blogsumnail.com/blog' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">

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

        {/* 핵심 가이드 10 (허브) */}
        {pillarPosts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start here</p>
                <h2 className="text-base font-bold text-gray-900 mt-1">처음 시작이라면 이것부터 (핵심 가이드)</h2>
                <p className="text-xs text-gray-500 mt-1">
                  검색 유입 → 체류시간 → 썸네일 생성 → 추천/광고 흐름을 만드는 &ldquo;긴 글&rdquo; 모음
                </p>
              </div>
              <span className="text-xs text-gray-400">{pillarPosts.length}개</span>
            </div>
            <div className="space-y-2.5">
              {pillarPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        <AdBanner position="blog-list-top" type="adsense" />

        {/* 카테고리 바로가기 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categorized.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              {cat.icon}
              {cat.label}
              <span className="text-gray-400">{categorized.find(c => c.id === cat.id)?.posts.length}</span>
            </a>
          ))}
        </div>

        {/* 카테고리별 섹션 */}
        <div className="space-y-10">
          {categorized.map((cat) => (
            <section key={cat.id} id={cat.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 bg-[#111111] text-white rounded-lg">
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
        <div className="mt-10 p-6 bg-[#111111] rounded-2xl text-center">
          <p className="text-sm text-gray-400 mb-3">조회수 잘 나오는 썸네일, 지금 바로 만들어보세요</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <BookOpen className="w-4 h-4" />
            썸네일 메이커 사용하기
          </Link>
        </div>

        <AdBanner position="blog-list-bottom" type="adsense" />

      </div>

      <SiteFooter />
    </div>
  );
}
