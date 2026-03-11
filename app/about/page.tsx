import type { Metadata } from 'next';
import Link from 'next/link';
import { Image as ImageIcon, Lightbulb, Users, Rocket, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: '네이버 블로그 썸네일 메이커 서비스 소개. 만들게 된 이유, 주요 기능, 업데이트 계획을 안내합니다.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-900 hover:underline text-sm mb-6 inline-block">
          ← 홈으로 돌아가기
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-8 h-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">About</h1>
        </div>
        <p className="text-gray-500 mb-8">네이버 블로그 썸네일 메이커 소개</p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">서비스 소개</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              네이버 블로그 썸네일 메이커는 블로거가 별도의 디자인 도구나 전문 지식 없이도 1분 안에
              고품질 썸네일 이미지를 만들 수 있도록 돕는 무료 온라인 도구입니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              제목·서브타이틀·카테고리 텍스트를 입력하고 배경색이나 이미지를 선택한 뒤 다운로드 버튼
              하나로 PNG 이미지를 바로 저장할 수 있습니다. 모든 처리는 브라우저 안에서 이루어지므로
              업로드된 이미지는 어떤 서버에도 전송되지 않습니다.
            </p>
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
            <p className="text-sm text-gray-700 leading-relaxed">
              "네이버 블로그 1:1 썸네일에 딱 맞는, 가입도 설치도 필요 없는 도구가 있으면 어떨까?"
              하는 생각에서 이 서비스가 시작됐습니다. 글 쓰는 시간을 썸네일 제작에 빼앗기지 말고,
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
                '모바일에서도 간편하게 썸네일을 완성하고 싶은 분',
                '일관된 브랜드 이미지를 유지하고 싶은 블로거',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">주요 기능</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: '텍스트 커스터마이징', desc: '제목·서브타이틀·카테고리 입력' },
                { title: '배경 선택', desc: '단색 또는 이미지 업로드' },
                { title: '폰트 & 정렬', desc: '다양한 폰트, 좌·중·우 정렬' },
                { title: '오버레이 조절', desc: '배경 이미지 밝기 투명도 설정' },
                { title: '프레임 스타일', desc: '테두리·라운드·그림자 효과' },
                { title: 'PNG 다운로드', desc: '고해상도(2배) 즉시 저장' },
              ].map((feat, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{feat.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">업데이트 계획</h2>
            </div>
            <ul className="space-y-3">
              {[
                { label: '예정', text: '추천 템플릿 갤러리 — 주제별 미리 디자인된 썸네일 템플릿 제공' },
                { label: '예정', text: '이모지·아이콘 삽입 기능 추가' },
                { label: '예정', text: '텍스트 배경 강조(하이라이트) 효과' },
                { label: '예정', text: '저장된 설정 불러오기 기능' },
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
