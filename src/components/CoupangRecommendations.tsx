const PRODUCTS = [
  {
    name: 'KL-149B 미니 LED 라이트',
    desc: '자연광이 없는 실내에서 찍어도 사진이 훨씬 밝고 선명해져요. 작고 가벼워서 책상 위에 두고 쓰기 딱 좋습니다.',
    src: 'https://coupa.ng/clQwOg',
  },
  {
    name: '셀루미 스마트폰 삼각대',
    desc: '손떨림 없이 고정된 앵글로 찍으면 사진 퀄리티가 확 달라집니다. 가볍고 접히기까지 해서 외출 촬영에도 유용해요.',
    src: 'https://coupa.ng/clQwSN',
  },
  {
    name: '스위스윙거 휴대폰 거치대',
    desc: '블로그 작성하면서 레퍼런스 볼 때, 촬영할 때 모두 활용돼요. 접이식이라 사용하지 않을 때 보관도 간편합니다.',
    src: 'https://coupa.ng/clQwWz',
  },
  {
    name: '라이프썸 블루투스 키보드',
    desc: '태블릿에 키보드 하나 연결하면 포스팅 속도가 완전히 달라져요. 3대 멀티 페어링이라 기기 바꿔가며 쓰기도 편합니다.',
    src: 'https://coupa.ng/clQwZb',
  },
];

export default function CoupangRecommendations() {
  return (
    <div className="w-full my-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">블로거 추천 장비</p>
      <h2 className="text-base font-bold text-gray-800 mb-4">블로그 운영할 때 이런 장비 많이 씁니다</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRODUCTS.map((p) => (
          <div key={p.src} className="flex flex-col items-center gap-2 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow overflow-hidden">
            <p className="w-full text-xs font-semibold text-gray-800 leading-snug">{p.name}</p>
            <div className="w-full overflow-x-auto flex justify-center">
              <iframe
                src={p.src}
                width="300"
                height="250"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
                title={p.name}
              />
            </div>
            <p className="w-full text-xs text-gray-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-300 mt-3">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
