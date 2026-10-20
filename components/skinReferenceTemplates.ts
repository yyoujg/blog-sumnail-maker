import type { BlogTemplate } from './SkinMakerTool';

const svg = (body: string, w: number, h: number) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}`;
const paper = (color: string, accent?: string) => svg(`
  <defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/></filter>
  <linearGradient id="wash" x2="0" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${accent || color}"/></linearGradient></defs>
  <rect width="3000" height="900" fill="url(#wash)"/><rect width="3000" height="900" filter="url(#grain)" opacity=".075"/>`, 3000, 900);
const circle = svg('<circle cx="45" cy="45" r="43" fill="none" stroke="#181818" stroke-width="1.5"/>', 90, 90);
const pill = (w: number, h: number, color = '#fff') => svg(`<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${h / 2}" fill="${color}"/>`, w, h);
const search = svg('<rect x="1" y="1" width="758" height="64" rx="32" fill="#fff"/><circle cx="38" cy="30" r="10" fill="none" stroke="#b2b2ad" stroke-width="2"/><path d="m46 38 10 10" stroke="#b2b2ad" stroke-width="2"/><path d="M716 23v16m-7-9v4a7 7 0 0 0 14 0v-4m-7 11v7m-6 0h12" fill="none" stroke="#aaa" stroke-width="2"/>', 760, 66);
const arrow = svg('<path d="M4 4 34 17 22 22 17 35Z" fill="#77746e" stroke="#f8f1e9" stroke-width="1.5"/>', 40, 42);
const curve = svg('<path d="M5 3c52 5 61 38 32 66m0 0 2-19m-2 19 19-4" fill="none" stroke="#30302a" stroke-width="2" stroke-linecap="round"/>', 80, 80);
const P = "'Pretendard', sans-serif";
const G = "'GmarketSans', sans-serif";
const B = "'Bodoni 72', 'Times New Roman', Times, serif";
const S = "'Dancing Script', cursive";
const menus = (labels: string[], color: string, bg = '#ffffff', size = 28): BlogTemplate['rects'] =>
  labels.map((label, i) => ({ id: 101 + i, x: 1055 + i * 180, y: 600, w: 170, h: 150, url: '', label, labelFontSize: size, labelFontWeight: 600, labelPadX: 8, labelPadY: 12, labelColor: color, labelBg: bg, labelPillW: 164, borderColor: '' }));

export const REFERENCE_SKIN_TEMPLATES: BlogTemplate[] = [
  {
    id: 'reference-daily', label: '일상', emoji: '',
    desc: '카페 사진과 둥근 사진 카드 · 첨부 일상 디자인 참고',
    previewImage: '/images/skin-templates/reference-daily-preview-sides.png',
    labelFont: P, fontSource: { name: '프리텐다드', url: 'https://noonnu.cc/font_page/694' },
    fontNote: '제목 500·600 / 본문 400. 굵은 본문으로 대체되지 않도록 실제 굵기별 글꼴을 사용합니다.',
    bg: '#33372f', bgImage: '/images/skin-templates/ref-photo-cafe.jpg', bgOverlay: 42,
    cw: 3000, ch: 900,
    elements: [
      { id: 10, type: 'image', src: '/images/skin-templates/ref-photo-toast.jpg', x: 360, y: 100, w: 720, h: 540, radius: 28, borderColor: '#ffffff', borderWidth: 3 },
      { id: 11, type: 'image', src: '/images/skin-templates/ref-photo-cafe.jpg', x: 2020, y: 140, w: 620, h: 520, radius: 28, borderColor: '#ffffff', borderWidth: 3 },
      { id: 12, type: 'image', src: pill(130, 34), x: 900, y: 132, w: 130, h: 34 },
      { id: 1, type: 'text', text: '좋아하는 순간', x: 1215, y: 205, fontSize: 52, letterSpacing: -1.5, color: '#ffffff', fontWeight: '500', fontFamily: P },
      { id: 2, type: 'text', text: '차곡차곡', x: 1215, y: 273, fontSize: 64, letterSpacing: -2, color: '#ffffff', fontWeight: '600', fontFamily: P },
      { id: 3, type: 'text', text: '커피 한 잔과 작은 일상의 기록', x: 1220, y: 375, fontSize: 26, letterSpacing: -.5, color: '#ffffff', fontWeight: '400', fontFamily: P },
      { id: 4, type: 'text', text: '오늘의 한 장', x: 915, y: 141, fontSize: 16, color: '#3b3a32', fontWeight: '400', fontFamily: P },
    ],
    rects: menus(['일상 기록', '카페 산책', '좋아하는 것', '공간 수집', '사진첩'], '#353a30'),
  },
  {
    id: 'reference-living', label: '리빙', emoji: '',
    desc: '크림색 매거진과 하우스형 사진 · 첨부 리빙 디자인 참고',
    previewImage: '/images/skin-templates/reference-living-preview-sides.png',
    labelFont: P, fontSource: { name: '지마켓 산스', url: 'https://noonnu.cc/font_page/366' },
    fontNote: '한글 제목: 지마켓 산스 굵게 / 파란 영문: 댄싱 스크립트 400 / 본문: 프리텐다드 400.',
    bg: '#faf0d9', cw: 3000, ch: 900,
    elements: [
      { id: 30, type: 'image', src: '/images/skin-templates/ref-side-living-window.jpg', x: 120, y: 80, w: 680, h: 720, radius: 330, borderColor: '#fffaf0', borderWidth: 12 },
      { id: 10, type: 'image', src: '/images/skin-templates/ref-photo-bedroom.jpg', x: 1730, y: 40, w: 920, h: 690, clipShape: 'house' },
      { id: 1, type: 'text', text: '집이 좋아지는', x: 970, y: 140, fontSize: 83, letterSpacing: -3.2, color: '#151515', fontWeight: '700', fontFamily: G },
      { id: 2, type: 'text', text: '작은 취향들', x: 970, y: 245, fontSize: 93, letterSpacing: -3.6, color: '#151515', fontWeight: '700', fontFamily: G },
      { id: 3, type: 'text', text: 'Life', x: 1390, y: 108, fontSize: 160, color: '#62acd4', fontWeight: '400', fontFamily: S },
      { id: 11, type: 'image', src: circle, x: 990, y: 405, w: 90, h: 90 },
      { id: 4, type: 'text', text: '리빙', x: 1012, y: 427, fontSize: 20, color: '#181818', fontWeight: '700', fontFamily: P },
      { id: 5, type: 'text', text: '노트', x: 1012, y: 455, fontSize: 20, color: '#181818', fontWeight: '700', fontFamily: P },
      { id: 6, type: 'text', text: '공간을 채우는 나만의 방식', x: 1100, y: 425, fontSize: 25, color: '#62acd4', fontWeight: '700', fontFamily: P },
      { id: 7, type: 'text', text: '소품 · 인테리어 · 살림', x: 1100, y: 468, fontSize: 18, color: '#35352e', fontWeight: '400', fontFamily: P },
    ],
    rects: menus(['우리 집', '공간 꾸미기', '소품 기록', '살림 노트', '리빙 리뷰'], '#292a24', '#fffaf0'),
  },
  {
    id: 'reference-beauty', label: '뷰티', emoji: '',
    desc: '피치색 종이 질감과 명조 글꼴 · 첨부 뷰티 디자인 참고',
    previewImage: '/images/skin-templates/reference-beauty-preview-sides.png',
    labelFont: P, fontSource: { name: '프리텐다드', url: 'https://noonnu.cc/font_page/694' },
    fontNote: '영문 제목: 보도니 72 기울임(기본 설치 글꼴, 없으면 타임스체) / 한글: 프리텐다드.',
    bg: '#f5dfd8', bgImage: paper('#faf0e9', '#eebcb6'), cw: 3000, ch: 900,
    elements: [
      { id: 10, type: 'image', src: '/images/skin-templates/ref-photo-beauty-1.jpg', x: 380, y: 100, w: 740, h: 580, radius: 28 },
      { id: 11, type: 'image', src: '/images/skin-templates/ref-photo-beauty-2.jpg', x: 2070, y: 100, w: 600, h: 600, radius: 28 },
      { id: 1, type: 'text', text: 'BEAUTY NOTE', x: 1410, y: 125, fontSize: 27, letterSpacing: -.4, color: '#48423e', fontWeight: '700', fontStyle: 'italic', fontFamily: 'Arial, sans-serif' },
      { id: 2, type: 'text', text: 'Daily Beauty', x: 1400, y: 195, fontSize: 66, letterSpacing: -.8, color: '#4d4742', fontWeight: '400', fontStyle: 'italic', fontFamily: B },
      { id: 3, type: 'text', text: '오늘의 색과 빛', x: 1410, y: 303, fontSize: 22, letterSpacing: -.4, color: '#756a61', fontWeight: '400', fontFamily: P },
      { id: 12, type: 'image', src: pill(410, 52), x: 1410, y: 377, w: 410, h: 52 },
      { id: 4, type: 'text', text: '마음에 드는 컬러를 모아요', x: 1438, y: 394, fontSize: 18, letterSpacing: -.3, color: '#71675f', fontWeight: '400', fontFamily: P },
      { id: 13, type: 'image', src: arrow, x: 1795, y: 415, w: 40, h: 42 },
      ...['#f9edda', '#d6847c', '#e5b599', '#fffdfa', '#efd0ca'].map((color, i) => ({ id: 20 + i, type: 'image' as const, src: svg(`<rect width="42" height="42" fill="${color}"/>`, 42, 42), x: 1460 + i * 55, y: 480, w: 42, h: 42 })),
    ],
    rects: menus(['메이크업', '스킨케어', '컬러 기록', '뷰티 리뷰', '데일리 룩'], '#6c5149', '#fff9f4'),
  },
  {
    id: 'reference-travel', label: '여행', emoji: '',
    desc: '종이 위 사진 조각과 손글씨 · 첨부 여행 디자인 참고',
    previewImage: '/images/skin-templates/reference-travel-preview-sides.png',
    labelFont: P, fontSource: { name: '프리텐다드', url: 'https://noonnu.cc/font_page/694' },
    fontNote: '영문 장식: 댄싱 스크립트 400 연결 필기체 / 한글 본문: 프리텐다드 400. 한글을 영문 필기체로 대체하지 않습니다.',
    bg: '#edeae3', bgImage: paper('#efede7'), cw: 3000, ch: 900,
    elements: [
      { id: 10, type: 'image', src: '/images/skin-templates/ref-photo-travel-1.jpg', x: 360, y: 80, w: 710, h: 410, rotation: -4, borderColor: '#f9f7f1', borderWidth: 8 },
      { id: 11, type: 'image', src: '/images/skin-templates/ref-photo-travel-2.jpg', x: 1980, y: 80, w: 680, h: 420, rotation: 3, borderColor: '#f9f7f1', borderWidth: 8 },
      { id: 12, type: 'image', src: '/images/skin-templates/ref-photo-toast.jpg', x: 790, y: 405, w: 500, h: 255, rotation: -3, borderColor: '#faf8f2', borderWidth: 8 },
      { id: 13, type: 'image', src: '/images/skin-templates/ref-photo-travel-detail.jpg', x: 1770, y: 420, w: 550, h: 250, rotation: 3, borderColor: '#faf8f2', borderWidth: 8 },
      { id: 1, type: 'text', text: 'little', x: 1500, align: 'center', y: 98, fontSize: 64, color: '#242621', fontWeight: '400', fontFamily: S },
      { id: 2, type: 'text', text: 'travel notes', x: 1500, align: 'center', y: 166, fontSize: 64, color: '#474a42', fontWeight: '400', fontFamily: S },
      { id: 3, type: 'text', text: '마음이 머문 곳을 기록해요', x: 1500, align: 'center', y: 255, fontSize: 20, letterSpacing: -.5, color: '#474a42', fontWeight: '400', fontFamily: P },
      { id: 14, type: 'image', src: search, x: 1120, y: 332, w: 760, h: 66 },
      { id: 4, type: 'text', text: '다음 여행의 장면을 찾아서', x: 1202, y: 354, fontSize: 21, color: '#626660', fontWeight: '400', fontFamily: P },
      { id: 15, type: 'image', src: curve, x: 2610, y: 500, w: 84, h: 84 },
      { id: 5, type: 'text', text: 'collecting moments', x: 1395, y: 532, fontSize: 30, color: '#34382e', fontWeight: '400', fontFamily: S },
    ],
    rects: menus(['여행 노트', '국내 여행', '여행 사진', '맛있는 순간', '준비 기록'], '#464a3f', '#fffefa'),
  },
];
