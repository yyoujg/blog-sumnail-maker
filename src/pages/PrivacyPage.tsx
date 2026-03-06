import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-indigo-600 hover:underline text-sm mb-6 inline-block">
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보 처리방침</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. 수집하는 개인정보</h2>
            <p>
              본 서비스(네이버 블로그 썸네일 메이커)는 사용자로부터 별도의 개인정보를 수집하지 않습니다.
              업로드된 이미지는 브라우저 내에서만 처리되며 서버로 전송되지 않습니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. 쿠키 및 광고</h2>
            <p>
              본 서비스는 Google AdSense를 통해 광고를 표시합니다. Google은 쿠키를 사용하여 사용자의 관심사에
              맞는 광고를 제공할 수 있습니다. Google의 개인정보 처리방침은{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                이곳
              </a>
              에서 확인하실 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. 제3자 서비스</h2>
            <p>
              본 서비스는 Google Analytics 등 제3자 분석 도구를 사용할 수 있으며, 이 경우 익명화된 이용
              통계가 수집될 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. 문의</h2>
            <p>
              개인정보 처리방침과 관련된 문의는{' '}
              <a href="mailto:andn1026@gmail.com" className="text-indigo-600 hover:underline">
                andn1026@gmail.com
              </a>
              으로 연락해 주세요.
            </p>
          </section>
          <p className="text-xs text-gray-400">최종 수정일: {new Date().getFullYear()}년 3월 6일</p>
        </div>
      </div>
    </div>
  );
}
