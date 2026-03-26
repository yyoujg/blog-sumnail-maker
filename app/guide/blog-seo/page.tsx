import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: '블로그 조회수 올리는법 - 네이버 블로그 SEO 완전 가이드',
  description:
    '네이버 블로그 조회수가 안 나오는 이유와 해결법. 제목, 키워드, 글 구조 3가지만 바꾸면 조회수가 달라집니다.',
  alternates: {
    canonical: 'https://www.blogsumnail.com/guide/blog-seo',
  },
};

export default function BlogSeoGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← 홈으로
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-3 leading-tight">
          블로그 조회수 올리는법<br />이 3가지만 바꾸세요
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          조회수가 안 나오는 데는 이유가 있습니다. 해결법도 단순합니다.
        </p>

        <AdBanner position="guide-blog-seo" type="adsense" />

        {/* 조회수 안 나오는 이유 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">조회수가 안 나오는 이유</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            열심히 글을 써도 조회수가 0에 머무르는 분들이 많습니다. 글 퀄리티 문제가 아닐 가능성이 높습니다.
            네이버 블로그의 노출 구조를 모르면 아무리 잘 써도 검색에 뜨지 않습니다.
          </p>
          <div className="flex flex-col gap-2">
            {[
              '사람들이 검색하지 않는 제목을 쓴다',
              '키워드 없이 감성적으로만 쓴다',
              '글 구조가 없어서 이탈률이 높다',
              '썸네일이 클릭을 유도하지 못한다',
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                {reason}
              </div>
            ))}
          </div>
        </section>

        {/* 제목/키워드/썸네일 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">해결법: 딱 3가지</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gray-400">01</span>
                <h3 className="font-bold text-gray-900 text-sm">제목에 키워드를 넣으세요</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                사람들이 네이버에서 실제로 검색하는 단어를 제목에 포함시켜야 합니다.
                "오늘의 카페" → "성수동 카페 추천 주차 가능한 곳". 검색 의도에 맞게 제목을 쓰는 것이 핵심입니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gray-400">02</span>
                <h3 className="font-bold text-gray-900 text-sm">글 구조를 만드세요</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                두괄식으로 쓰세요. 결론을 먼저 말하고 이유와 예시를 나중에 붙이는 구조입니다.
                제목 아래에 핵심 요약 1~2문장, 소제목으로 나눈 본문, 마무리 CTA 순서면 됩니다.
                이탈률이 낮아지고 체류 시간이 늘어납니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gray-400">03</span>
                <h3 className="font-bold text-gray-900 text-sm">썸네일로 클릭을 유도하세요</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                검색 목록에서 클릭이 일어나지 않으면 노출이 의미 없습니다.
                짧은 텍스트, 높은 대비, 카테고리 레이블 — 이 세 가지가 클릭률을 높입니다.
              </p>
              <Link href="/guide/thumbnail" className="text-xs text-gray-900 underline underline-offset-2 mt-2 inline-block">
                썸네일 만드는 법 보기 →
              </Link>
            </div>
          </div>
        </section>

        {/* 툴 연결 */}
        <section className="mt-10 bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">썸네일 먼저 만들고 시작하세요</p>
          <p className="text-xs text-gray-500 mb-4">1분이면 됩니다 — 무료, 설치 불필요</p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-700 transition"
          >
            썸네일 만들기 →
          </Link>
        </section>

        <AdBanner position="guide-blog-seo" type="adsense" />

        {/* CTA */}
        <section className="mt-10 border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-700 font-semibold mb-1">네이버 블로그 수익화도 가능합니다</p>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            하루 1,000명 이상 유입이 되면 애드센스, 쿠팡 파트너스, 체험단으로 월 수익이 나기 시작합니다.
            조회수가 먼저입니다.
          </p>
          <Link href="/blog" className="text-sm text-gray-900 underline underline-offset-2">
            블로그 수익화 가이드 보기 →
          </Link>
        </section>

        <div className="mt-8">
          <AdBanner position="guide-blog-seo" type="adsense" />
        </div>
      </div>
    </div>
  );
}
