import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Mail, Bug, Lightbulb, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: '문의',
  description: '버그 제보, 기능 제안, 제휴 문의는 이메일로 보내주세요.',
  keywords: '블로그 썸네일 메이커 문의, 버그 제보, 기능 제안, 제휴 문의',
  alternates: {
    canonical: 'https://www.blogsumnail.com/contact',
  },
  openGraph: {
    title: '문의 — 네이버 블로그 썸네일 메이커',
    description: '버그 제보, 기능 제안, 제휴 문의는 이메일로 보내주세요.',
    type: 'website',
    url: 'https://www.blogsumnail.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: '문의 — 네이버 블로그 썸네일 메이커',
    description: '버그 제보, 기능 제안, 제휴 문의는 이메일로 보내주세요.',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">

        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-7 h-7 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">문의</h1>
        </div>
        <p className="text-gray-500 mb-8">서비스 이용 중 불편한 점이나 건의사항을 편하게 보내주세요.</p>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">이메일 문의</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              모든 문의는 이메일로 받고 있습니다. 영업일 기준 1~3일 내에 답변드립니다.
            </p>
            <a
              href="mailto:andn1026@gmail.com"
              className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#222222] transition-colors"
            >
              <Mail className="w-4 h-4" />
              andn1026@gmail.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-900">버그 제보</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              다음 내용을 포함해 제보해 주시면 빠르게 확인할 수 있습니다.
            </p>
            <ul className="space-y-2">
              {[
                '사용 중인 기기 및 브라우저 (예: iPhone Safari, Chrome 최신)',
                '어떤 동작을 했을 때 문제가 발생했는지',
                '오류 메시지가 있다면 스크린샷 또는 메시지 내용',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:andn1026@gmail.com?subject=[버그제보] "
              className="mt-4 inline-flex items-center gap-2 text-red-600 border border-red-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Bug className="w-4 h-4" />
              버그 제보하기
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-gray-900">기능 제안</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              "이런 기능이 있으면 좋겠다"는 아이디어를 적극 반영하고 있습니다. 어떤 아이디어든 환영합니다.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                '어떤 상황에서 해당 기능이 필요한지',
                '현재 불편한 점이 무엇인지',
                '참고할 만한 레퍼런스가 있다면 링크',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:andn1026@gmail.com?subject=[기능제안] "
              className="inline-flex items-center gap-2 text-yellow-700 border border-yellow-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              기능 제안하기
            </a>
          </div>

          <div className="bg-gray-100 rounded-xl p-5 text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-1">제휴 및 기타 문의</p>
            <p>
              광고 제휴, 콘텐츠 협업 등 기타 문의도{' '}
              <a href="mailto:andn1026@gmail.com" className="text-gray-900 hover:underline">
                andn1026@gmail.com
              </a>
              으로 연락해 주세요.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
