import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import CoupangCard from '@/components/CoupangCard';

export const metadata: Metadata = {
  title: '블로그 썸네일 만들기 - 클릭률 올리는 썸네일 완전 가이드',
  description:
    '네이버 블로그 썸네일을 무료로 쉽게 만드는 방법. 조회수 잘 나오는 썸네일의 특징과 제작 팁을 알아보세요.',
  alternates: {
    canonical: 'https://www.blogsumnail.com/guide/thumbnail',
  },
};

export default function ThumbnailGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← 홈으로
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-3 leading-tight">
          블로그 썸네일 만들기<br />클릭률 올리는 방법
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          이 글은 블로그 조회수를 올리고 싶은 분들을 위한 실전 가이드입니다.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          썸네일 하나로 조회수가 바뀝니다. 핵심만 정리했습니다.
        </p>

        {/* 광고 상단 1개 */}
        <AdBanner position="guide-thumbnail-top" type="adsense" />

        {/* 본문 1 - 왜 썸네일이 중요한가 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">왜 썸네일이 중요한가요?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            네이버 블로그 목록에서 사용자는 0.3초 안에 클릭 여부를 결정합니다.
            아무리 좋은 글이어도 썸네일이 흐리거나 텍스트가 안 보이면 클릭이 일어나지 않습니다.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            조회수가 낮은 블로그의 공통점은 단 하나입니다.{' '}
            <strong className="text-gray-900">썸네일에 신경을 안 씁니다.</strong>{' '}
            글을 잘 써놓고 썸네일에서 클릭을 잃습니다.
          </p>
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

        {/* 본문 2 - 잘 되는 썸네일 특징 + 예시 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">잘 되는 썸네일의 3가지 특징</h2>
          <div className="flex flex-col gap-3">
            {[
              { num: '01', title: '텍스트가 짧고 굵다', desc: '15자 이내의 핵심 키워드만. 긴 문장은 작은 썸네일에서 읽히지 않습니다.' },
              { num: '02', title: '배경과 텍스트 대비가 높다', desc: '어두운 배경 + 흰 텍스트, 또는 밝은 배경 + 검정 텍스트. 중간 톤은 피하세요.' },
              { num: '03', title: '카테고리 레이블이 있다', desc: '"맛집", "체험단", "재테크" 같은 레이블이 있으면 독자가 글 주제를 바로 파악합니다.' },
            ].map((item) => (
              <div key={item.num} className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-xs font-mono text-gray-400 mt-0.5 flex-shrink-0">{item.num}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-base font-bold text-gray-900 mb-3">이런 썸네일이 클릭률이 높습니다</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { bg: '/images/cafe.jpg', category: '맛집', title: '성수동 감성 카페 추천', overlay: 0.45 },
              { bg: '/images/jungyeon-food-1390412.jpg', category: '체험단', title: '솔직 체험단 후기', overlay: 0.5 },
            ].map((s, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-4 text-center"
                style={{ backgroundImage: `url('${s.bg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${s.overlay})` }} />
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/80 text-white/90">{s.category}</span>
                  <p className="font-bold text-xs leading-snug text-white">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">위 썸네일은 이 사이트로 1분 안에 만들 수 있습니다.</p>
        </section>

        {/* CTA 2 - 행동 유도 (본문 중간) */}
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
            <Link href="/guide/blog-seo" className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2">
              블로그 조회수 올리는법 — 제목·키워드·글 구조 가이드
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
