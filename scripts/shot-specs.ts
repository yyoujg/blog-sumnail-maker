export type ShotAction =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string };

export type ShotSpec = {
  id: string;
  path: '/' | '/skin-maker';
  actions: ShotAction[];
  selector: string;
  viewport: { width: number; height: number };
};

const DESKTOP = { width: 1200, height: 900 };
const SKIN_EDITOR = 'div.lg\\:flex-row:has(h3:has-text("미리보기"))';
const SKIN_PREVIEW = 'div.bg-white:has(> h3:has-text("미리보기"))';

export const shotSpecs: ShotSpec[] = [
  {
    id: 'thumb-default',
    path: '/',
    actions: [],
    selector: 'section#tool',
    viewport: DESKTOP,
  },
  {
    id: 'thumb-preset',
    path: '/',
    actions: [{ type: 'click', selector: '#tool button:has-text("골드")' }],
    selector: '[data-testid="thumb-preview"]',
    viewport: DESKTOP,
  },
  {
    id: 'thumb-custom-text',
    path: '/',
    actions: [
      { type: 'click', selector: '#tool button:has-text("임팩트")' },
      { type: 'fill', selector: '[placeholder="포스팅 제목을 입력하세요"]', value: '제목은\n두 줄 안에' },
      { type: 'fill', selector: 'input[placeholder="보충 설명을 입력하세요"]', value: '서브카피로 내용 보충' },
    ],
    selector: '[data-testid="thumb-preview"]',
    viewport: DESKTOP,
  },
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
