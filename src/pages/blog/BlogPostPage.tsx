import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import AdBanner from '../../components/AdBanner';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — 네이버 블로그 썸네일 메이커`;

    const prev = document.querySelector('meta[name="description"][data-blog]');
    if (prev) prev.remove();
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', post.summary);
    meta.setAttribute('data-blog', 'true');
    document.head.appendChild(meta);

    return () => {
      document.title = '네이버 블로그 썸네일 메이커 - 무료 1분 완성';
      const m = document.querySelector('meta[name="description"][data-blog]');
      if (m) m.remove();
    };
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

  const midIndex = Math.floor(post.sections.length / 2);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="text-gray-900 hover:underline text-sm mb-6 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          블로그 목록으로
        </Link>

        <article>
          <header className="mb-8">
            <p className="text-xs text-gray-400 mb-2">{formatDate(post.date)}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
              {post.title}
            </h1>
            <p className="text-gray-600 leading-relaxed border-l-4 border-gray-300 pl-4 bg-gray-100 py-3 rounded-r-lg">
              {post.summary}
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-8">
            {post.sections.map((section, i) => (
              <>
                <section key={i}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {section.heading}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
                </section>
                {i === midIndex && (
                  <AdBanner key={`ad-mid-${i}`} position="블로그 본문 중간" type="coupang" />
                )}
              </>
            ))}
          </div>
        </article>

        <AdBanner position="블로그 포스트 하단" type="coupang" />

        {/* 네이티브 상품 추천 카드 */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">블로거 추천 상품</p>
          <div className="flex items-center gap-5">
            <iframe
              src="https://coupa.ng/clQv2U"
              width="120"
              height="240"
              frameBorder="0"
              scrolling="no"
              referrerPolicy="unsafe-url"
              title="쿠팡 추천 상품"
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-800">블로그 운영에 도움이 되는 상품</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                블로거라면 꼭 한 번쯤 확인해보세요.<br />
                쿠팡에서 다양한 블로그 관련 도구를 찾아볼 수 있습니다.
              </p>
              <p className="text-xs text-gray-300 mt-2">
                이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-gray-100 rounded-xl border border-gray-200 text-center">
          <p className="text-sm text-gray-700 mb-3">
            바로 썸네일을 만들어보고 싶으신가요?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            썸네일 메이커 사용하기
          </Link>
        </div>

        <nav className="mt-8 grid grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="flex flex-col p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <span className="text-xs text-gray-400 mb-1 flex items-center gap-1">
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
              to={`/blog/${nextPost.slug}`}
              className="flex flex-col p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group text-right"
            >
              <span className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">
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
