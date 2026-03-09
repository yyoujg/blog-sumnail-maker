const PRODUCTS = [
  {
    name: 'KL-149B 미니 LED 라이트',
    desc: '블로그 사진 찍을 때 이런 작은 LED 조명 많이 씁니다.',
    src: 'https://coupa.ng/clQwOg',
  },
  {
    name: '주닉스 LED 링 라이트',
    desc: '블로그 촬영할 때 많이 쓰는 링라이트입니다.',
    src: 'https://coupa.ng/clQwQw',
  },
  {
    name: '셀루미 스마트폰 삼각대',
    desc: '블로그 사진 찍을 때 삼각대 하나 있으면 편합니다.',
    src: 'https://coupa.ng/clQwSN',
  },
  {
    name: '스위스윙거 휴대폰 거치대',
    desc: '블로그 글 쓸 때 휴대폰 거치대 있으면 편합니다.',
    src: 'https://coupa.ng/clQwWz',
  },
  {
    name: '라이프썸 블루투스 키보드',
    desc: '태블릿으로 블로그 쓰는 분들은 이런 키보드 많이 씁니다.',
    src: 'https://coupa.ng/clQwZb',
  },
  {
    name: '360도 회전 태블릿 거치대',
    desc: '태블릿으로 블로그 작성할 때 거치대 있으면 편합니다.',
    src: 'https://coupa.ng/clQw2Z',
  },
  {
    name: 'NICESUN 미니 무선 핀마이크',
    desc: '영상 촬영하는 블로거 분들은 이런 마이크 많이 사용합니다.',
    src: 'https://coupa.ng/clQw4r',
  },
  {
    name: '모노픽 접이식 노트북 거치대',
    desc: '블로그 오래 쓰면 이런 노트북 거치대가 편합니다.',
    src: 'https://coupa.ng/clQw59',
  },
];

export default function CoupangRecommendations() {
  return (
    <div className="w-full my-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">블로거 추천 장비</p>
      <h2 className="text-base font-bold text-gray-800 mb-4">블로그 운영할 때 이런 장비 많이 씁니다</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {PRODUCTS.map((p) => (
          <div key={p.src} className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow">
            <iframe
              src={p.src}
              width="120"
              height="240"
              frameBorder="0"
              scrolling="no"
              referrerPolicy="unsafe-url"
              title={p.name}
            />
            <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-300 mt-3">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
