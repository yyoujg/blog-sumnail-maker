import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: '네이버 블로그 썸네일 메이커 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-900 hover:underline text-sm mb-6 inline-block">
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">이용약관</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 네이버 블로그 썸네일 메이커(이하 "서비스")의 이용 조건 및 절차, 기타 필요한 사항을
              규정함을 목적으로 합니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">제2조 (서비스 이용)</h2>
            <p>
              본 서비스는 누구나 무료로 이용할 수 있습니다. 서비스를 이용함으로써 본 약관에 동의한 것으로
              간주합니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">제3조 (저작권)</h2>
            <p>
              사용자가 생성한 썸네일 이미지의 저작권은 사용자 본인에게 있습니다. 단, 사용자가 업로드한
              이미지에 대한 저작권은 원저작자에게 있으며, 저작권법을 준수하여 사용하셔야 합니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">제4조 (면책)</h2>
            <p>
              본 서비스는 무료로 제공되며, 서비스 이용 중 발생한 손해에 대해 운영자는 책임을 지지 않습니다.
              서비스는 사전 공지 없이 변경 또는 중단될 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">제5조 (문의)</h2>
            <p>
              이용약관과 관련된 문의는{' '}
              <a href="mailto:andn1026@gmail.com" className="text-gray-900 hover:underline">
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
