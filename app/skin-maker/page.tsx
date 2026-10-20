import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SkinMakerTool from '@/components/SkinMakerTool';
import { SITE_URL } from '@/lib/constants';

const PAGE_TITLE =
  '네이버 블로그 스킨메이커 - 무료 블로그 스킨·위젯 디자인 도구 | BlogKit';
const PAGE_DESCRIPTION =
  '네이버 블로그 홈페이지형 스킨을 무료로 디자인하는 스킨메이커. 3000×900 와이드 배경, 중앙 안전영역, 170px 5열 메뉴와 공백·링크 위젯 코드를 함께 만드세요.';

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  keywords:
    '스킨메이커, 네이버 블로그 스킨, 블로그 스킨 만들기, 블로그 스킨 디자인, 투명 위젯, 블로그 위젯 만들기, 블로그 꾸미기, 무료 블로그 스킨, 블로그 스킨 다운로드, 네이버 스킨메이커',
  alternates: {
    canonical: `${SITE_URL}/skin-maker`,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/skin-maker`,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const FAQ_ITEMS = [
  {
    question: '스킨메이커는 어떤 도구인가요?',
    answer:
      '네이버 블로그 상단 스킨 배경, 투명 위젯 영역, 클릭 가능한 링크 좌표를 한 화면에서 디자인하고 PNG로 내보내는 무료 도구입니다. 가입 없이 바로 쓸 수 있고, 디자인 데이터는 브라우저 안에서만 처리됩니다.',
  },
  {
    question: '네이버 블로그 스킨 권장 사이즈는 얼마인가요?',
    answer:
      '새 예시 배경은 3000×900px로 시작합니다. 1920×450, 2750×750, 3000×900 크기를 선택할 수 있으며, 실제 표시 범위는 화면과 블로그 레이아웃에 따라 달라집니다. 3000px 배경에서는 중앙 2200px 안에 중요한 내용을 두고 양옆 400px은 배경만 배치하세요. 메뉴는 중앙의 170px 5열 가이드에 맞춥니다.',
  },
  {
    question: '투명 위젯은 어디에 쓰나요?',
    answer:
      '스킨에 그린 메뉴 위에 실제 클릭 영역을 놓을 때 사용합니다. [글 예시 적용]으로 공백 300px와 메뉴 150px를 각 5개씩 맞추고, 블로그 카테고리에서 복사한 전체 주소를 메뉴에 붙여넣으세요. 별도 이미지 업로드 없이 표 기반 코드를 한 위젯씩 등록할 수 있습니다. 위젯 하나는 폭 170px·높이 600px 이하입니다.',
  },
  {
    question: '만든 스킨을 네이버 블로그에 어떻게 적용하나요?',
    answer:
      '내 메뉴 > 관리 > 꾸미기 설정 > 세부 디자인 설정 > (리모컨) 스킨배경 > 직접등록에 스킨 이미지를 올립니다. 타이틀이 겹치면 [메뉴 사용 설정]에서 "타이틀" 체크를 해제하거나 [세부 디자인 설정]에서 "블로그 제목 표시"를 끄세요. 투명 위젯은 레이아웃·위젯 설정에서 직접등록으로 추가합니다.',
  },
  {
    question: '정말 무료인가요? 다운로드에 제한이 있나요?',
    answer:
      '네, 회원가입·결제 없이 무료입니다. 횟수 제한도 없으며 워터마크도 붙지 않습니다. 가이드를 실습할 수 있도록 제공되는 부속 도구라 광고 외에 부가 비용이 없습니다.',
  },
  {
    question: '디자인 작업을 백업할 수 있나요?',
    answer:
      '같은 브라우저의 로컬 저장공간에 작업을 자동 저장하고, 새로고침하면 복원합니다. 브라우저 데이터 삭제나 저장공간 부족 시에는 복원이 어려울 수 있으니 완성한 스킨 PNG와 위젯 코드를 따로 보관하세요.',
  },
  {
    question: '모바일에서도 스킨이 잘 보이나요?',
    answer:
      '네이버 블로그 모바일은 별도 레이아웃을 사용하기 때문에 PC용 스킨은 데스크탑 브라우저에서만 표시됩니다. 모바일 노출이 목적이라면 썸네일과 본문 첫 이미지가 더 중요합니다.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BlogKit 스킨메이커',
  url: `${SITE_URL}/skin-maker`,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  description:
    '네이버 블로그 스킨 배경과 투명 위젯을 무료로 디자인하고 PNG로 다운로드하는 웹 도구',
};

export default function SkinMakerPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteHeader />

      {/* 인트로 */}
      <section className="px-4 md:px-8 py-10 md:py-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            BlogKit 스킨메이커
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            네이버 블로그 스킨메이커
            <br />
            무료 스킨·투명 위젯 디자인 도구
          </h1>
          <div className="space-y-3 text-base text-gray-600 leading-relaxed max-w-3xl">
            <p>
              <strong className="font-semibold text-gray-800">스킨메이커</strong>는 네이버 블로그
              상단 스킨 배경, 타이틀 이미지, 그리고 투명 위젯 영역까지 한 화면에서 디자인하고 PNG로
              다운로드할 수 있는 무료 도구입니다. 회원가입 없이 브라우저 안에서 바로 사용할 수
              있습니다.
            </p>
            <p>
              일상·리빙·뷰티·여행 사진형 예시는 3000×900 크기로 시작하며, 중앙 안전영역을
              보면서 제목과 메뉴를 자유롭게 편집할 수 있습니다. 사진형 예시는 위쪽 사진 공간을
              위해 공백 높이 600px로 시작하고, 링크 탭에서 높이를 조절할 수 있습니다.
              스킨 PNG를 저장한 뒤 공백 위젯 5개를 윗줄에,
              링크 위젯 5개를 아랫줄에 놓아 홈페이지형 메뉴를 구성하세요. 별도 위젯 이미지
              업로드 없이 코드를 복사해 사용할 수 있습니다.
            </p>
            <p>
              배경 제작과 두 줄 위젯 배치는{' '}
              <a href="https://www.reviewnote.co.kr/communities/influencer/1138199" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">리뷰노트의 홈페이지형 스킨 제작 안내</a>
              의 방식을 참고했습니다. 예시 이미지는 별도로 새로 제작했습니다.
            </p>
            <p>
              스킨만 바꿔도 블로그 첫인상이 달라집니다. 같은 톤의 썸네일까지 함께 맞추고 싶다면{' '}
              <Link
                href="/"
                className="font-semibold text-gray-900 underline underline-offset-2"
              >
                BlogKit 썸네일 메이커
              </Link>
              를, 검색 노출 전략은{' '}
              <Link
                href="/blog"
                className="font-semibold text-gray-900 underline underline-offset-2"
              >
                블로그 가이드
              </Link>
              에서 이어서 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 도구 */}
      <section id="tool" className="px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <SkinMakerTool embedded />
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-labelledby="skin-faq-heading"
        className="px-4 md:px-8 py-10 md:py-14 border-t border-gray-200 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="skin-faq-heading"
            className="text-xl md:text-2xl font-bold text-gray-900 mb-6"
          >
            스킨메이커 자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-6 max-w-3xl">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 text-base text-gray-600 leading-relaxed max-w-3xl">
            <p className="mb-2">
              스킨 디자인 다음 단계로 추천하는 글
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <Link
                  href="/blog/how-to-make-blog-thumbnail"
                  className="font-semibold text-gray-900 underline underline-offset-2"
                >
                  블로그 썸네일 완전 가이드
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/blog-seo"
                  className="font-semibold text-gray-900 underline underline-offset-2"
                >
                  네이버 블로그 검색 노출 기초
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/high-ctr-thumbnail"
                  className="font-semibold text-gray-900 underline underline-offset-2"
                >
                  CTR 높이는 썸네일 문구 패턴
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
