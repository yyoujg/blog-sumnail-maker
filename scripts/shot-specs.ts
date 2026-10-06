export type ShotAction =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'upload'; selector: string; file: string };

export type ShotSpec = {
  id: string;
  path: '/' | '/skin-maker';
  actions: ShotAction[];
  selector: string;
  viewport: { width: number; height: number };
};

const DESKTOP = { width: 1200, height: 900 };
const SKIN_EDITOR = 'div.lg\\:flex-row:has(h3:has-text("미리보기"))';
// 배경은 프리셋 기본 사진(매장 사진) 대신 직접 찍은 공공장소 풍경으로 교체한다. EXIF 제거본.
const uploadBg = (file: string): ShotAction[] => [
  { type: 'click', selector: '#tool button:has-text("배경")' },
  { type: 'upload', selector: '#tool input[type="file"]', file: `scripts/shot-assets/${file}` },
];
const OVERLAY_SLIDER = '#tool div:has(> label:has-text("어두운 필터")) input[type="range"]';
const TEXT_TAB: ShotAction = { type: 'click', selector: '#tool button:has-text("텍스트")' };
const SKIN_PREVIEW = 'div.bg-white:has(> h3:has-text("미리보기"))';

export const shotSpecs: ShotSpec[] = [
  {
    id: 'thumb-default',
    path: '/',
    actions: [
      ...uploadBg('bg-andong-woryeonggyo-night.jpg'),
      TEXT_TAB,
      { type: 'fill', selector: '[placeholder="포스팅 제목을 입력하세요"]', value: '안동 월영교\n여름밤 산책' },
      { type: 'fill', selector: 'input[placeholder="보충 설명을 입력하세요"]', value: '월영정까지 걸어본 20분' },
    ],
    selector: 'section#tool',
    viewport: DESKTOP,
  },
  {
    id: 'thumb-preset',
    path: '/',
    actions: [
      { type: 'click', selector: '#tool button:has-text("골드")' },
      ...uploadBg('bg-nodeul-sunset.jpg'),
    ],
    selector: '[data-testid="thumb-preview"]',
    viewport: DESKTOP,
  },
  {
    id: 'thumb-custom-text',
    path: '/',
    actions: [
      { type: 'click', selector: '#tool button:has-text("임팩트")' },
      ...uploadBg('bg-yeouido-hangang-day.jpg'),
      TEXT_TAB,
      { type: 'fill', selector: '[placeholder="포스팅 제목을 입력하세요"]', value: '제목은\n두 줄 안에' },
      { type: 'fill', selector: 'input[placeholder="보충 설명을 입력하세요"]', value: '서브카피로 내용 보충' },
    ],
    selector: '[data-testid="thumb-preview"]',
    viewport: DESKTOP,
  },
  {
    // high-ctr-thumbnail "패턴 1 숫자 + 리스트"의 본문 예시 문구
    id: 'thumb-pattern-number',
    path: '/',
    actions: [
      { type: 'click', selector: '#tool button:has-text("골드")' },
      ...uploadBg('bg-nodeul-sunset.jpg'),
      TEXT_TAB,
      { type: 'fill', selector: '[placeholder="예: 맛집 탐방, IT 리뷰"]', value: '수익화' },
      { type: 'fill', selector: '[placeholder="포스팅 제목을 입력하세요"]', value: '블로그 수익화\n방법 5가지' },
      { type: 'fill', selector: 'input[placeholder="보충 설명을 입력하세요"]', value: '' },
    ],
    selector: '[data-testid="thumb-preview"]',
    viewport: DESKTOP,
  },
  ...(['0', '50'] as const).map((v): ShotSpec => ({
    // 같은 밝은 배경에서 어두운 필터 값만 바꾼 비교 컷
    id: `thumb-overlay-${v}`,
    path: '/',
    actions: [
      { type: 'click', selector: '#tool button:has-text("골드")' },
      ...uploadBg('bg-yeouido-hangang-day.jpg'),
      { type: 'fill', selector: OVERLAY_SLIDER, value: v },
    ],
    selector: '[data-testid="thumb-preview"]',
    viewport: DESKTOP,
  })),
  {
    id: 'skin-editor',
    path: '/skin-maker',
    actions: [],
    selector: SKIN_EDITOR,
    viewport: DESKTOP,
  },
  {
    id: 'skin-widget-grid',
    path: '/skin-maker',
    actions: [
      { type: 'click', selector: 'button:has-text("링크")' },
      { type: 'click', selector: 'button:has-text("5칸 그리드 맞춤")' },
    ],
    selector: SKIN_PREVIEW,
    viewport: DESKTOP,
  },
];
