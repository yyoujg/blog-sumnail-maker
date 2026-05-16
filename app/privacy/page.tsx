import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: 'BlogKit(블로그 CTR·검색·썸네일 가이드) 개인정보 처리방침입니다.',
  keywords: '개인정보처리방침, BlogKit, 블로그 가이드',
  openGraph: {
    title: '개인정보 처리방침 — BlogKit',
    description: 'BlogKit 개인정보 처리방침입니다.',
    type: 'website',
    url: 'https://www.blogsumnail.com/privacy',
  },
  alternates: {
    canonical: 'https://www.blogsumnail.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보 처리방침</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. 수집하는 개인정보</h2>
            <p>
              본 서비스(네이버 블로그 썸네일 메이커, 이하 "서비스")는 사용자로부터 별도의 개인정보를
              수집하지 않습니다. 업로드된 이미지는 브라우저 내에서만 처리되며 서버로 전송되거나
              저장되지 않습니다. 회원가입, 로그인 기능이 없으므로 이름·이메일·전화번호 등의 개인
              식별 정보는 수집하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. 쿠키(Cookie) 사용</h2>
            <p className="mb-2">본 서비스는 다음의 목적으로 쿠키를 사용할 수 있습니다.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-2">
              <li><strong>필수 쿠키</strong>: 서비스의 기본 기능을 제공하기 위해 필요한 쿠키</li>
              <li><strong>분석 쿠키</strong>: 방문자 통계 수집을 위한 Google Analytics 쿠키</li>
              <li><strong>광고 쿠키</strong>: 맞춤형 광고 제공을 위한 Google AdSense 쿠키</li>
            </ul>
            <p>브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다. 단, 쿠키를 차단하면 일부 기능이 제한될 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Google AdSense 광고</h2>
            <p className="mb-2">
              본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를 사용하여
              사용자의 이전 방문 기록 및 관심사를 기반으로 맞춤형 광고를 제공합니다.
            </p>
            <p className="mb-2">
              Google의 광고 쿠키 사용 방식에 대한 자세한 내용은{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                Google 광고 정책
              </a>
              에서 확인하실 수 있습니다.
            </p>
            <p>
              맞춤형 광고를 원하지 않으시는 경우{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                Google 광고 설정
              </a>
              에서 개인화 광고를 비활성화하거나,{' '}
              <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                NAI 옵트아웃 페이지
              </a>
              를 통해 관심 기반 광고 수신을 거부할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Google Analytics</h2>
            <p>
              본 서비스는 방문자 통계 분석을 위해 Google Analytics를 사용할 수 있습니다.
              Google Analytics는 익명화된 방문 데이터(페이지 조회수, 체류 시간, 유입 경로 등)를
              수집합니다. 수집된 데이터는 개인을 식별하는 데 사용되지 않으며, Google의{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">
                개인정보 처리방침
              </a>
              에 따라 처리됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. 제3자 서비스</h2>
            <p className="mb-2">본 서비스는 다음의 제3자 서비스를 사용합니다.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Google AdSense</strong> — 광고 게재 (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">Google 개인정보처리방침</a>)</li>
              <li><strong>쿠팡 파트너스</strong> — 제휴 마케팅 광고 게재</li>
              <li><strong>Google Fonts</strong> — 웹 폰트 로딩</li>
              <li><strong>Vercel</strong> — 웹사이트 호스팅</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. 개인정보 처리방침 변경</h2>
            <p>
              본 개인정보 처리방침은 법령·서비스 변경에 따라 수정될 수 있습니다. 변경 시 본
              페이지에 공지하며, 최종 수정일을 업데이트합니다. 중요한 변경이 있을 경우 별도로
              안내할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. 문의</h2>
            <p>
              개인정보 처리방침과 관련된 문의는{' '}
              <a href="mailto:andn1026@gmail.com" className="text-gray-900 hover:underline">
                andn1026@gmail.com
              </a>
              으로 연락해 주세요.
            </p>
          </section>

          <p className="text-xs text-gray-400">최종 수정일: 2026년 3월 9일</p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
