export const PAGE_TITLE = '네이버 블로그 썸네일 메이커 - 무료 1분 완성';

export const META_TAGS = [
  {
    name: 'description',
    content:
      '네이버 블로그 포스팅에 최적화된 1:1 비율 썸네일을 무료로 쉽고 빠르게 만들어보세요. 가독성 높은 텍스트, 배경 이미지, 다양한 폰트 지원.',
  },
  {
    name: 'keywords',
    content:
      '블로그 썸네일, 네이버 블로그, 썸네일 만들기, 썸네일 메이커, 무료 썸네일, 블로그 꾸미기',
  },
  { property: 'og:title', content: '네이버 블로그 썸네일 메이커 - 무료 1분 완성' },
  {
    property: 'og:description',
    content:
      '프로그램 설치 없이 웹에서 바로 만드는 깔끔한 블로그 썸네일 이미지',
  },
  { property: 'og:type', content: 'website' },
] as const;

export const ADSENSE_CLIENT = 'ca-pub-3008434788043586';
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
export const ADSENSE_AD_SLOT = '';

export const FONT_LINK_HREF =
  'https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@400;700;900&display=swap';

export const HTML2CANVAS_SCRIPT_SRC =
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

export const FONTS = [
  { name: '노토 산스 (고딕)', value: `'Noto Sans KR', sans-serif` },
  { name: '나눔 고딕', value: `'Nanum Gothic', sans-serif` },
  { name: '나눔 명조', value: `'Nanum Myeongjo', serif` },
  { name: '배달의민족 주아', value: `'Jua', sans-serif` },
] as const;
