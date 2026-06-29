import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Image as ImageIcon, Lightbulb, Users, Rocket, CheckCircle, Layout, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'BlogKit은 네이버 블로그 CTR·검색유입·썸네일 전략 가이드 허브입니다. 콘텐츠 범위, 운영 방침, 보조 도구를 안내합니다.',
  keywords: 'BlogKit 소개, 블로그 CTR 가이드, 네이버 블로그 SEO, 썸네일 전략, 블로그 운영 가이드',
  alternates: {
    canonical: 'https://www.blogsumnail.com/about',
  },
  openGraph: {
    title: 'About — BlogKit',
    description: '네이버 블로그 CTR·검색·썸네일 전략 가이드 허브 소개.',
    type: 'website',
    url: 'https://www.blogsumnail.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — BlogKit',
    description: '네이버 블로그 CTR·검색·썸네일 전략 가이드 허브 소개.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">

        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-8 h-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">About</h1>
        </div>
        <p className="text-gray-500 mb-8">네이버 블로그 CTR·검색·썸네일 전략 가이드 허브</p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">BlogKit이 하는 일</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              BlogKit은 네이버 블로그 운영자를 위한 <strong>콘텐츠·연구 가이드</strong> 사이트입니다.
              검색 노출, 제목·키워드 구조, 썸네일 문구와 CTR, 글쓰기·수익화·체험단까지 실전 글을
              카테고리별로 정리해 두었습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <Link href="/blog" className="text-gray-900 font-medium underline underline-offset-2">블로그 가이드</Link>
              에서 주제별로 읽을 수 있으며, 가이드에서 다룬 전략을 바로 적용할 수 있는 무료 썸네일·스킨
              도구를 보조로 제공합니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">콘텐츠 범위</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              80편 이상의 가이드 글을 11개 카테고리(키워드·제목·방문자·수익화·썸네일 등)로 운영합니다.
              시즌별 키워드, CTR 제목 공식, 체험단·리뷰 촬영 등 검색 유입과 클릭에 직결되는 주제를
              중심으로 보강하고 있습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              글은 운영 경험과 공개된 블로그·검색 트렌드를 바탕으로 작성하며, 수익·노출 결과는
              개인·시기에 따라 달라질 수 있습니다.
            </p>
          </div>

          {/* 썸네일 메이커 */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">보조 도구 — 썸네일 만들기</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              가이드에서 정한 문구·스타일을 바로 적용할 수 있는 1:1 썸네일 제작 도구입니다. 브라우저에서만 동작하며 업로드한 사진은 서버로 전송되지 않습니다.
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

          {/* 스킨메이커 */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">보조 도구 — 스킨 만들기</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              가이드와 함께 쓰는 홈페이지형 블로그 스킨 제작 보조 도구입니다. 생성된 HTML/CSS를 네이버 블로그 스킨 편집기에 붙여 넣을 수 있습니다.
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
                { label: '예정', text: '스킨메이커 — 더 많은 스킨 템플릿 추가' },
                { label: '예정', text: '스킨메이커 — SNS 링크 아이콘 위젯 지원' },
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

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">운영·문의</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              문의·버그 제보·기능 제안은{' '}
              <Link href="/contact" className="text-gray-900 font-medium underline underline-offset-2">문의 페이지</Link>
              또는 이메일(andn1026@gmail.com)로 보내 주세요.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              체험단·수익화·검색 노출 관련 내용은 참고용이며, 플랫폼 정책 변경에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
