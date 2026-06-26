import Link from 'next/link';

const FAQ_ITEMS = [
  {
    question: 'BlogKit은 어떤 콘텐츠를 제공하나요?',
    answer:
      '네이버 블로그 CTR, 검색 노출, 키워드·제목 구조, 썸네일 문구, 글쓰기·수익화·체험단 등을 다루는 가이드 허브입니다. 80편 이상의 글을 카테고리별로 읽을 수 있고, 홈의 무료 썸네일·스킨 도구로 가이드 내용을 바로 실습할 수 있습니다.',
  },
  {
    question: '네이버 블로그 썸네일 권장 사이즈는 몇 px인가요?',
    answer:
      '포스팅 대표 이미지는 1:1 비율, 800×800px을 권장합니다. 모바일 목록에서 잘리지 않고 텍스트가 선명하게 보이려면 고화질(2×) 저장도 함께 쓰면 좋습니다. 자세한 기준은 블로그 가이드 글에서 정리해 두었습니다.',
  },
  {
    question: '썸네일 만들기 도구는 무료인가요?',
    answer:
      '네, 가이드를 실습하는 보조 무료 도구입니다. 회원가입 없이 제목·배경·프레임을 맞춘 뒤 PNG 또는 JPG로 저장할 수 있으며, 배경 사진은 서버로 전송되지 않습니다.',
  },
  {
    question: '직접 찍은 사진을 배경으로 쓸 수 있나요?',
    answer:
      '가능합니다. 기기에서 사진을 선택하면 미리보기 배경으로 적용됩니다. 맛집·카페·여행 등 직접 촬영한 사진 위에 짧은 키워드 문구를 올리는 방식이 가장 자연스럽습니다.',
  },
  {
    question: '만든 썸네일을 네이버 블로그에 어떻게 올리나요?',
    answer:
      'PNG 또는 JPG로 저장한 뒤, 네이버 블로그 글쓰기 화면에서 대표 이미지(썸네일)로 업로드하면 됩니다. 1:1 비율로 저장했는지 확인한 다음, 목록에서 잘리는지 모바일 미리보기로 한 번 더 점검하는 것을 권장합니다.',
  },
  {
    question: '썸네일만 예쁘면 조회수가 오르나요?',
    answer:
      '썸네일은 목록에서의 첫 클릭을 만드는 역할이 큽니다. 클릭 이후 체류·재방문까지 이어지려면 글 본문 구조, 키워드, 사진 수 등 콘텐츠 품질도 함께 맞춰야 합니다. 이 사이트 블로그 가이드에서 썸네일·글쓰기·SEO를 연결해 읽을 수 있습니다.',
  },
  {
    question: '같은 스타일로 여러 글 썸네일을 통일할 수 있나요?',
    answer:
      '프리셋(아웃라인·감성·보더 등)을 고른 뒤 폰트·색·프레임을 유지하고 제목만 바꾸면 됩니다. 블로그 목록에서 브랜드처럼 보이도록 2~3가지 색 조합을 정해 두는 것을 추천합니다.',
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

export default function HomeSeoContent() {
  return (
    <section
      aria-labelledby="home-guide-heading"
      className="px-4 md:px-8 py-10 md:py-14 border-t border-gray-200 bg-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h2 id="home-guide-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            썸네일 전략 실습 가이드
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">STEP 1 — 글 주제와 검색 키워드 정하기</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                썸네일 문구는 글 제목보다 짧아야 합니다. 맛집·카페·여행 등 니치에 맞는 핵심 키워드 1~2개만
                골라 두세요. 예: &ldquo;성수동 카페&rdquo;, &ldquo;솔직 체험단 후기&rdquo;. 키워드가 정해지면
                아래 도구에서 제목·서브타이틀 입력란에 바로 넣을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">STEP 2 — 배경 사진 또는 색상 선택</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                직접 촬영한 사진을 올리거나, 프리셋에 포함된 예시 배경을 골라 시작할 수 있습니다. 사진 위에
                글자를 올릴 때는 오버레이(어두운 반투명 레이어)를 20~40% 정도 주면 모바일 목록에서도 글자가
                잘 읽힙니다.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">STEP 3 — 프레임·폰트·카테고리 맞추기</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                아웃라인·감성·보더 등 스타일 프리셋을 고른 뒤, 카테고리 레이블(맛집·카페·체험단 등)을 한
                개만 넣어 정보 밀도를 높이세요. 블로그 전체 톤에 맞는 폰트·색을 20개 글 이상 유지하면 목록
                화면에서 통일감이 생깁니다.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">STEP 4 — PNG 저장 후 네이버에 업로드</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                텍스트가 들어간 썸네일은 PNG, 사진만 있는 경우는 JPG도 가능합니다. 고화질(2×) 옵션을 켜면
                800px급으로 저장되어 흐릿함을 줄일 수 있습니다. 저장 후 네이버 블로그 글쓰기에서 대표
                이미지로 등록하세요.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            더 자세한 설명은{' '}
            <Link href="/blog/how-to-make-blog-thumbnail" className="font-semibold text-gray-900 underline underline-offset-2">
              썸네일 완전 가이드
            </Link>
            ,{' '}
            <Link href="/blog/blog-keyword-strategy-complete" className="font-semibold text-gray-900 underline underline-offset-2">
              키워드 전략
            </Link>
            ,{' '}
            <Link href="/blog/high-ctr-thumbnail" className="font-semibold text-gray-900 underline underline-offset-2">
              CTR 썸네일 문구
            </Link>
            에서 이어서 읽을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            썸네일이 조회수·클릭률에 미치는 영향
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            네이버 블로그 검색·이웃 피드·추천 목록에서 사용자는 글 제목과 대표 이미지를 동시에 봅니다. 같은
            키워드라도 썸네일에 핵심이 한눈에 들어오면 클릭이 먼저 일어나고, 클릭이 없으면 본문이 아무리
            좋아도 노출 효과를 확인하기 어렵습니다.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            썸네일은 &ldquo;예쁜 그림&rdquo;이 아니라 글의 약속을 한 줄로 전달하는 장치에 가깝습니다. 지명·메뉴·
            상황·신뢰 키워드(솔직 후기, 가격, 웨이팅) 중 하나를 분명히 박아 두면, 단순 감상글과 구분됩니다.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            도구로 빠르게 통일된 썸네일을 만들고,{' '}
            <Link href="/blog" className="font-semibold text-gray-900 underline underline-offset-2">
              블로그 가이드
            </Link>
            와{' '}
            <Link href="/guide/blog-seo" className="font-semibold text-gray-900 underline underline-offset-2">
              검색 노출 기초
            </Link>
            로 글 구조까지 맞추는 흐름을 추천합니다. 실전 운영 팁은{' '}
            <Link href="/blog/naver-blog-increase-visitors" className="font-semibold text-gray-900 underline underline-offset-2">
              키워드·제목·효율화 총정리
            </Link>
            글에서 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
