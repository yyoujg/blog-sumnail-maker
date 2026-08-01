import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts, type BlogSection } from '@/data/blogPosts';
import { ArrowLeft, ArrowRight, BookOpen, BookMarked } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
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
    alternates: {
      canonical: `https://www.blogsumnail.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} — 네이버 블로그 썸네일 메이커`,
      description: post.summary,
      type: 'article',
      url: `https://www.blogsumnail.com/blog/${post.slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${post.title} — 네이버 블로그 썸네일 메이커`,
      description: post.summary,
    },
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function linkify(text: string): React.ReactNode[] {
  const urlPattern = /(\bhttps?:\/\/[^\s)]+|\b[\w-]+(?:\.[a-z]{2,})+(?:\/[^\s)]*)?)/g;
  const parts = text.split(urlPattern);
  urlPattern.lastIndex = 0;
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      urlPattern.lastIndex = 0;
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a key={i} href={href} target="_blank" rel="nofollow noopener noreferrer"
          className="text-blue-600 underline underline-offset-2 hover:text-blue-800 break-all">
          {part}
        </a>
      );
    }
    return part;
  });
}

function renderContent(content: string) {
  const circledNums = /(?=①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|⑪|⑫|⑬|⑭|⑮)/g;
  const stepPattern = /(?=STEP\s*\d)/g;
  const hasCircled = /①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|⑪|⑫|⑬|⑭|⑮/.test(content);
  const hasStep = /STEP\s*\d/.test(content);

  if (hasCircled || hasStep) {
    const parts = content
      .split(hasCircled ? circledNums : stepPattern)
      .map((s) => s.trim())
      .filter(Boolean);

    const leadPattern = /^(①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|⑪|⑫|⑬|⑭|⑮|STEP)/;
    const lead = !leadPattern.test(parts[0]) ? parts[0] : null;
    const items = lead ? parts.slice(1) : parts;

    return (
      <div className="space-y-4">
        {lead && (
          <p className="text-[15px] text-gray-700 leading-[1.85]">{linkify(lead)}</p>
        )}
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const clean = item
              .replace(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]\s*/, '')
              .replace(/^STEP\s*\d+\s*/i, '');
            return (
              <li key={idx} className="flex gap-3.5 text-[15px] text-gray-700 leading-[1.85]">
                <span className="mt-[3px] flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="flex-1">{linkify(clean)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <p className="text-[15px] text-gray-700 leading-[1.85]">{linkify(content)}</p>
  );
}

function SectionImage({ section }: { section: BlogSection }) {
  if (!section.imageUrl) return null;
  const alt = section.imageAlt ?? section.heading;
  return (
    <figure className="mb-5">
      <Image
        src={section.imageUrl}
        alt={alt}
        width={800}
        height={800}
        className="w-full h-auto rounded-xl border border-gray-100 object-cover"
        sizes="(max-width: 672px) 100vw, 672px"
      />
      {section.imageCaption && (
        <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed px-1">
          {section.imageCaption}
        </figcaption>
      )}
    </figure>
  );
}

const SITE_URL = 'https://www.blogsumnail.com';

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) notFound();

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
  const midAdAfterIndex = post.sections.length >= 4 ? Math.floor(post.sections.length / 2) - 1 : -1;

  const CORE_RELATED = ['naver-blog-thumbnail-size', 'high-ctr-thumbnail', 'how-to-make-blog-thumbnail'];
  const coreRelated = blogPosts.filter((p) => p.slug !== slug && CORE_RELATED.includes(p.slug));
  const extraRelated = blogPosts.filter((p) => p.slug !== slug && !CORE_RELATED.includes(p.slug));
  const relatedPosts = [...coreRelated, ...extraRelated].slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'BlogKit', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'BlogKit', url: SITE_URL },
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '블로그 가이드', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">

        <Link
          href="/blog"
          className="text-gray-500 hover:text-gray-800 text-sm mb-10 inline-flex items-center gap-1.5 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          블로그 목록으로
        </Link>

        <article>
          {/* 헤더 */}
          <header className="mb-10">
            <p className="text-xs text-gray-400 mb-3 tracking-wide">{formatDate(post.date)}</p>
            <h1 className="text-2xl md:text-[1.75rem] font-bold text-gray-900 leading-snug mb-6">
              {post.title}
            </h1>
            <div className="bg-gray-100 rounded-xl px-5 py-4 border-l-4 border-amber-500">
              <p className="text-[15px] text-gray-600 leading-[1.85]">{post.summary}</p>
            </div>
          </header>

          <AdBanner type="adsense" position="blog-post-top" />

          {/* 목차 */}
          {post.sections.length > 2 && (
            <nav aria-label="목차" className="mb-10 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-[#f5f5f0] border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">목차</h2>
              </div>
              <ol className="p-5 space-y-2">
                {post.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="flex gap-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-gray-300 font-mono flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* 본문 섹션 */}
          <div className="space-y-5">
            {post.sections.map((section, i) => (
              <div key={i} className="space-y-5">
                <section id={`section-${i}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden scroll-mt-24">
                  {/* 섹션 헤더 */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#111111] text-white rounded-md flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <h2 className="text-[15px] md:text-base font-bold text-gray-900 leading-snug">
                      {section.heading}
                    </h2>
                  </div>
                  {/* 섹션 본문 */}
                  <div className="px-6 py-5">
                    <SectionImage section={section} />
                    {renderContent(section.content)}
                  </div>
                </section>

                {i === midAdAfterIndex && (
                  <AdBanner type="adsense" position="blog-post-mid" />
                )}
              </div>
            ))}
          </div>
        </article>

        <AdBanner type="adsense" position="blog-post-bottom" />

        {/* CTA */}
        <div className="mt-10 p-6 bg-[#111111] rounded-2xl text-center">
          <p className="text-sm text-gray-400 mb-3">블로그 썸네일, 직접 만들어보세요</p>
          <a
            href="https://www.blogsumnail.com"
            className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            썸네일 메이커 사용하기
          </a>
        </div>

        {/* 관련 글 */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            <BookMarked className="w-3.5 h-3.5" />
            관련 글
          </h2>
          <div className="grid gap-2.5">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 line-clamp-1">
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
        <nav className="mt-8 grid grid-cols-2 gap-3">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              <span className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> 이전 글
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 text-right"
            >
              <span className="text-xs text-gray-400 mb-1.5 flex items-center gap-1 justify-end">
                다음 글 <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : <div />}
        </nav>

      </div>
      <SiteFooter />
    </div>
  );
}
