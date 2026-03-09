const PRODUCTS = [
  {
    tag: '조명',
    name: 'KL-149B 미니 LED 라이트',
    desc: '블로그 사진 찍을 때 이런 작은 LED 조명 많이 씁니다.',
    url: 'https://coupa.ng/clQwOg',
  },
  {
    tag: '조명',
    name: '주닉스 LED 링 라이트',
    desc: '블로그 촬영할 때 많이 쓰는 링라이트입니다.',
    url: 'https://coupa.ng/clQwQw',
  },
  {
    tag: '촬영',
    name: '셀루미 스마트폰 삼각대',
    desc: '블로그 사진 찍을 때 삼각대 하나 있으면 편합니다.',
    url: 'https://coupa.ng/clQwSN',
  },
  {
    tag: '작업',
    name: '스위스윙거 휴대폰 거치대',
    desc: '블로그 글 쓸 때 휴대폰 거치대 있으면 편합니다.',
    url: 'https://coupa.ng/clQwWz',
  },
  {
    tag: '작업',
    name: '라이프썸 블루투스 키보드',
    desc: '태블릿으로 블로그 쓰는 분들은 이런 키보드 많이 씁니다.',
    url: 'https://coupa.ng/clQwZb',
  },
  {
    tag: '작업',
    name: '360도 회전 태블릿 거치대',
    desc: '태블릿으로 블로그 작성할 때 거치대 있으면 편합니다.',
    url: 'https://coupa.ng/clQw2Z',
  },
  {
    tag: '영상',
    name: 'NICESUN 미니 무선 핀마이크',
    desc: '영상 촬영하는 블로거 분들은 이런 마이크 많이 사용합니다.',
    url: 'https://coupa.ng/clQw4r',
  },
  {
    tag: '작업',
    name: '모노픽 접이식 노트북 거치대',
    desc: '블로그 오래 쓰면 이런 노트북 거치대가 편합니다.',
    url: 'https://coupa.ng/clQw59',
  },
];

const TAG_COLOR: Record<string, string> = {
  조명: 'bg-yellow-100 text-yellow-700',
  촬영: 'bg-blue-100 text-blue-700',
  작업: 'bg-gray-100 text-gray-600',
  영상: 'bg-purple-100 text-purple-700',
};

export default function CoupangRecommendations() {
  return (
    <div className="w-full my-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">블로거 추천 장비</p>
      <h2 className="text-base font-bold text-gray-800 mb-4">블로그 운영할 때 이런 장비 많이 씁니다</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRODUCTS.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all group"
          >
            <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLOR[p.tag]}`}>
              {p.tag}
            </span>
            <span className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-gray-900 line-clamp-2">
              {p.name}
            </span>
            <span className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
              {p.desc}
            </span>
            <span className="text-xs text-gray-400 mt-1">쿠팡에서 가격 보기 →</span>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-300 mt-3">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
