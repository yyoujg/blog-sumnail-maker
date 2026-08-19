import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SkinMakerTool from '@/components/SkinMakerTool';
import { SITE_URL } from '@/lib/constants';

const PAGE_TITLE =
  '네이버 블로그 스킨메이커 - 무료 블로그 스킨·위젯 디자인 도구 | BlogKit';
const PAGE_DESCRIPTION =
  '네이버 블로그 스킨과 투명 위젯을 무료로 디자인하고 다운로드하는 스킨메이커. 1920×450 배경, 위젯 영역, 링크 좌표까지 한 번에 만들고 바로 적용하세요.';

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
      '기본 스킨 배경은 가로 1920px, 세로 450px이 일반적입니다. 스킨메이커에서 캔버스 크기를 직접 조절할 수 있고, 사이드바·위젯 영역까지 고려해 텍스트 위치를 잡을 수 있습니다.',
  },
  {
    question: '투명 위젯은 어디에 쓰나요?',
    answer:
      '네이버 블로그에서 스킨 위에 있는 메뉴·SNS 링크처럼 보이게 만들고 싶을 때 사용합니다. 170px 폭의 투명 PNG 위젯을 스킨메이커에서 함께 다운받아, 블로그 위젯 자리에 업로드하면 됩니다.',
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
      '브라우저 상태로만 유지되므로 새로고침 시 초기화됩니다. 다 만들기 전에는 탭을 닫지 마시고, 작업이 끝나면 스킨 PNG와 투명 위젯 PNG를 즉시 다운로드해 두는 것을 권장합니다.',
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
              기본 캔버스는 1920×450 권장 비율로 시작하며, 텍스트·이미지·링크 좌표 요소를
              자유롭게 배치할 수 있습니다. 디자인이 끝나면 스킨 PNG와 함께 170px 폭의 투명 위젯
              이미지를 받아 블로그 꾸미기 메뉴에서 그대로 적용하면 됩니다.
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
