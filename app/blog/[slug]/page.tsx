import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import { ArrowLeft, ArrowRight, BookOpen, BookMarked } from 'lucide-react';
import CoupangRecommendations from '@/components/CoupangRecommendations';
import AdBanner from '@/components/AdBanner';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: `${post.title} — 네이버 블로그 썸네일 메이커`,
      description: post.summary,
      type: 'article',
    },
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ①②③ 또는 STEP1, 1. 형태의 항목을 분리해 리스트로 렌더링
function renderContent(content: string) {
  // 원형 숫자 ①~⑩ 또는 STEP N 앞에서 분리
  const circledNums = /(?=①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)/g;
  const stepPattern = /(?=STEP\s*\d)/g;

  const hasCircled = /①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩/.test(content);
  const hasStep = /STEP\s*\d/.test(content);

  if (hasCircled || hasStep) {
    const parts = content
      .split(hasCircled ? circledNums : stepPattern)
      .map((s) => s.trim())
      .filter(Boolean);

    // 첫 조각이 번호로 시작하지 않으면 리드 문장으로 처리
    const leadPattern = /^(①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|STEP)/;
    const lead = !leadPattern.test(parts[0]) ? parts[0] : null;
    const items = lead ? parts.slice(1) : parts;

    return (
      <div className="space-y-3">
        {lead && <p className="text-base text-gray-700 leading-relaxed">{lead}</p>}
        <ul className="space-y-2.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-base text-gray-700 leading-relaxed">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-semibold">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 일반 문단: 마침표+공백 뒤 문장이 길면 줄 단위로 분리
  return <p className="text-base text-gray-700 leading-relaxed">{content}</p>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) notFound();

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  const CORE_RELATED = ['naver-blog-thumbnail-size', 'thumbnail-failure-cases', 'thumbnail-text-tips'];
  const coreRelated = blogPosts.filter(
    (p) => p.slug !== slug && CORE_RELATED.includes(p.slug)
  );
  const extraRelated = blogPosts.filter(
    (p) => p.slug !== slug && !CORE_RELATED.includes(p.slug)
  );
  const relatedPosts = [...coreRelated, ...extraRelated].slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <Link
          href="/blog"
          className="text-gray-500 hover:text-gray-900 text-sm mb-8 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          블로그 목록으로
        </Link>

        <article>
          {/* 헤더 */}
          <header className="mb-8">
            <p className="text-xs text-gray-400 mb-3 tracking-wide">{formatDate(post.date)}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-5">
              {post.title}
            </h1>
            <div className="border-l-4 border-gray-800 pl-4 py-1">
              <p className="text-base text-gray-600 leading-relaxed">{post.summary}</p>
            </div>
          </header>

          <AdBanner type="adsense" position="blog-post-top" />

          {/* 목차 */}
          {post.sections.length > 2 && (
            <nav className="mb-8 bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">목차</p>
              <ol className="space-y-1.5">
                {post.sections.map((section, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 flex-shrink-0 w-4">{i + 1}.</span>
                    <span>{section.heading}</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* 본문 섹션 */}
          <div className="space-y-6">
            {post.sections.map((section, i) => (
              <section
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-6 md:p-7"
              >
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-md flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {section.heading}
                </h2>
                <div className="pl-8">
                  {renderContent(section.content)}
                </div>
              </section>
            ))}
          </div>
        </article>

        <AdBanner type="adsense" position="blog-post-bottom" />

        <CoupangRecommendations />

        {/* CTA */}
        <div className="mt-8 p-6 bg-gray-900 rounded-xl text-center">
          <p className="text-sm text-gray-400 mb-3">블로그 썸네일, 직접 만들어보세요</p>
          <a
            href="https://www.blogsumnail.com"
            className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            썸네일 메이커 사용하기
          </a>
        </div>

        {/* 관련 글 */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            <BookMarked className="w-4 h-4" />
            관련 글
          </h2>
          <div className="grid gap-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-1">
                    {related.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{related.summary}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* 이전/다음 글 */}
        <nav className="mt-8 grid grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors group"
            >
              <span className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> 이전 글
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors group text-right"
            >
              <span className="text-xs text-gray-400 mb-1.5 flex items-center gap-1 justify-end">
                다음 글 <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  );
}
