import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

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
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">

        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-3 leading-tight">
          블로그 조회수 올리는법<br />이 3가지만 바꾸세요
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          이 글은 블로그 수익화를 처음 시작하는 분들을 위한 실전 가이드입니다.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          조회수가 안 나오는 데는 이유가 있습니다. 해결법도 단순합니다.
        </p>

        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-2">검토 기준</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            이 가이드는 검색어, 제목, 글 구조, 썸네일의 네 가지를 함께 점검합니다. 단순히 조회수를 약속하기보다
            실제 블로그 관리자 화면과 Search Console에서 확인할 수 있는 지표를 기준으로 글을 고치는 순서를
            정리했습니다.
          </p>
        </section>

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
                &ldquo;오늘의 카페&rdquo;보다 &ldquo;성수동 카페 추천 주차 가능한 곳&rdquo;처럼 검색 의도에 맞게 제목을 쓰는 것이 핵심입니다.
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
          <h2 className="text-xl font-bold text-gray-900 mb-3">수정 후 확인할 지표</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            제목과 구조를 바꾼 뒤에는 감으로 판단하지 말고 실제 지표를 확인해야 합니다. 하루 단위보다
            7일 단위로 묶어 보면 변화가 더 분명합니다.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: '노출', title: 'Search Console 노출수', desc: '제목에 실제 검색어가 들어가면 먼저 노출수가 움직입니다. 클릭보다 노출 변화가 먼저 나타나는 경우가 많습니다.' },
              { label: '클릭', title: 'CTR과 클릭수', desc: '노출은 있는데 클릭이 낮으면 제목과 썸네일 문구를 함께 점검합니다. 같은 글이라도 약속이 선명하면 클릭률이 달라집니다.' },
              { label: '체류', title: '본문 이탈 지점', desc: '첫 문단에서 결론을 못 찾거나 소제목이 흐리면 바로 이탈합니다. 요약, 목차, 사례 순서로 읽는 흐름을 정리합니다.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-xs font-mono text-gray-400 flex-shrink-0 mt-0.5">{item.label}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-3">바로 고칠 수 있는 순서</h2>
          <ol className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <li>1. 글 제목 앞 15자 안에 검색어를 넣습니다.</li>
            <li>2. 첫 문단 세 문장 안에 결론과 대상 독자를 함께 씁니다.</li>
            <li>3. 소제목은 감상문처럼 쓰지 말고, 독자가 확인하려는 질문으로 바꿉니다.</li>
            <li>4. 대표 이미지에는 제목과 같은 약속을 짧게 반복합니다.</li>
          </ol>
          <Link href="/blog/blog-keyword-strategy-complete" className="inline-flex mt-4 text-sm font-semibold text-gray-900 underline underline-offset-2">
            키워드 전략 글 이어서 보기
          </Link>
        </section>

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
      <SiteFooter />
    </div>
  );
}
