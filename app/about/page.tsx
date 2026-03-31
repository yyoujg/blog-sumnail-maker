import type { Metadata } from 'next';
import Link from 'next/link';
import { Image as ImageIcon, Lightbulb, Users, Rocket, CheckCircle, Layout } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: '네이버 블로그 썸네일 메이커 & 스킨 메이커 서비스 소개. 만들게 된 이유, 주요 기능, 업데이트 계획을 안내합니다.',
  keywords: '블로그 썸네일 메이커 소개, 썸네일 무료 도구, 블로그 스킨 메이커, 네이버 블로그 도구',
  alternates: {
    canonical: 'https://www.blogsumnail.com/about',
  },
  openGraph: {
    title: 'About — 네이버 블로그 썸네일 메이커',
    description: '네이버 블로그 썸네일 메이커 & 스킨 메이커 서비스 소개.',
    type: 'website',
    url: 'https://www.blogsumnail.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — 네이버 블로그 썸네일 메이커',
    description: '네이버 블로그 썸네일 메이커 & 스킨 메이커 서비스 소개.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-900 hover:underline text-sm mb-6 inline-block">
          ← 홈으로 돌아가기
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-8 h-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">About</h1>
        </div>
        <p className="text-gray-500 mb-8">네이버 블로그 무료 디자인 도구 모음</p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">서비스 소개</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              네이버 블로그 디자인 도구 모음입니다. 별도의 디자인 도구나 전문 지식 없이도
              1분 안에 고품질 썸네일 이미지를 만들거나 홈페이지형 블로그 스킨을 완성할 수 있습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              모든 처리는 브라우저 안에서 이루어지므로 업로드된 이미지는 어떤 서버에도 전송되지 않습니다.
              가입도, 설치도 필요 없습니다.
            </p>
          </div>

          {/* 썸네일 메이커 */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">썸네일 메이커</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              네이버 블로그 1:1 정방형에 최적화된 썸네일을 빠르게 만들 수 있는 도구입니다.
              PC와 모바일 모두에서 잘림 없이 보이도록 설계되어 있습니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: '텍스트 커스터마이징', desc: '제목·서브타이틀·카테고리 태그 입력' },
                { title: '배경 선택', desc: '단색 12가지 프리셋 또는 이미지 직접 업로드' },
                { title: '폰트 & 정렬', desc: '한국어 최적화 폰트, 9방향 텍스트 위치 설정' },
                { title: '오버레이 조절', desc: '배경 이미지 위 어두운 필터 투명도 조절' },
                { title: '프레임 스타일', desc: '실선·이중선·모서리 포인트 테두리 효과' },
                { title: 'PNG / JPG 다운로드', desc: '1× 표준 또는 2× 고화질로 즉시 저장' },
              ].map((feat, i) => (
                <div key={i} className="p-3 bg-[#f5f5f0] rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{feat.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 스킨 메이커 */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">스킨 메이커</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              홈페이지형 네이버 블로그 스킨을 코딩 없이 완성하는 도구입니다.
              실시간 미리보기로 수정하고, 생성된 HTML/CSS 코드를 블로그 스킨 편집기에 붙여넣기만 하면 됩니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: '다양한 스킨 템플릿', desc: '미니멀·다크·컬러풀·그라데이션 등 스타일 선택' },
                { title: '배경 & 색상 설정', desc: '단색·그라데이션·이미지 배경 자유롭게 커스터마이징' },
                { title: '위젯 레이아웃', desc: '2단·3단 그리드 메뉴, 배너 위치 조절' },
                { title: '투명 위젯 다운로드', desc: '블로그 위젯용 투명 PNG 이미지 저장' },
                { title: '코드 자동 생성', desc: '붙여넣기 한 번으로 완성되는 HTML/CSS 코드' },
                { title: '적용 가이드 제공', desc: '네이버 블로그 스킨 편집 단계별 안내' },
              ].map((feat, i) => (
                <div key={i} className="p-3 bg-[#f5f5f0] rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{feat.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">만들게 된 이유</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              네이버 블로그를 운영하다 보면 매 포스팅마다 썸네일을 만드는 것이 생각보다 번거롭습니다.
              포토샵·캔바 같은 도구는 기능이 많아 오히려 시간이 오래 걸리고, 스마트폰 앱은 화질이
              아쉬운 경우가 많습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              홈페이지형 블로그 스킨은 코딩을 모르면 만들기 어렵고, 유료 서비스에 의존해야 하는 상황도 많습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              "가입도 설치도 필요 없이, 블로그 운영에 필요한 디자인 작업을 빠르게 끝낼 수 있으면 어떨까?"
              하는 생각에서 이 서비스가 시작됐습니다. 글 쓰는 시간을 디자인에 빼앗기지 말고,
              콘텐츠에 집중하셨으면 합니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">이런 분께 추천해요</h2>
            </div>
            <ul className="space-y-3">
              {[
                '네이버 블로그를 막 시작한 초보 블로거',
                '디자인 도구가 낯설고 어렵게 느껴지는 분',
                '매 포스팅마다 빠르게 썸네일을 만들고 싶은 파워블로거',
                '홈페이지형 블로그 스킨을 직접 만들어보고 싶은 분',
                '코딩 없이 블로그 스킨을 꾸미고 싶은 분',
                '일관된 브랜드 이미지를 유지하고 싶은 블로거',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">업데이트 계획</h2>
            </div>
            <ul className="space-y-3">
              {[
                { label: '예정', text: '썸네일 메이커 — 텍스트 배경 강조(하이라이트) 효과' },
                { label: '예정', text: '썸네일 메이커 — 이모지·아이콘 삽입 기능' },
                { label: '예정', text: '스킨 메이커 — 더 많은 스킨 템플릿 추가' },
                { label: '예정', text: '스킨 메이커 — SNS 링크 아이콘 위젯 지원' },
                { label: '예정', text: '설정 저장 & 불러오기 기능 (로컬 스토리지)' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-xs bg-gray-200 text-gray-800 font-semibold px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                    {item.label}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              기능 제안은{' '}
              <Link href="/contact" className="text-gray-900 hover:underline">문의 페이지</Link>
              를 통해 보내주시면 적극 검토합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
