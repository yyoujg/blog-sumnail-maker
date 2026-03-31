import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import AdBanner from '@/components/AdBanner';
import CoupangCard from '@/components/CoupangCard';

export const metadata: Metadata = {
  title: '블로그 조회수 올리는법 - 네이버 블로그 SEO 완전 가이드',
  description:
    '네이버 블로그 조회수가 안 나오는 이유와 해결법. 제목, 키워드, 글 구조 3가지만 바꾸면 조회수가 달라집니다.',
  keywords: '블로그 조회수 올리기, 네이버 블로그 SEO, 블로그 키워드, 네이버 검색 최적화, 블로그 글쓰기 팁, 블로그 제목 쓰는법',
  alternates: {
    canonical: 'https://www.blogsumnail.com/guide/blog-seo',
  },
  openGraph: {
    title: '블로그 조회수 올리는법 - 네이버 블로그 SEO 완전 가이드',
    description: '네이버 블로그 조회수가 안 나오는 이유와 해결법. 제목, 키워드, 글 구조 3가지만 바꾸면 조회수가 달라집니다.',
    type: 'article',
    url: 'https://www.blogsumnail.com/guide/blog-seo',
  },
  twitter: {
    card: 'summary_large_image',
    title: '블로그 조회수 올리는법 - 네이버 블로그 SEO 완전 가이드',
    description: '네이버 블로그 조회수가 안 나오는 이유와 해결법.',
  },
};

export default function BlogSeoGuidePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-3 leading-tight">
          블로그 조회수 올리는법<br />이 3가지만 바꾸세요
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          이 글은 블로그 수익화를 처음 시작하는 분들을 위한 실전 가이드입니다.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          조회수가 안 나오는 데는 이유가 있습니다. 해결법도 단순합니다.
        </p>

        {/* 광고 상단 1개 */}
        <AdBanner position="guide-blog-seo-top" type="adsense" />

        {/* 본문 1 - 조회수 안 나오는 이유 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">조회수가 안 나오는 이유</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
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

        {/* CTA 1 - 툴 유도 (본문 초반) */}
        <div className="mt-8 mb-10 bg-white rounded-xl border border-[#e5e7eb] p-5">
          <p className="text-sm text-gray-600 mb-1">
            이 글에서 설명하는 썸네일은 아래에서 바로 만들 수 있습니다
          </p>
          <Link href="/" className="text-sm font-semibold text-gray-900 underline underline-offset-2">
            조회수 잘 나오는 썸네일 만들기 →
          </Link>
        </div>

        {/* 본문 2 - 해결법 3가지 + 수익 구조 */}
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
                제목 아래에 핵심 요약, 소제목으로 나눈 본문, 마무리 순서면 됩니다.
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
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">수익이 나는 구조</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            조회수가 쌓이면 수익으로 연결됩니다. 대표적으로 3가지입니다.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { emoji: '💰', title: '애드센스 / 애드포스트', desc: '방문자가 많아질수록 광고 수익이 늘어납니다. 하루 1,000명 이상이면 의미 있는 수익이 납니다.' },
              { emoji: '🛒', title: '쿠팡 파트너스', desc: '리뷰 글에 쿠팡 링크를 넣으면 구매 시 수수료가 발생합니다. 블로그 주제와 맞는 제품을 소개하세요.' },
              { emoji: '🎁', title: '체험단', desc: '방문자가 일정 수준 이상이면 체험단 제품을 받을 수 있습니다. 조회수가 올라가면 제안이 들어옵니다.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA 2 - 행동 유도 (쿠팡/체험단 설명 이후) */}
        <div className="mt-8 mb-10 bg-white rounded-xl border border-[#e5e7eb] p-5">
          <p className="text-sm text-gray-700 font-medium mb-1">
            결국 중요한 건 &ldquo;클릭되는 썸네일&rdquo;입니다
          </p>
          <p className="text-sm text-gray-500 mb-2">
            조회수는 여기서 시작됩니다
          </p>
          <Link href="/" className="text-sm font-semibold text-gray-900 underline underline-offset-2">
            클릭되는 썸네일 직접 만들어보기 →
          </Link>
        </div>

        {/* 쿠팡 상품 */}
        <div className="mt-10">
          <p className="text-sm text-gray-600 mb-1">썸네일 퀄리티가 올라가면 조회수도 같이 올라갑니다</p>
          <p className="text-sm text-gray-600 mb-1">블로그 운영할 때 이런 장비 많이 씁니다</p>
          <p className="text-xs text-gray-400 mb-3">초반에는 가성비 위주로 시작해도 충분합니다</p>
          <CoupangCard
            src="https://coupa.ng/clQwSN"
            name="셀루미 초경량 스마트폰 삼각대"
            desc="배경 사진 직접 찍어 쓰는 분들께 추천해요. 손떨림 없이 고정된 앵글로 찍으면 썸네일 소스 퀄리티가 확 달라집니다."
          />
        </div>

        {/* CTA 3 - 재전환 (상품 아래) */}
        <div className="mt-8 mb-10 bg-white rounded-xl border border-[#e5e7eb] p-5">
          <p className="text-sm text-gray-700 font-medium mb-1">
            장비보다 중요한 건 썸네일입니다
          </p>
          <p className="text-sm text-gray-500 mb-2">지금 바로 적용해보세요</p>
          <Link href="/" className="text-sm font-semibold text-gray-900 underline underline-offset-2">
            1분 만에 썸네일 완성하기 →
          </Link>
        </div>

        {/* 관련 글 */}
        <section className="mt-10">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">관련 가이드</h3>
          <div className="flex flex-col gap-2">
            <Link href="/guide/thumbnail" className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2">
              블로그 썸네일 만들기 — 클릭률 올리는 방법
            </Link>
            <Link href="/blog" className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2">
              블로그 & 가이드 전체 보기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
