'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Code,
  Trash2,
  Layout,
  Download,
  Type,
  Image as ImageIcon,
  Sparkles,
  Settings2,
  BookOpen,
  Link as LinkIcon,
  ArrowLeft,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlignHorizontalJustifyCenter,
  Undo2,
  RotateCcw,
} from 'lucide-react';
import { FONTS } from '@/lib/constants';
import { REFERENCE_SKIN_TEMPLATES } from './skinReferenceTemplates';
import { buildWidgets, categoryUrl as catUrl, parseCategoryUrl } from '@/lib/skinWidgets';

// ── Constants ──────────────────────────────────
// 네이버 위젯 등록 화면 고지: "위젯의 크기는 가로 170px, 세로 600px까지 지원합니다."
// 이 값을 넘기면 등록은 되지만 렌더 시 "이미지 정보가 올바르지 않습니다"로 대체된다.
const WIDGET_W = 170;
const WIDGET_GAP = 10;
// 공용 투명위젯 (170×600, 알파 0). 코드가 width/height를 강제하므로 크기 무관하게 재사용됨.
// 사용자는 비공개글 업로드/주소복사 단계를 건너뛴다.
const DEFAULT_WIDGET_URL =
  'https://www.blogsumnail.com/transparent-170x600.png';

const LABEL_Y_RATIO = 0.7; // 라벨 세로 위치 — 미리보기·export 공용 (불일치 방지)

// 템플릿의 bgPosition('center 40%' 등)을 배경 offset(%)로 변환
function posToOffset(pos?: string): { x: number; y: number } {
  const [h = 'center', v = 'center'] = (pos ?? 'center center').split(' ');
  const fx = h === 'left' ? 0 : h === 'right' ? 100 : h.endsWith('%') ? parseFloat(h) : 50;
  const fy = v === 'top' ? 0 : v === 'bottom' ? 100 : v.endsWith('%') ? parseFloat(v) : 50;
  return { x: fx, y: fy };
}

// object-fit:cover와 동일한 소스 크롭 영역 계산 (canvas drawImage용 — 비율 다른 이미지가 늘어나지 않게 중앙 크롭)
function coverSrcRect(natW: number, natH: number, targetW: number, targetH: number) {
  const srcRatio = natW / natH;
  const dstRatio = targetW / targetH;
  let sw = natW;
  let sh = natH;
  if (srcRatio > dstRatio) {
    sw = natH * dstRatio;
  } else {
    sh = natW / dstRatio;
  }
  return { sx: (natW - sw) / 2, sy: (natH - sh) / 2, sw, sh };
}

// CSS line-height: 1의 기준선과 캔버스 출력 기준선을 맞춘다.
function textBaseline(ctx: CanvasRenderingContext2D, y: number, fontSize: number, text: string) {
  const metrics = ctx.measureText(text);
  const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
  return y + (fontSize - ascent - descent) / 2 + ascent;
}

interface TextElement {
  id: number;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number;
  align?: 'left' | 'center';
  strokeColor?: string; // 글씨 테두리색
  strokeWidth?: number;
}

const DEFAULT_FONT = `'Pretendard', sans-serif`;

interface ImageElement {
  id: number;
  type: 'image';
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number; // 모서리 둥글기(px) — w===h && radius===w/2 이면 원형
  borderColor?: string; // 사진 테두리색
  borderWidth?: number;
  rotation?: number;
  clipShape?: 'house';
}

type CanvasElement = TextElement | ImageElement;

interface LinkRect {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  url: string; // newWindow(외부링크)일 때만 직접 사용
  label?: string;
  labelColor?: string;
  labelFontSize?: number;
  labelFontWeight?: number;
  labelPadX?: number;
  labelPadY?: number;
  labelBg?: string; // 라벨 뒤 pill 배경색 (undefined = pill 없이 텍스트만)
  labelBorderColor?: string; // pill 테두리색
  labelY?: number; // 라벨 세로 위치 강제 지정(px) — 없으면 h*LABEL_Y_RATIO 기본값
  labelPillW?: number; // pill 너비 강제 지정(px) — 없으면 텍스트 너비 기준 자동
  bgColor?: string; // undefined = 투명
  borderColor?: string; // undefined = 기본 (#52525b), '' = 테두리 없음
  newWindow?: boolean; // true = 새 창(<a target=_blank>), 그 외 = 현재 창(이미지맵)
  categoryNo?: string; // 내부 카테고리 번호 (newWindow=false일 때 blogId와 조립)
  categoryUrl?: string; // 블로그 카테고리에서 복사한 전체 주소
}

export interface BlogTemplate {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  previewImage?: string;
  labelFont?: string;
  fontSource?: { name: string; url: string };
  fontNote?: string;
  bg: string;
  bgImage?: string;
  bgOverlay?: number;
  bgPosition?: string;
  bgScale?: number;
  bgRotation?: number;
  cw: number;
  ch: number;
  elements: CanvasElement[];
  rects: LinkRect[];
}

// ── Blog Templates ──────────────────────────────
// 원형 아바타/아이콘/배경 블록은 인라인 SVG로 채운다(실사진은 사각 crop만 지원해
// 원 모양·단색 블록이 안 나옴).
const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const circleImg = (d: number, color: string) =>
  svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="${color}"/></svg>`
  );
const solidRect = (w: number, h: number, color: string) =>
  svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${color}"/></svg>`
  );
const COLS = [515, 695, 875, 1055, 1235]; // 위젯 5칸 표준 x좌표 (WIDGET_W=170, gap=10)
const COLS4 = [605, 785, 965, 1145]; // 4칸일 때 캔버스 중앙(960) 기준 정렬

// 캡션은 rect.label(0.7 고정 위치)이 아니라 별도 텍스트 요소로 배치 —
// 히어로 사진+썸네일 줄 구도는 캡션이 더 아래에 와야 함.
const captionRow = (
  startId: number,
  xs: number[],
  labels: string[],
  y: number,
  color: string,
  offset = 50
) =>
  xs.map((x, i) => ({
    id: startId + i,
    type: 'text' as const,
    text: labels[i],
    x: x + offset,
    y,
    fontSize: 13,
    color,
    fontWeight: 'normal' as const,
  }));

const homepageMenus = (labels: string[], color: string): LinkRect[] =>
  labels.map((label, i) => ({
    id: 101 + i, x: 1055 + i * (WIDGET_W + WIDGET_GAP), y: 300,
    w: WIDGET_W, h: 150, url: '', label, labelColor: color,
    labelBg: '#ffffff', labelBorderColor: color, labelPillW: 148,
    borderColor: '',
  }));

const BLOG_TEMPLATES: BlogTemplate[] = [
  ...REFERENCE_SKIN_TEMPLATES,
  {
    id: 'cozy-note', label: '일상 손그림', emoji: '',
    desc: '새로 만든 포근한 기록 배경 · 3000×900',
    labelFont: "'OwnglyphParkDaHyun', cursive",
    fontSource: { name: '온글잎 박다현체', url: 'https://noonnu.cc/font_page/1541' },
    bg: '#fcf7f2', bgImage: '/images/skin-templates/daily-stationery-bg.jpg',
    cw: 3000, ch: 900,
    elements: [
      { id: 10, type: 'image', src: '/images/skin-templates/daily-diary-sticker.png', x: 1080, y: 85, w: 160, h: 160 },
      { id: 11, type: 'image', src: '/images/skin-templates/daily-camera-sticker.png', x: 1760, y: 85, w: 160, h: 160 },
      { id: 1, type: 'text', text: '소소한 하루의 기록', x: 1500, align: 'center', y: 105, fontSize: 72, color: '#594b40', fontWeight: 'normal', fontFamily: "'OwnglyphParkDaHyun', cursive" },
      { id: 2, type: 'text', text: '일상 속 좋아하는 순간을 모아요', x: 1500, align: 'center', y: 190, fontSize: 22, color: '#8b7c6c', fontWeight: 'normal' },
    ],
    rects: homepageMenus(['오늘의 일기', '좋아하는 것', '취미 기록', '나들이', '사진첩'], '#8b7862'),
  },
  {
    id: 'garden-note', label: '원예·재배', emoji: '',
    desc: '새로 만든 초록빛 정원 배경 · 3000×900',
    labelFont: "'Cafe24Surround', sans-serif",
    fontSource: { name: '카페24 써라운드', url: 'https://noonnu.cc/font_page/669' },
    bg: '#fafbea', bgImage: '/images/skin-templates/garden-stationery-bg.jpg',
    cw: 3000, ch: 900,
    elements: [
      { id: 10, type: 'image', src: '/images/skin-templates/garden-pot-sticker.png', x: 1080, y: 85, w: 160, h: 160 },
      { id: 11, type: 'image', src: '/images/skin-templates/garden-seedling-sticker.png', x: 1760, y: 85, w: 160, h: 160 },
      { id: 1, type: 'text', text: '초록이 자라는 시간', x: 1500, align: 'center', y: 115, fontSize: 50, color: '#425d40', fontWeight: 'normal', fontFamily: "'Cafe24Surround', sans-serif" },
      { id: 2, type: 'text', text: '작은 정원에서 천천히 배우는 하루', x: 1500, align: 'center', y: 190, fontSize: 22, color: '#748267', fontWeight: 'normal' },
    ],
    rects: homepageMenus(['식물 일기', '초보 가드닝', '나의 정원', '계절의 꽃', '재배 노트'], '#71815d'),
  },
  {
    // 참고 template-3: 사진 배너(필기체 타이틀) + 사진 4장 + 연락처
    id: 'cozy-home',
    label: '코지홈',
    emoji: '🐾',
    desc: '포근한 일상 기록',
    bg: '#ffffff',
    cw: 1920,
    ch: 450,
    elements: [
      { id: 5, type: 'image', src: '/images/skin-templates/hero-cozy-home.jpg', x: 0, y: 0, w: 1920, h: 280 },
      { id: 1, type: 'text', text: '일상 기록 블로그', x: 1190, y: 108, fontSize: 17, color: '#ffffff', fontWeight: 'normal' },
      { id: 2, type: 'text', text: 'My Daily Life', x: 1140, y: 135, fontSize: 46, color: '#ffffff', fontWeight: 'bold', fontFamily: `'Dancing Script', cursive` },
      { id: 10, type: 'image', src: '/images/skin-templates/cozy-thumb-daily.jpg', x: 430, y: 305, w: 110, h: 110, radius: 10 },
      { id: 11, type: 'image', src: '/images/skin-templates/cozy-thumb-thoughts.jpg', x: 605, y: 305, w: 110, h: 110, radius: 10 },
      { id: 12, type: 'image', src: '/images/skin-templates/cozy-thumb-reading.jpg', x: 780, y: 305, w: 110, h: 110, radius: 10 },
      { id: 13, type: 'image', src: '/images/skin-templates/cozy-thumb-travel.jpg', x: 955, y: 305, w: 110, h: 110, radius: 10 },
      ...captionRow(20, [430, 605, 780, 955], ['일상 기록', '생각 기록', '독서 기록', '여행 기록'], 415, '#555555', 23),
      { id: 30, type: 'text', text: '💬 @reallygreatsite', x: 1150, y: 310, fontSize: 13, color: '#666666', fontWeight: 'normal' },
      { id: 31, type: 'text', text: '📞 +123-456-7890', x: 1150, y: 339, fontSize: 13, color: '#666666', fontWeight: 'normal' },
      { id: 32, type: 'text', text: '✉️ hello@reallygreatsite.com', x: 1150, y: 368, fontSize: 13, color: '#666666', fontWeight: 'normal' },
    ],
    rects: [400, 575, 750, 925].map((x, i) => ({
      id: 101 + i,
      x,
      y: 0,
      w: WIDGET_W,
      h: 450,
      url: 'https://',
      borderColor: '',
    })),
  },
  {
    // 참고 template-7: 아이보리/세이지 투톤 + 원형 아바타 + 흰색 pill 5개
    id: 'daily-log',
    label: '데일리로그',
    emoji: '📔',
    desc: '심플한 데일리 블로그',
    bg: '#b8c4ba',
    cw: 1920,
    ch: 450,
    elements: [
      { id: 4, type: 'image', src: solidRect(1920, 225, '#faf7f2'), x: 0, y: 0, w: 1920, h: 225 },
      { id: 1, type: 'text', text: 'DAILY BLOG', x: 863, y: 48, fontSize: 28, color: '#1a1a1a', fontWeight: 'bold', fontFamily: `'Montserrat', sans-serif` },
      { id: 2, type: 'text', text: '일상의 소소한 조각들로 채워가는 하루', x: 834, y: 88, fontSize: 16, color: '#555555', fontWeight: 'normal' },
      { id: 10, type: 'image', src: '/images/skin-templates/daily-log-circle-3.jpg', x: 860, y: 126, w: 200, h: 200, radius: 100 },
    ],
    rects: COLS.map((x, i) => ({
      id: 101 + i,
      x,
      y: 0,
      w: WIDGET_W,
      h: 450,
      url: 'https://',
      label: ['오늘의 일기', '취미로운 생활', '나의 공간 이야기', '정보게시판', '포토갤러리'][i],
      labelColor: '#4a4a4a',
      labelBg: '#ffffff',
      labelY: 393,
      borderColor: '',
    })),
  },
  {
    // 참고 template-1: 사진 없이 세리프 이탤릭 타이틀 + 사진 4장 (연락처 없음)
    id: 'my-daily-life',
    label: '감성인테리어',
    emoji: '🕯️',
    desc: '감성 인테리어·소품',
    bg: '#f6f4f1',
    bgImage: '/images/skin-templates/my-daily-life-bg.jpg',
    bgOverlay: 0,
    bgPosition: 'center center',
    cw: 1920,
    ch: 450,
    elements: [
      { id: 2, type: 'text', text: '나의 일상 기록 블로그', x: 600, y: 80, fontSize: 14, color: '#6d6159', fontWeight: 'normal' },
      { id: 1, type: 'text', text: 'My Daily Life', x: 600, y: 104, fontSize: 46, color: '#3b2f2f', fontWeight: 'bold', fontFamily: `'Playfair Display', serif` },
      { id: 10, type: 'image', src: '/images/skin-templates/life-thumb-daily.jpg', x: 635, y: 300, w: 110, h: 110, radius: 10, borderColor: '#fff8ef', borderWidth: 4 },
      { id: 11, type: 'image', src: '/images/skin-templates/life-thumb-thoughts.jpg', x: 815, y: 300, w: 110, h: 110, radius: 10, borderColor: '#fff8ef', borderWidth: 4 },
      { id: 12, type: 'image', src: '/images/skin-templates/life-thumb-reading.jpg', x: 995, y: 300, w: 110, h: 110, radius: 10, borderColor: '#fff8ef', borderWidth: 4 },
      { id: 13, type: 'image', src: '/images/skin-templates/life-thumb-travel.jpg', x: 1175, y: 300, w: 110, h: 110, radius: 10, borderColor: '#fff8ef', borderWidth: 4 },
      ...captionRow(20, [635, 815, 995, 1175], ['일상 기록', '생각 기록', '독서 기록', '여행 기록'], 420, '#4a413c', 23),
    ],
    rects: [605, 785, 965, 1145].map((x, i) => ({
      id: 101 + i,
      x,
      y: 0,
      w: WIDGET_W,
      h: 450,
      url: 'https://',
      borderColor: '',
    })),
  },
  {
    // 참고 template-6: 상단 타이틀 + 사진 4장 + ABOUT/PHOTO/BLOG (3개만, 원본 그대로)
    id: 'minimal-life',
    label: '미니멀',
    emoji: '🤍',
    desc: '화이트 미니멀',
    bg: '#f2ede3',
    cw: 1920,
    ch: 450,
    elements: [
      { id: 1, type: 'text', text: 'Minimal Life', x: 849, y: 48, fontSize: 32, color: '#222222', fontWeight: 'bold', fontFamily: `'Montserrat', sans-serif` },
      { id: 2, type: 'text', text: '단순한 삶의 방식을 찾아서 살아가는 이야기', x: 843, y: 95, fontSize: 13, color: '#777777', fontWeight: 'normal' },
      { id: 10, type: 'image', src: '/images/skin-templates/minimal-wide-1.jpg', x: 0, y: 140, w: 765, h: 149 },
      { id: 11, type: 'image', src: '/images/skin-templates/minimal-narrow-1.jpg', x: 780, y: 140, w: 110, h: 149 },
      { id: 12, type: 'image', src: '/images/skin-templates/minimal-narrow-2.jpg', x: 905, y: 140, w: 110, h: 149 },
      { id: 13, type: 'image', src: '/images/skin-templates/minimal-narrow-3.jpg', x: 1030, y: 140, w: 110, h: 149 },
      { id: 14, type: 'image', src: '/images/skin-templates/minimal-wide-5.jpg', x: 1155, y: 140, w: 765, h: 149 },
      { id: 20, type: 'text', text: 'ABOUT', x: 800, y: 310, fontSize: 15, color: '#444444', fontWeight: 'normal', fontFamily: `'Montserrat', sans-serif` },
      { id: 21, type: 'text', text: 'PHOTO', x: 928, y: 310, fontSize: 15, color: '#444444', fontWeight: 'normal', fontFamily: `'Montserrat', sans-serif` },
      { id: 22, type: 'text', text: 'BLOG', x: 1058, y: 310, fontSize: 15, color: '#444444', fontWeight: 'normal', fontFamily: `'Montserrat', sans-serif` },
    ],
    rects: [750, 875, 1000].map((x, i) => ({
      id: 101 + i,
      x,
      y: 0,
      w: WIDGET_W,
      h: 450,
      url: 'https://',
      borderColor: '',
    })),
  },
  {
    // 참고 template-5: 상단 nav + 원형 프로필 + 세로 갤러리 5칸(영문+국문 2줄)
    id: 'fashion-beauty',
    label: '패션뷰티',
    emoji: '💄',
    desc: '패션·뷰티 블로그',
    bg: '#f4f4f4',
    cw: 1920,
    ch: 450,
    elements: [
      { id: 8, type: 'text', text: '←', x: 520, y: 22, fontSize: 22, color: '#222222', fontWeight: 'normal' },
      { id: 9, type: 'text', text: '≡', x: 1380, y: 22, fontSize: 22, color: '#222222', fontWeight: 'normal' },
      { id: 7, type: 'image', src: circleImg(95, '#d8d8d8'), x: 912, y: 58, w: 95, h: 95 },
      { id: 1, type: 'text', text: 'Olivia Wilson', x: 876, y: 165, fontSize: 22, color: '#222222', fontWeight: 'bold', fontFamily: `'Montserrat', sans-serif` },
      { id: 2, type: 'text', text: '올리비아의 패션&뷰티 블로그입니다.', x: 852, y: 198, fontSize: 14, color: '#555555', fontWeight: 'normal' },
      { id: 11, type: 'image', src: '/images/skin-templates/fashion-card-1.jpg', x: COLS[0] + 30, y: 242, w: 110, h: 110, radius: 55 },
      { id: 12, type: 'image', src: '/images/skin-templates/fashion-card-2.jpg', x: COLS[1] + 30, y: 242, w: 110, h: 110, radius: 55 },
      { id: 13, type: 'image', src: '/images/skin-templates/fashion-card-3.jpg', x: COLS[2] + 30, y: 242, w: 110, h: 110, radius: 55 },
      { id: 14, type: 'image', src: '/images/skin-templates/fashion-card-4.jpg', x: COLS[3] + 30, y: 242, w: 110, h: 110, radius: 55 },
      { id: 15, type: 'image', src: '/images/skin-templates/fashion-card-5.jpg', x: COLS[4] + 30, y: 242, w: 110, h: 110, radius: 55 },
      ...COLS.map((x, i) => ({
        id: 40 + i,
        type: 'text' as const,
        text: ['Daily Look', 'Makeup', 'Product Picks', 'Fashion Trends', 'Lifestyle'][i],
        x: x + 30,
        y: 372,
        fontSize: 12,
        color: '#111111',
        fontWeight: 'bold' as const,
        fontFamily: `'Montserrat', sans-serif`,
      })),
      ...COLS.map((x, i) => ({
        id: 50 + i,
        type: 'text' as const,
        text: ['데일리룩', '메이크업', '제품추천', '패션 트렌드', '라이프스타일'][i],
        x: x + 30,
        y: 389,
        fontSize: 10,
        color: '#888888',
        fontWeight: 'normal' as const,
      })),
    ],
    rects: COLS.map((x, i) => ({
      id: 101 + i,
      x,
      y: 0,
      w: WIDGET_W,
      h: 450,
      url: 'https://',
      borderColor: '',
    })),
  },
  {
    // 참고 template-4: Jua 폰트 파스텔 옐로우 + 사진 4장 + 테두리만 있는 pill 버튼
    id: 'baby-diary',
    label: '육아일기',
    emoji: '🍼',
    desc: '육아·아기 기록',
    bg: '#fff9e6',
    cw: 1920,
    ch: 450,
    elements: [
      { id: 1, type: 'text', text: '아기와 함께 하는 일상 기록', x: 870, y: 45, fontSize: 16, color: '#a8b3e8', fontWeight: 'normal', fontFamily: `'Jua', sans-serif` },
      { id: 2, type: 'text', text: '육아 블로그', x: 843, y: 72, fontSize: 50, color: '#b3bcf5', fontWeight: 'bold', fontFamily: `'Jua', sans-serif`, strokeColor: '#ffffff', strokeWidth: 4 },
      { id: 60, type: 'text', text: '✨', x: 620, y: 30, fontSize: 26, color: '#f5e1b8', fontWeight: 'normal' },
      { id: 61, type: 'text', text: '🌈', x: 620, y: 118, fontSize: 22, color: '#f2c744', fontWeight: 'normal' },
      { id: 62, type: 'text', text: '⭐', x: 1260, y: 30, fontSize: 30, color: '#f5e1b8', fontWeight: 'normal' },
      { id: 63, type: 'text', text: '💕', x: 1260, y: 118, fontSize: 22, color: '#f6cdd1', fontWeight: 'normal' },
      { id: 10, type: 'image', src: '/images/skin-templates/baby-card-1.jpg', x: COLS4[0] + 10, y: 170, w: 150, h: 161 },
      { id: 11, type: 'image', src: '/images/skin-templates/baby-card-2.jpg', x: COLS4[1] + 10, y: 170, w: 150, h: 161 },
      { id: 12, type: 'image', src: '/images/skin-templates/baby-card-3.jpg', x: COLS4[2] + 10, y: 170, w: 150, h: 161 },
      { id: 13, type: 'image', src: '/images/skin-templates/baby-card-4.jpg', x: COLS4[3] + 10, y: 170, w: 150, h: 161 },
    ],
    rects: COLS4.map((x, i) => ({
      id: 101 + i,
      x,
      y: 0,
      w: WIDGET_W,
      h: 450,
      url: 'https://',
      label: ['일상', '이유식', '육아용품', '여행'][i],
      labelColor: '#5c4008',
      labelBg: '#f2b705',
      labelBorderColor: '#c99304',
      labelPillW: 96,
      labelY: 355,
      borderColor: '',
    })),
  },
];

const GROWTH_TIPS = [
  { emoji: '📝', label: 'SEO로 방문자 늘리는 법', href: '/blog' },
  { emoji: '💰', label: '블로그 수익화 시작 가이드', href: '/blog' },
  { emoji: '🎁', label: '체험단 신청 사이트 모음', href: '/blog' },
  { emoji: '✅', label: '애드센스 빠른 승인 체크리스트', href: '/blog' },
];

// ── Utilities ──────────────────────────────────
function widgetNo(rects: LinkRect[], r: LinkRect): number {
  return (
    [...rects].sort((a, b) => a.x - b.x).findIndex((x) => x.id === r.id) + 1
  );
}

// 전체 복사용: 각 코드 앞에 라벨 주석을 구분선으로 붙여 이어붙임
function joinWidgets(widgets: { label: string; code: string }[]): string {
  return widgets.map((w) => `<!-- ${w.label} -->\n${w.code}`).join('\n\n');
}

function triggerDownload(dataUrl: string, name: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function copyText(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

const STORAGE_KEY = 'blogkit_skin_state';
// 템플릿 좌표를 갈아엎을 때마다 올린다 — 버전이 다르면 저장된 자동저장분을 버리고
// BLOG_TEMPLATES 기본값으로 되돌린다(안 그러면 예전 버그로 뭉개진 좌표가 새로고침마다 복원됨).
const STORAGE_VERSION = 4;

// ── Component ───────────────────────────────────
export default function SkinMakerTool({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [cw, setCw] = useState(3000);
  const [ch, setCh] = useState(900);
  const [bg, setBg] = useState('#f5f1ee');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgOverlay, setBgOverlay] = useState(0);
  const [bgScale, setBgScale] = useState(100); // 배경 확대 (%) 100~250
  const [bgRotation, setBgRotation] = useState(0); // 배경 회전 (deg, 90° 단위)
  const [bgOffsetX, setBgOffsetX] = useState(50); // 배경 위치 X (%)
  const [bgOffsetY, setBgOffsetY] = useState(50); // 배경 위치 Y (%)
  const bgDragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [labelFont, setLabelFont] = useState(DEFAULT_FONT); // 위젯 라벨 폰트 (기본 Pretendard)

  const [sidebarTab, setSidebarTab] = useState<'template' | 'design' | 'link'>(
    'template'
  );
  const [showCode, setShowCode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [previewMode, setPreviewMode] = useState<'screen' | 'full'>('screen');
  const [imgUrl, setImgUrl] = useState(DEFAULT_WIDGET_URL);
  const [blogId, setBlogId] = useState('');
  const [cats, setCats] = useState<{ no: string; name: string; postCnt: number }[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [showGrowthTips, setShowGrowthTips] = useState(false);
  const [isDownloadingSkin, setIsDownloadingSkin] = useState(false);

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [rects, setRects] = useState<LinkRect[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [previewRect, setPreviewRect] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const selectedEl = elements.find((e) => e.id === selectedId) || null;

  // 위젯 직접등록용 코드 (투명 N개 + 버튼 N개, 좌→우 정렬)
  const widgets = buildWidgets(rects, blogId);
  const safeWidth = Math.min(2200, cw);
  const previewWidth = previewMode === 'full' ? cw : Math.min(1920, cw);
  const allCode = joinWidgets(widgets);

  // ── toast ──
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  // 내 블로그 카테고리 목록을 서버 경유로 불러온다 (브라우저 직접 호출은 CORS 차단)
  const loadCats = async () => {
    if (!blogId) {
      showToast('블로그 ID를 먼저 입력하세요');
      return;
    }
    setLoadingCats(true);
    try {
      const r = await fetch(
        `/api/naver-categories?blogId=${encodeURIComponent(blogId)}`
      );
      const d = await r.json();
      setCats(d.categories ?? []);
      showToast(
        d.categories?.length
          ? `카테고리 ${d.categories.length}개 불러옴`
          : '카테고리를 못 가져왔습니다'
      );
    } catch {
      showToast('불러오기 실패');
    } finally {
      setLoadingCats(false);
    }
  };

  // ── undo history (design state snapshots) ──
  const [history, setHistory] = useState<string[]>([]);
  const restoringRef = useRef(false);
  const prevSnapRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);
  const suppressHistoryRef = useRef(false); // 드래그 중 중간 단계 기록 억제

  // ── element helpers ──
  const updateEl = (id: number, patch: Partial<CanvasElement>) =>
    setElements((prev) =>
      prev.map((e) => (e.id === id ? ({ ...e, ...patch } as CanvasElement) : e))
    );

  const removeEl = (id: number) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveEl = (id: number, dx: number, dy: number) =>
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, x: e.x + dx, y: e.y + dy } : e))
    );

  // ── 가로 가운데 정렬 ──
  const centerEl = (id: number) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    if (el.type === 'text' && el.align === 'center') {
      updateEl(id, { x: cw / 2 });
      return;
    }
    let w = el.type === 'image' ? el.w : 0;
    if (el.type === 'text') {
      const node = canvasRef.current?.querySelector(
        `[data-elid="${id}"]`
      ) as HTMLElement | null;
      if (node) w = node.getBoundingClientRect().width / previewScale;
    }
    updateEl(id, { x: Math.round((cw - w) / 2) });
  };
  // 세로(상하) 가운데 정렬 — 타이틀/서브카피가 대문 위로 쏠리는 문제 해결
  const centerElV = (id: number) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    let h = el.type === 'image' ? el.h : 0;
    if (el.type === 'text') {
      const node = canvasRef.current?.querySelector(
        `[data-elid="${id}"]`
      ) as HTMLElement | null;
      if (node) h = node.getBoundingClientRect().height / previewScale;
    }
    updateEl(id, { y: Math.round((ch - h) / 2) });
  };

  // 요소 높이(렌더 기준) 측정
  const elHeight = (el: CanvasElement) => {
    if (el.type === 'image') return el.h;
    const node = canvasRef.current?.querySelector(
      `[data-elid="${el.id}"]`
    ) as HTMLElement | null;
    return node ? node.getBoundingClientRect().height / previewScale : 0;
  };

  // 제목+서브제목(위에서부터 텍스트 2개)을 현재 간격 유지한 채 묶음으로 세로 가운데 정렬
  const centerPairV = () => {
    const texts = elements
      .filter((e): e is TextElement => e.type === 'text')
      .sort((a, b) => a.y - b.y);
    if (texts.length < 2) return;
    const [top, bottom] = texts;
    const groupH = bottom.y + elHeight(bottom) - top.y;
    const newTopY = Math.round((ch - groupH) / 2);
    const gap = bottom.y - top.y; // 간격 고정(유지)
    updateEl(top.id, { y: newTopY });
    updateEl(bottom.id, { y: newTopY + gap });
  };

  const centerRect = (id: number) =>
    setRects((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, x: Math.round((cw - r.w) / 2) } : r
      )
    );

  // 링크 영역 전체를 한 덩어리로 가로 가운데 정렬 (상대 간격 유지)
  const centerRectsGroup = () => {
    setRects((prev) => {
      if (prev.length === 0) return prev;
      const minX = Math.min(...prev.map((r) => r.x));
      const maxX = Math.max(...prev.map((r) => r.x + r.w));
      const dx = Math.round((cw - (maxX - minX)) / 2 - minX);
      return prev.map((r) => ({ ...r, x: r.x + dx }));
    });
  };

  // 링크 5칸을 화면의 위젯 가이드(가운데 정렬 5×170px)에 정확히 스냅.
  // 네이버는 투명위젯을 966px 콘텐츠 영역 가운데에 한 줄로 놓으므로,
  // 배경 라벨을 이 그리드에 맞추면 배경 글자 = 실제 클릭영역이 정확히 일치한다.
  const GRID_COUNT = 5;
  const snapRectsToWidgetGrid = () => {
    const groupW = GRID_COUNT * WIDGET_W + (GRID_COUNT - 1) * WIDGET_GAP;
    const startX = Math.round((cw - groupW) / 2);
    const colX = (i: number) => startX + i * (WIDGET_W + WIDGET_GAP);
    setRects((prev) => {
      // 기존 링크를 x순으로 정렬해 앞에서부터 그리드에 배치. 5개 미만이면 나머지를 새로 생성.
      const sorted = [...prev].sort((a, b) => a.x - b.x).slice(0, GRID_COUNT);
      const filled = [
        ...sorted,
        ...Array.from(
          { length: Math.max(0, GRID_COUNT - sorted.length) },
          (_, k) =>
            ({
              id: Date.now() + k,
              x: 0,
              y: 0,
              w: WIDGET_W,
              h: ch,
              url: 'https://',
              labelColor: '#ffffff',
              borderColor: '',
            }) as LinkRect
        ),
      ];
      const baseY = prev.length ? Math.min(...prev.map((r) => r.y)) : 0;
      const baseH = prev.length
        ? Math.min(600, ch - baseY, Math.max(...prev.map((r) => r.h)))
        : Math.min(600, ch - baseY, ch);
      return filled.map((r, i) => ({
        ...r,
        x: colX(i),
        w: WIDGET_W,
        y: baseY,
        h: baseH,
      }));
    });
  };

  const applyReferenceLayout = () => {
    const width = cw < 966 ? 1920 : cw;
    if (width !== cw) setCwKeepingRectsCentered(width);
    if (ch < 450) setCh(450);
    const startX = Math.round((width - (5 * WIDGET_W + 4 * WIDGET_GAP)) / 2);
    setRects((prev) => {
      const sorted = [...prev].sort((a, b) => a.x - b.x);
      return Array.from({ length: 5 }, (_, i) => ({
        ...sorted[i],
        id: sorted[i]?.id ?? Date.now() + i,
        x: startX + i * (WIDGET_W + WIDGET_GAP), y: 300,
        w: WIDGET_W, h: 150,
        url: sorted[i]?.url ?? '',
        label: sorted[i]?.label || ['일상', '취미', '리뷰', '여행', '사진'][i],
        labelColor: sorted[i]?.labelColor ?? '#594b40',
        borderColor: sorted[i]?.borderColor ?? '',
        labelY: 405,
      }));
    });
    showToast('공백 300px + 메뉴 150px, 5열 배치를 적용했습니다');
  };

  const addText = () => {
    const id = Date.now();
    setElements((prev) => [
      ...prev,
      {
        id,
        type: 'text',
        text: '새 텍스트',
        x: 910,
        y: 300,
        fontSize: 30,
        color: '#333333',
        fontWeight: 'bold',
        fontFamily: DEFAULT_FONT,
      },
    ]);
    setSelectedId(id);
  };

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const id = Date.now();
      setElements((prev) => [
        ...prev,
        {
          id,
          type: 'image',
          src: ev.target?.result as string,
          x: 835,
          y: 200,
          w: 250,
          h: 250,
        },
      ]);
      setSelectedId(id);
    };
    reader.readAsDataURL(file);
  };

  const uploadBgImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const loadTemplate = (tpl: BlogTemplate) => {
    setCw(tpl.cw);
    setCh(tpl.ch);
    setBg(tpl.bg);
    setBgImage(tpl.bgImage ?? null);
    setBgOverlay(tpl.bgOverlay ?? 0);
    {
      const off = posToOffset(tpl.bgPosition);
      setBgOffsetX(off.x);
      setBgOffsetY(off.y);
    }
    setBgScale(tpl.bgScale ?? 100);
    setBgRotation(tpl.bgRotation ?? 0);
    setLabelFont(tpl.labelFont ?? DEFAULT_FONT);
    setElements(tpl.elements);
    setRects(tpl.rects);
    setSelectedId(null);
    setActiveTemplateId(tpl.id);
  };

  // 마운트: 브라우저 저장공간 동기화 후 기본 템플릿 또는 저장된 작업 복원
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
    if (cancelled) return;
    let restored = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.version !== STORAGE_VERSION) throw new Error('stale storage version');
        setCw(s.cw);
        setCh(s.ch);
        setBg(s.bg);
        setBgImage(s.bgImage ?? null);
        setBgOverlay(s.bgOverlay ?? 0);
        {
          const off = posToOffset(s.bgPosition);
          setBgOffsetX(s.bgOffsetX ?? off.x);
          setBgOffsetY(s.bgOffsetY ?? off.y);
        }
        setBgScale(s.bgScale ?? 100);
        setBgRotation(s.bgRotation ?? 0);
        setLabelFont(s.labelFont ?? DEFAULT_FONT);
        setElements(s.elements ?? []);
        // 예전 저장분은 폭이 186으로 굳어 있어 상한(170)을 넘긴다. 복원 시 정규화.
        setRects(
          (s.rects ?? []).map((r: LinkRect) => ({ ...r, w: WIDGET_W }))
        );
        setImgUrl(s.imgUrl || DEFAULT_WIDGET_URL);
        setBlogId(s.blogId ?? '');
        setActiveTemplateId(s.activeTemplateId ?? null);
        restored = true;
      }
    } catch {
      /* 손상된 저장값 무시 */
    }
    if (!restored) loadTemplate(BLOG_TEMPLATES[0]);
    hydratedRef.current = true;
    });
    return () => { cancelled = true; };
  }, []);

  // 디자인 상태 스냅샷 (undo + 자동저장 공용)
  const designSnap = JSON.stringify({
    cw,
    ch,
    bg,
    bgImage,
    bgOverlay,
    bgOffsetX,
    bgOffsetY,
    bgScale,
    bgRotation,
    labelFont,
    elements,
    rects,
  });

  // 자동저장 + undo 히스토리 적재
  useEffect(() => {
    if (!hydratedRef.current) return;
    // undo: 복원 중이 아니면 변경 직전 스냅샷을 history에 push
    if (restoringRef.current) {
      restoringRef.current = false;
    } else if (
      !suppressHistoryRef.current &&
      prevSnapRef.current !== null &&
      prevSnapRef.current !== designSnap
    ) {
      const prev = prevSnapRef.current;
      setHistory((h) => [...h.slice(-29), prev]);
    }
    prevSnapRef.current = designSnap;
    // 자동저장
    const payload = {
      version: STORAGE_VERSION,
      cw,
      ch,
      bg,
      bgImage,
      bgOverlay,
      bgOffsetX,
      bgOffsetY,
      bgScale,
      bgRotation,
      labelFont,
      elements,
      rects,
      imgUrl,
      blogId,
      activeTemplateId,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ponytail: bgImage data URL이 5MB 쿼터 초과 가능. 빼고 재시도, 그래도 실패하면 스킵.
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...payload, bgImage: null })
        );
      } catch {
        /* 저장 스킵 */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designSnap, imgUrl, blogId, activeTemplateId]);

  const undo = () => {
    if (history.length === 0) return;
    const s = JSON.parse(history[history.length - 1]);
    restoringRef.current = true;
    setCw(s.cw);
    setCh(s.ch);
    setBg(s.bg);
    setBgImage(s.bgImage ?? null);
    setBgOverlay(s.bgOverlay ?? 0);
    setBgOffsetX(s.bgOffsetX ?? 50);
    setBgOffsetY(s.bgOffsetY ?? 50);
    setBgScale(s.bgScale ?? 100);
    setBgRotation(s.bgRotation ?? 0);
    setLabelFont(s.labelFont ?? DEFAULT_FONT);
    setElements(s.elements ?? []);
    setRects(s.rects ?? []);
    setSelectedId(null);
    setHistory((h) => h.slice(0, -1));
  };
  const undoRef = useRef(undo);
  useEffect(() => { undoRef.current = undo; });

  // Ctrl/Cmd+Z 되돌리기 (입력 필드 포커스 시 제외)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'z' &&
        !e.shiftKey
      ) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable)
          return;
        e.preventDefault();
        undoRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wrapper = previewWrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setPreviewScale(Math.min(1, w / previewWidth));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [previewWidth]);

  // ── drag to move element ──
  const startDrag = (e: React.MouseEvent, id: number) => {
    if (sidebarTab === 'link') return;
    e.stopPropagation();
    // ponytail: 네이티브 이미지/텍스트 드래그가 mousemove를 가로채는 것 방지.
    // 단, 편집 중인 텍스트는 caret 배치를 위해 기본 동작 유지.
    const editing = selectedId === id && sidebarTab === 'design';
    if (!editing) e.preventDefault();
    setSelectedId(id);
    // 드래그 전체를 undo 1단계로: 시작 스냅샷을 잡고 중간 기록은 억제.
    const dragStartSnap = prevSnapRef.current;
    suppressHistoryRef.current = true;
    let px = e.clientX,
      py = e.clientY;
    const onMove = (me: MouseEvent) => {
      moveEl(
        id,
        (me.clientX - px) / previewScale,
        (me.clientY - py) / previewScale
      );
      px = me.clientX;
      py = me.clientY;
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      suppressHistoryRef.current = false;
      if (dragStartSnap !== null && dragStartSnap !== prevSnapRef.current) {
        setHistory((h) => [...h.slice(-29), dragStartSnap]);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── canvas mouse ──
  const canvasPos = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / previewScale,
      y: (e.clientY - r.top) / previewScale,
    };
  };
  const onCanvasDown = (e: React.MouseEvent) => {
    if (sidebarTab === 'link') {
      const p = canvasPos(e);
      setDrawing(true);
      setStartPos(p);
      setPreviewRect({ x: p.x, y: p.y, w: 0, h: 0 });
      return;
    }
    setSelectedId(null);
    if (!bgImage) return;
    // 배경 이미지 드래그로 위치(offset%) 이동 — 썸네일 메이커와 동일
    e.preventDefault();
    const rw = cw * previewScale;
    const rh = ch * previewScale;
    const sx = rw > 0 ? 100 / rw : 0;
    const sy = rh > 0 ? 100 / rh : 0;
    const x0 = e.clientX,
      y0 = e.clientY,
      ox = bgOffsetX,
      oy = bgOffsetY;
    const dragStartSnap = prevSnapRef.current;
    suppressHistoryRef.current = true;
    const onMove = (me: MouseEvent) => {
      setBgOffsetX(Math.max(0, Math.min(100, ox - (me.clientX - x0) * sx)));
      setBgOffsetY(Math.max(0, Math.min(100, oy - (me.clientY - y0) * sy)));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      suppressHistoryRef.current = false;
      if (dragStartSnap !== null && dragStartSnap !== prevSnapRef.current) {
        setHistory((h) => [...h.slice(-29), dragStartSnap]);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const onCanvasMove = (e: React.MouseEvent) => {
    if (sidebarTab !== 'link' || !drawing) return;
    const p = canvasPos(e);
    setPreviewRect({
      x: Math.min(startPos.x, p.x),
      y: Math.min(startPos.y, p.y),
      w: Math.abs(p.x - startPos.x),
      h: Math.abs(p.y - startPos.y),
    });
  };
  const onCanvasUp = (e: React.MouseEvent) => {
    if (sidebarTab !== 'link' || !drawing) return;
    setDrawing(false);
    const p = canvasPos(e);
    const dragW = Math.abs(p.x - startPos.x);
    const dragH = Math.abs(p.y - startPos.y);
    // new.md: 위젯 가로 170px 고정, 세로 최대 600px.
    const rect = {
      id: Date.now(),
      x: Math.min(startPos.x, p.x),
      y: Math.min(startPos.y, p.y),
      w: WIDGET_W,
      h: Math.min(600, Math.round(dragH)),
      url: 'https://',
    };
    if (dragW > 5 && dragH > 5) setRects((prev) => [...prev, rect]);
    setPreviewRect(null);
  };

  // 배경 가로가 바뀌면 링크 5칸이 옛 중심에 남아 배경 그림과 어긋난다.
  // 폭 변화량의 절반만큼 같이 옮겨 가운데 정렬을 유지한다.
  const setCwKeepingRectsCentered = (v: number) => {
    if (v !== cw) {
      const dx = Math.round((v - cw) / 2);
      setRects((prev) => prev.map((r) => ({ ...r, x: r.x + dx })));
      setElements((prev) => prev.map((el) => ({ ...el, x: el.x + dx })));
    }
    setCw(v);
  };

  // ── download ──
  const downloadSkin = async () => {
    setIsDownloadingSkin(true);
    try {
      await Promise.all([
        ...rects.filter((r) => r.label).map((r) => document.fonts.load(`${r.labelFontWeight ?? 300} ${r.labelFontSize ?? 15}px ${labelFont}`)),
        ...elements.filter((el): el is TextElement => el.type === 'text')
          .map((el) => document.fonts.load(`${el.fontStyle || 'normal'} ${el.fontWeight} ${el.fontSize}px ${el.fontFamily || DEFAULT_FONT}`)),
      ]);
      await document.fonts.ready; // 화면과 PNG가 같은 실제 웹폰트를 쓰도록 로딩 완료 후 저장
      // 네이버는 스킨배경을 원본 크기 그대로(가운데 정렬·가로 반복) 표시한다 — 실측 확인.
      // 확대해 내보내면 배경에 그린 메뉴 칸이 함께 커지는데 실제 위젯 격자는 170px·간격 10px로
      // 고정이라, cw=1920을 3000으로 확대하면 5칸 끝단이 400px 넘게 어긋난다. 항상 1:1로 낸다.
      // 넓은 화면 대응은 배율이 아니라 [배경 크기 > 가로]를 3000까지 키워서 해결한다.
      const exportScale = 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(cw * exportScale);
      canvas.height = Math.round(ch * exportScale);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(exportScale, exportScale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);
      if (bgImage) {
        await new Promise<void>((res, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            // 미리보기와 동일 모델: background-size(cover 또는 %) + background-position(offset%) + 중심 회전
            let dw: number, dh: number;
            if (bgScale === 100) {
              const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
              dw = img.naturalWidth * s;
              dh = img.naturalHeight * s;
            } else {
              dw = cw * (bgScale / 100);
              dh = dw * (img.naturalHeight / img.naturalWidth);
            }
            const dx = (cw - dw) * (bgOffsetX / 100);
            const dy = (ch - dh) * (bgOffsetY / 100);
            ctx.save();
            ctx.translate(cw / 2, ch / 2);
            ctx.rotate((bgRotation * Math.PI) / 180);
            ctx.translate(-cw / 2, -ch / 2);
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
            res();
          };
          img.onerror = () => reject(new Error('배경 이미지 불러오기 실패'));
          img.src = bgImage;
        });
        if (bgOverlay > 0) {
          ctx.fillStyle = `rgba(0,0,0,${bgOverlay / 100})`;
          ctx.fillRect(0, 0, cw, ch);
        }
      }
      for (const el of elements) {
        if (el.type === 'image') {
          await new Promise<void>((res, reject) => {
            const img = new Image();
            img.onload = () => {
              const border = el.borderColor ? Math.min(el.borderWidth ?? 3, el.w / 2 - .5, el.h / 2 - .5) : 0;
              const innerW = el.w - border * 2;
              const innerH = el.h - border * 2;
              const { sx, sy, sw, sh } = coverSrcRect(img.naturalWidth, img.naturalHeight, innerW, innerH);
              ctx.save();
              if (el.rotation) {
                ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
                ctx.rotate(el.rotation * Math.PI / 180);
                ctx.translate(-el.x - el.w / 2, -el.y - el.h / 2);
              }
              if (el.clipShape === 'house') {
                ctx.beginPath();
                ctx.moveTo(el.x, el.y + el.h * .22);
                ctx.lineTo(el.x + el.w / 2, el.y);
                ctx.lineTo(el.x + el.w, el.y + el.h * .22);
                ctx.lineTo(el.x + el.w, el.y + el.h);
                ctx.lineTo(el.x, el.y + el.h);
                ctx.closePath();
                ctx.clip();
              }
              if (el.radius) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(el.x, el.y, el.w, el.h, el.radius);
                ctx.clip();
                ctx.drawImage(img, sx, sy, sw, sh, el.x + border, el.y + border, innerW, innerH);
                ctx.restore();
              } else {
                ctx.drawImage(img, sx, sy, sw, sh, el.x + border, el.y + border, innerW, innerH);
              }
              if (el.borderColor) {
                ctx.save();
                if (el.radius) {
                  ctx.beginPath();
                  ctx.roundRect(el.x + border / 2, el.y + border / 2, el.w - border, el.h - border, Math.max(0, el.radius - border / 2));
                } else {
                  ctx.beginPath();
                  ctx.rect(el.x + border / 2, el.y + border / 2, el.w - border, el.h - border);
                }
                ctx.strokeStyle = el.borderColor;
                ctx.lineWidth = border;
                ctx.stroke();
                ctx.restore();
              }
              ctx.restore();
              res();
            };
            img.onerror = () => reject(new Error('사진 불러오기 실패'));
            img.src = el.src;
          });
        } else {
          ctx.font = `${el.fontStyle || 'normal'} ${el.fontWeight} ${el.fontSize}px ${el.fontFamily || DEFAULT_FONT}`;
          ctx.letterSpacing = `${el.letterSpacing ?? 0}px`;
          ctx.textAlign = el.align === 'center' ? 'center' : 'left';
          ctx.textBaseline = 'alphabetic';
          const baseline = textBaseline(ctx, el.y, el.fontSize, el.text);
          if (el.strokeColor) {
            ctx.strokeStyle = el.strokeColor;
            ctx.lineWidth = el.strokeWidth ?? 2;
            ctx.lineJoin = 'round';
            ctx.strokeText(el.text, el.align === 'center' ? el.x : el.x + 8, baseline);
          }
          ctx.fillStyle = el.color;
          ctx.fillText(el.text, el.align === 'center' ? el.x : el.x + 8, baseline);
        }
      }
      // Draw rect background, border, label
      for (const r of rects) {
        if (r.bgColor) {
          ctx.fillStyle = r.bgColor;
          ctx.fillRect(r.x, r.y, r.w, r.h);
        }
        if (r.borderColor !== '') {
          ctx.strokeStyle = r.borderColor || '#52525b';
          ctx.lineWidth = 2;
          ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
        }
        if (r.label) {
          // FIX: 라벨 위치/baseline/폰트를 미리보기와 동일하게 통일.
          // (기존: baseline 'middle' + 0.7 vs 미리보기 top+0.68 → 위치 불일치)
          const labelSize = r.labelFontSize ?? 15;
          ctx.letterSpacing = '0px';
          ctx.font = `${r.labelFontWeight ?? 300} ${labelSize}px ${labelFont}`;
          const labelX = r.x + r.w / 2;
          const labelY = r.labelY ?? r.y + Math.round(r.h * LABEL_Y_RATIO);
          if (r.labelBg || r.labelBorderColor) {
            const padX = r.labelPadX ?? 14;
            const padY = r.labelPadY ?? 7;
            const textW = ctx.measureText(r.label).width;
            const pillW = r.labelPillW ?? textW + padX * 2;
            const pillH = labelSize + padY * 2;
            const pillX = labelX - pillW / 2;
            const pillY = labelY - padY;
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
            if (r.labelBg) {
              ctx.fillStyle = r.labelBg;
              ctx.fill();
            }
            if (r.labelBorderColor) {
              ctx.strokeStyle = r.labelBorderColor;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
          ctx.fillStyle = r.labelColor || '#333333';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(r.label, labelX, textBaseline(ctx, labelY, labelSize, r.label));
        }
      }
      triggerDownload(canvas.toDataURL('image/png'), '블로그_스킨.png');
      showToast('스킨 이미지 저장됨');
    } catch {
      showToast('사진이나 글꼴을 불러오지 못했습니다. 로딩 후 다시 저장해 주세요.');
    } finally {
      setIsDownloadingSkin(false);
    }
  };

  const downloadWidget = () => {
    // 투명 위젯은 컬럼 1칸 = 가로 170px 고정 × 캔버스(대문) 높이. 투명이라 각 코드의 width/height로 손실 없이 스케일됨.
    const h = Math.min(600, ch); // 위젯 세로 최대 600
    const canvas = document.createElement('canvas');
    canvas.width = WIDGET_W;
    canvas.height = h;
    triggerDownload(
      canvas.toDataURL('image/png'),
      `투명위젯_${WIDGET_W}x${h}.png`
    );
  };

  // ── render ──
  return (
    <div
      className={`font-sans text-gray-800 ${embedded ? '' : 'min-h-screen bg-[#f5f5f0] py-8 px-4 md:px-8'}`}
    >
      <div className={embedded ? '' : 'max-w-6xl mx-auto'}>
        {!embedded && (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition mb-6"
          >
            <ArrowLeft size={12} /> 홈으로
          </Link>
        )}

        {/* 스타일 선택 탭 */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            스타일 선택
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {BLOG_TEMPLATES.filter((tpl) => tpl.previewImage).map((tpl) => (
              <button key={tpl.id} onClick={() => { loadTemplate(tpl); setSidebarTab('design'); }}
                aria-label={`${tpl.label} 배경 선택`}
                aria-pressed={activeTemplateId === tpl.id}
                className={`overflow-hidden text-left rounded-xl border transition ${activeTemplateId === tpl.id ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'}`}>
                <img src={tpl.previewImage} alt={tpl.desc} className="w-full aspect-[10/3] object-cover" />
                <span className="block bg-white px-4 py-3 text-sm font-semibold">{tpl.label}<span className="ml-2 text-xs font-normal text-gray-500">새 배경 · 3000×900</span></span>
              </button>
            ))}
          </div>
          {BLOG_TEMPLATES.find((tpl) => tpl.id === activeTemplateId)?.fontSource && (
            <p className="mb-3 text-xs text-gray-500">선택한 배경의 눈누 글꼴: <a className="underline underline-offset-2" target="_blank" rel="noopener noreferrer" href={BLOG_TEMPLATES.find((tpl) => tpl.id === activeTemplateId)!.fontSource!.url}>{BLOG_TEMPLATES.find((tpl) => tpl.id === activeTemplateId)!.fontSource!.name}</a></p>
          )}
          {BLOG_TEMPLATES.find((tpl) => tpl.id === activeTemplateId)?.fontNote && <p className="mb-3 text-xs text-gray-500">{BLOG_TEMPLATES.find((tpl) => tpl.id === activeTemplateId)!.fontNote}</p>}
          {REFERENCE_SKIN_TEMPLATES.some((tpl) => tpl.id === activeTemplateId) && <p className="mb-3 text-xs text-gray-500">참고 디자인의 구성·색감을 새로 적용한 예시입니다. <a className="underline underline-offset-2" href="/images/skin-templates/reference-photo-credits.json" target="_blank" rel="noopener noreferrer">사진 출처·이용 조건</a></p>}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {BLOG_TEMPLATES.filter((tpl) => !tpl.previewImage).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => {
                  loadTemplate(tpl);
                  setSidebarTab('design');
                }}
                title={tpl.desc}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                  activeTemplateId === tpl.id
                    ? 'bg-[#111111] text-white border-[#111111] shadow'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <span>{tpl.emoji}</span>
                {tpl.label}
              </button>
            ))}
            {activeTemplateId && (
              <button
                onClick={() => {
                  setElements([]);
                  setRects([]);
                  setActiveTemplateId(null);
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                  } catch {
                    /* noop */
                  }
                }}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-gray-200 hover:border-gray-300 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 두 컬럼 레이아웃 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── 왼쪽: 컨트롤 패널 ── */}
          <div className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1 bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">
            {/* 탭 헤더 */}
            <div className="flex border-b border-gray-200">
              {[
                {
                  id: 'template' as const,
                  label: '배경',
                  icon: <ImageIcon className="w-4 h-4" />,
                },
                {
                  id: 'design' as const,
                  label: '디자인',
                  icon: <Settings2 className="w-4 h-4" />,
                },
                {
                  id: 'link' as const,
                  label: '링크',
                  icon: <LinkIcon className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-inset ${
                    sidebarTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="p-5 space-y-4">
              {/* 배경 탭 */}
              {sidebarTab === 'template' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배경 크기
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        가로 3000 권장 — 네이버는 원본 크기로 표시해서, 좁으면 넓은
                        화면에서 좌우로 반복됩니다
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          ['가로', cw, setCwKeepingRectsCentered, 600, 3000],
                          ['세로', ch, setCh, 200, 1200],
                        ] as [
                          string,
                          number,
                          (v: number) => void,
                          number,
                          number,
                        ][]
                      ).map(([label, val, setter, min, max]) => (
                        <div
                          key={label}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-gray-500"
                        >
                          <div className="text-xs font-semibold text-gray-400 mb-1">
                            {label} (px)
                          </div>
                          <input
                            type="number"
                            value={val}
                            min={min}
                            max={max}
                            step={10}
                            aria-label={`배경 ${label} 크기 (px)`}
                            onChange={(e) =>
                              setter(
                                Math.max(
                                  min,
                                  Math.min(max, +e.target.value || val)
                                )
                              )
                            }
                            className="bg-transparent border-none outline-none font-bold text-sm w-full text-gray-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[{ w: 1920, h: 450 }, { w: 2750, h: 750 }, { w: 3000, h: 900 }].map(({ w, h }) => (
                      <button key={w} onClick={() => { setCwKeepingRectsCentered(w); setCh(h); }} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs hover:bg-gray-50">{w}×{h}</button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">중앙 {safeWidth}px 안에 중요한 내용을, 양옆은 잘려도 되는 배경만 배치하세요. 메뉴는 중앙 170px 5열에 맞춥니다.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배경 색상
                    </label>
                    <input
                      type="color"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer p-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배경 이미지
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">
                      {bgImage ? (
                        <>
                          <img
                            src={bgImage}
                            alt="배경 미리보기"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                          />
                          <span className="relative z-10 bg-white/80 px-3 py-1 rounded text-sm font-medium text-gray-700">
                            이미지 변경
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          클릭하여 이미지 업로드
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadBgImage(f);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {bgImage && (
                      <button
                        type="button"
                        onClick={() => setBgImage(null)}
                        className="mt-2 w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg py-1.5 transition"
                      >
                        이미지 제거
                      </button>
                    )}
                  </div>
                  {bgImage && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          어둡게 ({bgOverlay}%)
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={80}
                          value={bgOverlay}
                          aria-label="배경 어둡게 정도"
                          onChange={(e) => setBgOverlay(+e.target.value)}
                          className="w-full cursor-pointer accent-gray-700"
                        />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          미리보기에서 배경을 <b>드래그</b>해 위치를 맞추고, 우측 상단
                          버튼으로 <b>확대·축소(+/-)</b>와 <b>90° 회전</b>을 조절하세요.
                          <br />현재 확대 {bgScale}% · 회전 {bgRotation}°
                        </p>
                      </div>
                      {(bgScale !== 100 ||
                        bgRotation !== 0 ||
                        bgOffsetX !== 50 ||
                        bgOffsetY !== 50) && (
                        <button
                          type="button"
                          onClick={() => {
                            setBgScale(100);
                            setBgRotation(0);
                            setBgOffsetX(50);
                            setBgOffsetY(50);
                          }}
                          className="w-full text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg py-1.5 transition"
                        >
                          배경 위치·확대·회전 초기화
                        </button>
                      )}
                    </>
                  )}
                </>
              )}

              {/* 디자인 탭 */}
              {sidebarTab === 'design' && (
                <>
                  {selectedEl && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        선택한 요소 수정
                      </p>
                      {selectedEl.type === 'text' && (
                        <>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              텍스트
                            </label>
                            <input
                              value={selectedEl.text}
                              onChange={(e) =>
                                updateEl(selectedEl.id, {
                                  text: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">
                                글자 크기
                              </label>
                              <input
                                type="number"
                                value={selectedEl.fontSize}
                                onChange={(e) =>
                                  updateEl(selectedEl.id, {
                                    fontSize: parseInt(e.target.value) || 12,
                                  })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">
                                색상
                              </label>
                              <input
                                type="color"
                                value={selectedEl.color}
                                onChange={(e) =>
                                  updateEl(selectedEl.id, {
                                    color: e.target.value,
                                  })
                                }
                                className="w-full h-[38px] rounded-lg border border-gray-300 cursor-pointer p-1"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              폰트
                            </label>
                            <select
                              value={selectedEl.fontFamily || DEFAULT_FONT}
                              onChange={(e) =>
                                updateEl(selectedEl.id, {
                                  fontFamily: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                            >
                              {FONTS.map((f) => (
                                <option
                                  key={f.name}
                                  value={f.value}
                                  style={{ fontFamily: f.value }}
                                >
                                  {f.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              굵기
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateEl(selectedEl.id, { fontWeight: 'normal' })
                                }
                                className={`py-2 rounded-lg border text-xs font-semibold transition ${
                                  selectedEl.fontWeight === 'bold'
                                    ? 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                                    : 'border-gray-900 bg-gray-900 text-white'
                                }`}
                              >
                                보통
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateEl(selectedEl.id, { fontWeight: 'bold' })
                                }
                                className={`py-2 rounded-lg border text-xs font-bold transition ${
                                  selectedEl.fontWeight === 'bold'
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
                                }`}
                              >
                                굵게
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedEl.type === 'image' && (
                        <div>
                          <label className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                            <span>크기 조절 (너비)</span>
                            <span className="tabular-nums text-gray-400">
                              {selectedEl.w}px
                            </span>
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            value={selectedEl.w}
                            aria-label="이미지 너비 조절"
                            onChange={(e) => {
                              const w = +e.target.value;
                              updateEl(selectedEl.id, {
                                w,
                                h: Math.round(
                                  (w * selectedEl.h) / selectedEl.w
                                ),
                              });
                            }}
                            className="w-full accent-gray-800"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => centerEl(selectedEl.id)}
                          className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:border-gray-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                        >
                          <AlignHorizontalJustifyCenter size={13} /> 가로 가운데
                        </button>
                        <button
                          onClick={() => centerElV(selectedEl.id)}
                          className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:border-gray-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                        >
                          <AlignHorizontalJustifyCenter
                            size={13}
                            style={{ transform: 'rotate(90deg)' }}
                          />{' '}
                          세로 가운데
                        </button>
                      </div>
                    </div>
                  )}

                  {elements.filter((e) => e.type === 'text').length >= 2 && (
                    <button
                      onClick={centerPairV}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:border-gray-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                    >
                      <AlignHorizontalJustifyCenter
                        size={13}
                        style={{ transform: 'rotate(90deg)' }}
                      />{' '}
                      제목+서브 묶음 세로 가운데
                    </button>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      요소 추가
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition">
                        <ImageIcon className="w-5 h-5 text-gray-400 mb-1.5" />
                        <span className="text-xs font-semibold text-gray-500">
                          사진 추가
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0])
                              addImage(e.target.files[0]);
                          }}
                        />
                      </label>
                      <button
                        onClick={addText}
                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition"
                      >
                        <Type className="w-5 h-5 text-gray-400 mb-1.5" />
                        <span className="text-xs font-semibold text-gray-500">
                          글자 추가
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      추가한 요소들
                    </label>
                    {elements.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4 italic">
                        템플릿을 선택하거나 요소를 추가하세요
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {elements.map((el, i) => (
                          <div
                            key={el.id}
                            onClick={() => setSelectedId(el.id)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border transition ${
                              selectedId === el.id
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-100 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="text-xs text-gray-300 font-bold w-4">
                              {i + 1}
                            </span>
                            <div className="bg-gray-100 text-gray-400 rounded p-1 flex-shrink-0">
                              {el.type === 'image' ? (
                                <ImageIcon size={11} />
                              ) : (
                                <Type size={11} />
                              )}
                            </div>
                            <span className="text-xs font-semibold text-gray-600 flex-1 truncate">
                              {el.type === 'image' ? '이미지' : el.text}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeEl(el.id);
                              }}
                              aria-label="요소 삭제"
                              className="text-gray-300 hover:text-red-400 transition p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 링크 탭 */}
              {sidebarTab === 'link' && (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-800 mb-1">
                      💡 카테고리 버튼에 링크 연결하기
                    </p>
                    <p className="text-xs text-green-700 leading-relaxed">
                      블로그 카테고리에서 우클릭 → 링크 주소 복사 후 메뉴에 붙여넣으세요.
                      또는 내 블로그 ID와 카테고리 번호를 입력해 연결할 수 있습니다.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      내 블로그 ID
                    </label>
                    <input
                      value={blogId}
                      onChange={(e) => setBlogId(e.target.value.trim())}
                      placeholder="예: myblogid"
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-gray-500 outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                      blog.naver.com/<b>이부분</b> 이 내 블로그 ID입니다.
                    </p>
                    <button
                      onClick={loadCats}
                      disabled={loadingCats}
                      className="mt-2 w-full flex items-center justify-center gap-1 text-xs font-semibold text-white bg-[#03c75a] hover:bg-[#02b350] disabled:opacity-50 rounded-lg px-2 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                    >
                      {loadingCats ? '불러오는 중...' : '카테고리 불러오기'}
                    </button>
                    {cats.length > 0 && (
                      <p className="text-[11px] text-green-600 mt-1.5">
                        카테고리 {cats.length}개 불러옴 - 각 링크칸에서 선택하세요.
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 leading-relaxed">
                    이미지 업로드 없이 표 기반 공백 위젯과 메뉴 위젯 코드를 만듭니다. 메뉴 그림은 스킨 이미지에 포함됩니다.
                  </div>
                  <button type="button" onClick={applyReferenceLayout} className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100">글 예시 적용: 공백 300 + 메뉴 150 · 5열</button>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ label: '공백 높이', value: rects[0]?.y ?? 300, isY: true }, { label: '메뉴 높이', value: rects[0]?.h ?? 150, isY: false }].map(({ label, value, isY }) => (
                      <label key={label} className="text-xs text-gray-600">{label} (px)
                        <input type="number" aria-label={label} min={isY ? 0 : 5} max={600} value={Math.round(value)} disabled={!rects.length}
                          onChange={(e) => {
                            const v = Math.max(isY ? 0 : 5, Math.min(600, Number(e.target.value)));
                            setRects((prev) => prev.map((r) => ({ ...r, ...(isY ? { y: v, labelY: r.labelY == null ? undefined : r.labelY + v - r.y } : { h: v }) })));
                          }} className="mt-1 w-full p-2 rounded-lg border border-gray-300" />
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500">참고 글 방식: 공백 300px + 메뉴 150px. 위젯 하나는 170×600px 이하이며 스킨 높이와 별개입니다.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      위젯 글씨 폰트
                    </label>
                    <select
                      value={labelFont}
                      onChange={(e) => setLabelFont(e.target.value)}
                      aria-label="위젯 라벨 폰트"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                    >
                      {FONTS.map((f) => (
                        <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      모든 위젯 칸 라벨에 함께 적용됩니다.
                    </p>
                    <label className="mt-3 block text-xs text-gray-600">메뉴 글씨 크기 ({rects[0]?.labelFontSize ?? 15}px)
                      <input type="range" aria-label="메뉴 글씨 크기" min={14} max={30} step={1} value={rects[0]?.labelFontSize ?? 15} disabled={!rects.length}
                        onChange={(e) => {
                          const size = Math.max(14, Math.min(30, Number(e.target.value) || 14));
                          setRects((prev) => prev.map((r) => ({ ...r, labelFontSize: size })));
                        }} className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm" />
                    </label>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-1">
                      <label className="block text-sm font-medium text-gray-700 flex-shrink-0">
                        링크 ({rects.length})
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={snapRectsToWidgetGrid}
                          title="메뉴 5칸을 위젯 가이드에 맞춤 (가로 위치·폭 + 세로 위치·높이 통일)"
                          className="flex items-center gap-1 text-xs font-semibold text-white bg-[#111111] hover:bg-[#222] rounded-lg px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                        >
                          <Layout size={12} /> 5칸 그리드 맞춤
                        </button>
                        {rects.length > 0 && (
                          <button
                            onClick={centerRectsGroup}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                          >
                            <AlignHorizontalJustifyCenter size={12} /> 가운데
                          </button>
                        )}
                      </div>
                    </div>
                    {rects.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4 italic">
                        캔버스에서 드래그해 클릭 영역을 만드세요
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {rects.map((r) => (
                          <div
                            key={r.id}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-3"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold bg-gray-200 text-gray-700 rounded px-2 py-0.5">
                                위젯 칸 {widgetNo(rects, r)}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => centerRect(r.id)}
                                  aria-label="가로 가운데 정렬"
                                  title="가로 가운데 정렬"
                                  className="text-gray-300 hover:text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded"
                                >
                                  <AlignHorizontalJustifyCenter size={13} />
                                </button>
                                <button
                                  onClick={() =>
                                    setRects((prev) =>
                                      prev.filter((x) => x.id !== r.id)
                                    )
                                  }
                                  aria-label="링크 영역 삭제"
                                  className="text-gray-300 hover:text-red-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <input
                              value={r.label ?? ''}
                              onChange={(e) =>
                                setRects((prev) =>
                                  prev.map((x) =>
                                    x.id === r.id
                                      ? { ...x, label: e.target.value }
                                      : x
                                  )
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-1.5"
                              placeholder="버튼 텍스트 (예: 맛집)"
                            />
                            {r.newWindow ? (
                              <input
                                value={r.url}
                                onChange={(e) =>
                                  setRects((prev) =>
                                    prev.map((x) =>
                                      x.id === r.id
                                        ? { ...x, url: e.target.value }
                                        : x
                                    )
                                  )
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-2"
                                placeholder="외부 링크 전체 URL (https://...)"
                              />
                            ) : (
                              <>
                                <input
                                  value={r.categoryUrl ?? ''}
                                  aria-label={`위젯 ${widgetNo(rects, r)} 카테고리 주소`}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const parsed = parseCategoryUrl(value);
                                    setRects((prev) => prev.map((x) => x.id === r.id ? { ...x, categoryUrl: value, ...(parsed ? { categoryNo: parsed.categoryNo } : {}) } : x));
                                  }}
                                  placeholder="복사한 카테고리 주소 붙여넣기"
                                  className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-1"
                                />
                                {r.categoryUrl?.trim() && !parseCategoryUrl(r.categoryUrl) && <p className="text-[10px] text-red-600 mb-1">카테고리 번호가 포함된 네이버 블로그 주소인지 확인해 주세요.</p>}
                                {cats.length > 0 ? (
                                  <select
                                    value={r.categoryNo ?? ''}
                                    onChange={(e) =>
                                      setRects((prev) =>
                                        prev.map((x) =>
                                          x.id === r.id
                                            ? { ...x, categoryNo: e.target.value, categoryUrl: '' }
                                            : x
                                        )
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-1 bg-white"
                                  >
                                    <option value="">카테고리 선택</option>
                                    {cats.map((c) => (
                                      <option key={c.no} value={c.no}>
                                        {c.name} ({c.no})
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    value={r.categoryNo ?? ''}
                                    inputMode="numeric"
                                    onPaste={(e) => {
                                      const value = e.clipboardData.getData('text').trim();
                                      if (!/^https?:\/\//i.test(value)) return;
                                      e.preventDefault();
                                      const parsed = parseCategoryUrl(value);
                                      setRects((prev) => prev.map((x) => x.id === r.id ? { ...x, categoryUrl: value, ...(parsed ? { categoryNo: parsed.categoryNo } : {}) } : x));
                                    }}
                                    onChange={(e) =>
                                      setRects((prev) =>
                                        prev.map((x) =>
                                          x.id === r.id
                                            ? {
                                                ...x,
                                                categoryUrl: '',
                                                categoryNo:
                                                  e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ''
                                                  ),
                                              }
                                            : x
                                        )
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-1"
                                    placeholder="카테고리 번호 (예: 53)"
                                  />
                                )}
                                <p className="text-[10px] text-gray-400 mb-2 break-all leading-relaxed">
                                  → {r.categoryUrl?.trim() ? (() => { const parsed = parseCategoryUrl(r.categoryUrl); return parsed ? catUrl(parsed.blogId, parsed.categoryNo) : '올바른 카테고리 주소가 필요합니다'; })() : catUrl(blogId, r.categoryNo || '')}
                                </p>
                              </>
                            )}
                            {/* 크기 — 위젯 가로 170px 고정, 세로 최대 600px */}
                            <div className="grid grid-cols-2 gap-1.5 mb-2">
                              <div>
                                <p className="text-[10px] text-gray-400 font-semibold mb-1">
                                  너비 (px)
                                </p>
                                <input
                                  type="text"
                                  value={`${WIDGET_W} (고정)`}
                                  readOnly
                                  tabIndex={-1}
                                  aria-label={`링크 영역 너비 (${WIDGET_W}px 고정)`}
                                  className="w-full p-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-400 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-semibold mb-1">
                                  높이 (px)
                                </p>
                                <input
                                  type="number"
                                  min={5}
                                  max={600}
                                  value={Math.round(r.h)}
                                  aria-label="링크 영역 높이"
                                  onChange={(e) => {
                                    const v = Math.max(
                                      5,
                                      Math.min(600, +e.target.value || 5)
                                    );
                                    setRects((prev) =>
                                      prev.map((x) =>
                                        x.id === r.id ? { ...x, h: v } : x
                                      )
                                    );
                                  }}
                                  className="w-full p-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500"
                                />
                              </div>
                            </div>
                            {/* 색상 */}
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <p className="text-[10px] text-gray-400 font-semibold mb-1">
                                  글자색
                                </p>
                                <input
                                  type="color"
                                  value={r.labelColor || '#333333'}
                                  onChange={(e) =>
                                    setRects((prev) =>
                                      prev.map((x) =>
                                        x.id === r.id
                                          ? { ...x, labelColor: e.target.value }
                                          : x
                                      )
                                    )
                                  }
                                  className="w-full h-7 rounded border border-gray-200 cursor-pointer p-0.5"
                                />
                              </div>
                              <div>
                                <label className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!r.bgColor}
                                    onChange={(e) =>
                                      setRects((prev) =>
                                        prev.map((x) =>
                                          x.id === r.id
                                            ? {
                                                ...x,
                                                bgColor: e.target.checked
                                                  ? '#ffffff'
                                                  : undefined,
                                              }
                                            : x
                                        )
                                      )
                                    }
                                    className="w-2.5 h-2.5"
                                  />
                                  배경색
                                </label>
                                <input
                                  type="color"
                                  value={r.bgColor || '#ffffff'}
                                  onChange={(e) =>
                                    setRects((prev) =>
                                      prev.map((x) =>
                                        x.id === r.id
                                          ? { ...x, bgColor: e.target.value }
                                          : x
                                      )
                                    )
                                  }
                                  disabled={!r.bgColor}
                                  className="w-full h-7 rounded border border-gray-200 cursor-pointer p-0.5 disabled:opacity-30"
                                />
                              </div>
                              <div>
                                <label className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={r.borderColor !== ''}
                                    onChange={(e) =>
                                      setRects((prev) =>
                                        prev.map((x) =>
                                          x.id === r.id
                                            ? {
                                                ...x,
                                                borderColor: e.target.checked
                                                  ? x.borderColor || '#52525b'
                                                  : '',
                                              }
                                            : x
                                        )
                                      )
                                    }
                                    className="w-2.5 h-2.5"
                                  />
                                  테두리
                                </label>
                                <input
                                  type="color"
                                  value={r.borderColor || '#52525b'}
                                  onChange={(e) =>
                                    setRects((prev) =>
                                      prev.map((x) =>
                                        x.id === r.id
                                          ? {
                                              ...x,
                                              borderColor: e.target.value,
                                            }
                                          : x
                                      )
                                    )
                                  }
                                  disabled={r.borderColor === ''}
                                  className="w-full h-7 rounded border border-gray-200 cursor-pointer p-0.5 disabled:opacity-30"
                                />
                              </div>
                            </div>
                            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold mt-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!r.newWindow}
                                onChange={(e) =>
                                  setRects((prev) =>
                                    prev.map((x) =>
                                      x.id === r.id
                                        ? { ...x, newWindow: e.target.checked }
                                        : x
                                    )
                                  )
                                }
                                className="w-3 h-3"
                              />
                              새 창으로 열기 (외부 링크)
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── 오른쪽: 캔버스 + 액션 ── */}
          <div className="flex-1 min-w-0 order-1 lg:order-2 flex flex-col">
            {/* 캔버스 카드 */}
            <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4">
              <h3 className="text-left font-semibold text-gray-800 mb-3 px-1 text-sm">
                미리보기
                <label className="ml-3 inline-flex items-center gap-1 text-xs font-normal text-gray-500"><input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} />가이드 표시</label>
                {sidebarTab === 'link' && (
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    드래그로 링크 영역 그리기
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-3 px-1">
                <button onClick={() => setPreviewMode('screen')} aria-pressed={previewMode === 'screen'} className={`text-xs rounded-lg px-3 py-2 border ${previewMode === 'screen' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200'}`}>블로그 화면 (1920px)</button>
                <button onClick={() => setPreviewMode('full')} aria-pressed={previewMode === 'full'} className={`text-xs rounded-lg px-3 py-2 border ${previewMode === 'full' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200'}`}>전체 배경</button>
                <span className="text-xs text-gray-500">저장 {cw}×{ch}px · 표시 폭 {previewWidth}px</span>
              </div>
              <div
                ref={previewWrapperRef}
                role="group"
                aria-label="스킨 미리보기"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: `${previewWidth} / ${ch}`,
                  overflow: 'hidden',
                  borderRadius: 12,
                  boxShadow: 'inset 0 0 0 1px #f1f5f9',
                }}
              >
                <div
                  ref={canvasRef}
                  role="group"
                  aria-label="스킨 편집 캔버스"
                  style={{
                    position: 'relative',
                    width: cw,
                    height: ch,
                    left: ((previewWidth - cw) / 2) * previewScale,
                    backgroundColor: bg,
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor:
                      sidebarTab === 'link'
                        ? 'crosshair'
                        : bgImage
                          ? 'grab'
                          : 'default',
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                  }}
                  onMouseDown={onCanvasDown}
                  onMouseMove={onCanvasMove}
                  onMouseUp={onCanvasUp}
                >
                  {/* BG image — background-size(cover/%) + position(offset%) + 회전 (export와 동일 모델) */}
                  {bgImage && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url('${bgImage}')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize:
                          bgScale === 100 ? 'cover' : `${bgScale}%`,
                        backgroundPosition: `${bgOffsetX}% ${bgOffsetY}%`,
                        transform: `rotate(${bgRotation}deg)`,
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    />
                  )}
                  {/* BG overlay */}
                  {bgImage && bgOverlay > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: `rgba(0,0,0,${bgOverlay / 100})`,
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {/* 위젯 칸 가이드 — 한 줄 5칸(가로 170px·간격 10px) 가운데 정렬 */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: showGuides ? 'flex' : 'none',
                      justifyContent: 'center',
                      gap: WIDGET_GAP,
                      pointerEvents: 'none',
                      opacity: 0.3,
                      zIndex: 2,
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        style={{
                          width: WIDGET_W,
                          height: '100%',
                          border: '1px dashed #18181b',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                  {/* 안전 영역 가이드 (가운데 ~966px) */}
                  {showGuides && cw >= 966 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: (cw - safeWidth) / 2,
                        width: safeWidth,
                        borderLeft: '2px dashed #2563eb',
                        borderRight: '2px dashed #2563eb',
                        pointerEvents: 'none',
                        zIndex: 2,
                        opacity: 0.45,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#2563eb',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        중앙 안전 영역 {safeWidth}px · 위젯 5열은 안쪽 점선
                      </span>
                    </div>
                  )}

                  {/* Empty state */}
                  {elements.length === 0 && !bgImage && sidebarTab !== 'link' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ fontSize: 36 }}>🎨</div>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#94a3b8',
                        }}
                      >
                        위에서 블로그 유형을 선택하세요
                      </p>
                    </div>
                  )}
                  {sidebarTab === 'link' && rects.length === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        pointerEvents: 'none',
                        zIndex: 41,
                      }}
                    >
                      <div style={{ fontSize: 30 }}>🖱️</div>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#2563eb',
                          background: 'rgba(255,255,255,0.85)',
                          padding: '6px 14px',
                          borderRadius: 8,
                        }}
                      >
                        메뉴 위치를 드래그해 클릭 영역을 그리세요
                      </p>
                    </div>
                  )}

                  {/* Elements */}
                  {elements.map((el) => (
                    <div
                      key={el.id}
                      data-elid={el.id}
                      style={{
                        position: 'absolute',
                        left: el.x,
                        top: el.y,
                        transform: el.type === 'text' && el.align === 'center' ? 'translateX(-50%)' : el.type === 'image' && el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                        zIndex: selectedId === el.id ? 50 : 10,
                        cursor: sidebarTab !== 'link' ? 'move' : 'default',
                        outline:
                          selectedId === el.id ? '2px solid #18181b' : 'none',
                        outlineOffset: 4,
                        userSelect: 'none',
                      }}
                      onClick={(e) => {
                        if (sidebarTab !== 'link') {
                          e.stopPropagation();
                          setSelectedId(el.id);
                        }
                      }}
                      onMouseDown={(e) => startDrag(e, el.id)}
                    >
                      {el.type === 'image' ? (
                        <img
                          src={el.src}
                          width={el.w}
                          height={el.h}
                          style={{
                            display: 'block',
                            pointerEvents: 'none',
                            width: el.w,
                            height: el.h,
                            objectFit: 'cover',
                            borderRadius: el.radius ?? 0,
                            clipPath: el.clipShape === 'house' ? 'polygon(0 22%, 50% 0, 100% 22%, 100% 100%, 0 100%)' : undefined,
                            boxSizing: 'border-box',
                            border: el.borderColor
                              ? `${el.borderWidth ?? 3}px solid ${el.borderColor}`
                              : 'none',
                          }}
                          alt=""
                        />
                      ) : (
                        <div
                          style={{
                            fontSize: el.fontSize,
                            lineHeight: 1,
                            color: el.color,
                            fontWeight: el.fontWeight,
                            fontStyle: el.fontStyle || 'normal',
                            letterSpacing: el.letterSpacing ?? 0,
                            fontFamily: el.fontFamily || DEFAULT_FONT,
                            whiteSpace: 'nowrap',
                            padding: '0 8px',
                            outline: 'none',
                            borderRadius: 4,
                            WebkitTextStroke: el.strokeColor
                              ? `${el.strokeWidth ?? 2}px ${el.strokeColor}`
                              : undefined,
                            paintOrder: el.strokeColor ? 'stroke fill' : undefined,
                            background:
                              selectedId === el.id && sidebarTab === 'design'
                                ? 'rgba(250,204,21,0.25)'
                                : 'transparent',
                            cursor:
                              selectedId === el.id && sidebarTab === 'design'
                                ? 'text'
                                : 'inherit',
                          }}
                          contentEditable={
                            selectedId === el.id && sidebarTab === 'design'
                              ? true
                              : false
                          }
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            updateEl(el.id, { text: e.currentTarget.innerText })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.currentTarget.blur();
                            }
                          }}
                        >
                          {el.text}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Link rects */}
                  {rects.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        position: 'absolute',
                        left: r.x,
                        top: r.y,
                        width: r.w,
                        height: r.h,
                        border:
                          r.borderColor === ''
                            ? 'none'
                            : `2px solid ${r.borderColor ?? '#52525b'}`,
                        background: r.bgColor ?? 'transparent',
                        zIndex: 40,
                        overflow: 'hidden',
                      }}
                    >
                      <span
                        style={{
                          display: showGuides ? 'block' : 'none',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          background: '#52525b',
                          color: '#fff',
                          fontSize: 8,
                          padding: '1px 4px',
                          fontWeight: 700,
                          zIndex: 1,
                        }}
                      >
                        LINK
                      </span>
                      {r.label && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top:
                              (r.labelY != null ? r.labelY - r.y : Math.round(r.h * LABEL_Y_RATIO)) -
                              (r.labelBg || r.labelBorderColor ? (r.labelPadY ?? 7) : 0),
                            display: 'flex',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                            userSelect: 'none',
                          }}
                        >
                          <span
                            style={{
                              fontSize: r.labelFontSize ?? 15,
                              lineHeight: `${r.labelFontSize ?? 15}px`,
                              fontWeight: r.labelFontWeight ?? 300,
                              fontFamily: labelFont,
                              color: r.labelColor || '#333333',
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                              boxSizing: 'border-box',
                              width: r.labelPillW,
                              background: r.labelBg || 'transparent',
                              border: r.labelBorderColor
                                ? `1.5px solid ${r.labelBorderColor}`
                                : 'none',
                              borderRadius:
                                r.labelBg || r.labelBorderColor ? 999 : 0,
                              padding:
                                r.labelBg || r.labelBorderColor
                                  ? `${r.labelPadY ?? 7}px ${r.labelPadX ?? 14}px`
                                  : 0,
                            }}
                          >
                            {r.label}
                          </span>
                        </span>
                      )}
                    </div>
                  ))}

                  {previewRect && (
                    <div
                      style={{
                        position: 'absolute',
                        left: previewRect.x,
                        top: previewRect.y,
                        width: previewRect.w,
                        height: previewRect.h,
                        border: '2px solid #18181b',
                        background: 'rgba(0,0,0,0.08)',
                        zIndex: 40,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
                {bgImage && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 6,
                      zIndex: 60,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setBgScale((s) => Math.min(250, s + 10))}
                      disabled={bgScale >= 250}
                      title="배경 확대"
                      aria-label={`배경 확대 (현재 ${bgScale}%)`}
                      className="bg-black/50 hover:bg-black/70 disabled:opacity-40 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgScale((s) => Math.max(100, s - 10))}
                      disabled={bgScale <= 100}
                      title="배경 축소"
                      aria-label={`배경 축소 (현재 ${bgScale}%)`}
                      className="bg-black/50 hover:bg-black/70 disabled:opacity-40 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgRotation((r) => (r + 90) % 360)}
                      title="배경 90도 회전"
                      aria-label={`배경 90도 회전 (현재 ${bgRotation}도)`}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      &#8635;
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 px-1 text-[11px] text-gray-500 leading-relaxed">{previewMode === 'screen' ? '1920px 화면에서 배경을 원본 크기로 중앙 정렬했을 때의 예시입니다. 양옆은 잘리고, 저장 파일은 전체 크기를 유지합니다.' : '저장되는 전체 배경을 같은 비율로 축소한 보기입니다. 실제 블로그는 화면 폭에 따라 양옆이 잘립니다.'}</p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={undo}
                disabled={history.length === 0}
                aria-label="되돌리기"
                title="되돌리기 (Ctrl+Z)"
                className={`flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl font-bold text-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                  history.length === 0
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                <Undo2 className="w-4 h-4" /> 되돌리기
              </button>
              <button
                onClick={downloadSkin}
                disabled={isDownloadingSkin}
                aria-busy={isDownloadingSkin}
                aria-label="블로그 스킨 이미지 다운로드"
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1 ${
                  isDownloadingSkin
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#111111] hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {isDownloadingSkin ? (
                  <span className="animate-pulse">이미지 생성 중...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> 이미지 다운로드
                  </>
                )}
              </button>
              <button
                onClick={() => setShowGuide(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-[#111111] hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1"
              >
                <BookOpen className="w-4 h-4" /> 블로그에 적용하기
              </button>
            </div>

            {/* 썸네일 메이커 연결 CTA */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">
                이 디자인 그대로 썸네일도 만들 수 있습니다
              </p>
              <Link
                href="/"
                className="text-sm font-semibold text-gray-900 underline underline-offset-2"
              >
                썸네일 메이커 사용하기 →
              </Link>
            </div>

            {/* 블로그 성장 팁 */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowGrowthTips((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-sm font-semibold text-gray-600"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> 블로그 성장 팁
                </span>
                {showGrowthTips ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {showGrowthTips && (
                <div className="bg-white px-2 py-1.5">
                  {GROWTH_TIPS.map((tip) => (
                    <Link
                      key={tip.label}
                      href={tip.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      <span className="text-sm">{tip.emoji}</span>
                      <span className="flex-1">{tip.label}</span>
                      <ExternalLink
                        size={10}
                        className="text-gray-300 flex-shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Code Modal ── */}
        {showCode && (
          <div style={overlay}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label="네이버 블로그 위젯 코드"
              style={{
                background: '#fff',
                borderRadius: 24,
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              }}
            >
              <div
                style={{
                  background: '#0f172a',
                  padding: '24px 28px',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      fontStyle: 'italic',
                    }}
                  >
                    {widgets.length ? '위젯 코드 준비 완료' : '메뉴를 먼저 만들어 주세요'}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                    공백 위젯은 윗줄, 메뉴 위젯은 바로 아랫줄에 순서대로 등록하세요.
                  </div>
                </div>
                <button
                  onClick={() => setShowCode(false)}
                  aria-label="닫기"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ padding: 24, overflowY: 'auto' }}>
                {widgets.length === 0 && <p className="mb-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">아직 메뉴가 없습니다. [링크] 탭의 [글 예시 적용]으로 메뉴 5칸을 먼저 만들어 주세요.</p>}
                {!blogId && rects.some((r) => !r.newWindow && !parseCategoryUrl(r.categoryUrl ?? '')) && (
                  <div
                    style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid #fcd34d',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    전체 주소를 붙이지 않은 메뉴는 [링크] 탭에서 블로그 ID와 카테고리 번호를 입력하세요.
                    코드에 ‘여기에 이동할 링크 주소 붙여넣기’가 남아 있다면 등록 전에 실제 주소로 바꿔 주세요.
                  </div>
                )}
                <button
                  disabled={widgets.length === 0}
                  onClick={() =>
                    showToast(
                      copyText(allCode)
                        ? '전체 코드가 복사되었습니다'
                        : '복사 실패 - 직접 드래그해 복사하세요'
                    )
                  }
                  style={btnStyle('#18181b', '#fff', true, 'none', 12, 13)}
                >
                  <Code size={14} /> 전체 코드 보관용 복사
                </button>
                <p
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    lineHeight: 1.6,
                    margin: '12px 0 0',
                  }}
                >
                  네이버 블로그 [관리]-[꾸미기설정]-[디자인설정]-[레이아웃·위젯
                  설정]-[위젯 직접등록]에서 위젯 이름을 정하고 이 코드를
                  붙여넣으세요.
                  <br />
                  별도 이미지 업로드는 필요 없습니다. 공백 위젯을 왼쪽부터 윗줄에, 메뉴 위젯을 같은 순서로 바로 아랫줄에 놓으세요. 아래의 개별 복사 버튼으로 한 위젯씩 등록합니다. 전체 코드를 한 위젯에 모두 붙여넣지 마세요. 블로그에 따라 시작 위치를 조절해야 할 수 있습니다.
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    marginTop: 16,
                  }}
                >
                  {widgets.map((wg) => (
                    <div key={wg.label}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: '#0f172a',
                          }}
                        >
                          {wg.label}
                        </span>
                        <button
                          onClick={() =>
                            showToast(
                              copyText(wg.code)
                                ? `${wg.label} 복사됨`
                                : '복사 실패 - 직접 드래그해 복사하세요'
                            )
                          }
                          style={{
                            background: '#f4f4f5',
                            color: '#3f3f46',
                            border: 'none',
                            borderRadius: 8,
                            padding: '5px 14px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          복사
                        </button>
                      </div>
                      <pre style={codePre}>{wg.code}</pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Guide Modal ── */}
      {showGuide && (
        <div style={overlay}>
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc',
                borderRadius: '24px 24px 0 0',
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <BookOpen size={18} style={{ color: '#18181b' }} /> 홈페이지형
                블로그 적용 가이드
              </div>
              <button
                onClick={() => setShowGuide(false)}
                aria-label="닫기"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: '#94a3b8',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: 24, flex: 1 }}>
              {[
                {
                  n: 1,
                  title: '디자인 & 링크 영역 잡기',
                  steps: [
                    '[배경]·[디자인] 탭에서 대문을 만들고, [링크] 탭에서 메뉴 위치마다 클릭 영역을 드래그해 그립니다.',
                    "각 영역에 이동할 카테고리/URL을 입력합니다. 외부 링크는 '새 창으로 열기' 체크(내부 카테고리는 현재 창).",
                  ],
                },
                {
                  n: 2,
                  title: '스킨 이미지 저장',
                  steps: [
                    '[이미지 다운로드]로 스킨 이미지를 저장합니다.',
                    '제목과 메뉴가 잘리지 않는지 중앙 배치를 확인합니다. 가이드는 저장 이미지에 포함되지 않습니다.',
                  ],
                },
                {
                  n: 3,
                  title: '스킨배경 등록',
                  steps: [
                    '블로그 [관리 > 꾸미기 설정 > 세부 디자인 설정 > (리모컨) 스킨배경 > 직접등록]에 스킨 이미지를 올립니다. (와이드 대문은 타이틀이 아니라 스킨배경에 등록)',
                    '배경을 중앙 정렬하고, 넓은 화면에서도 양옆이 자연스러운지 확인합니다. 위젯용 이미지 업로드는 필요 없습니다.',
                  ],
                },
                {
                  n: 4,
                  title: '위젯 코드 생성 & 등록하기',
                  steps: [
                    '[링크] 탭에서 [글 예시 적용]을 누르면 공백 300px·메뉴 150px의 5열 배치가 됩니다. 각 메뉴에 블로그 카테고리에서 복사한 전체 주소를 붙여넣은 뒤 [코드 생성]을 누릅니다.',
                    '[레이아웃·위젯 설정 > + 위젯 직접 등록]에서 공백 위젯 5개와 메뉴 위젯 5개의 코드를 각각 등록합니다. 메뉴가 5개일 때 총 10개입니다.',
                    '공백 위젯 5개는 윗줄에, 메뉴 위젯 5개는 바로 아랫줄에 좌우 순서를 맞춰 배치합니다. 참고 글 예시는 공백 300px, 메뉴 150px입니다.',
                  ],
                },
                {
                  n: 5,
                  title: '레이아웃 정리하기',
                  steps: [
                    '상단 스킨이 넓게 보이는 레이아웃을 고르고 전체 정렬을 중앙으로 맞춥니다. 실제 메뉴와 클릭 영역이 어긋나면 [공백 높이]를 조절합니다.',
                    "[메뉴 사용 설정]에서 '타이틀' 체크를 해제하거나, [세부 디자인 설정]에서 '블로그 제목 표시'를 끕니다.",
                    '불필요한 위젯은 숨기기.',
                  ],
                },
                {
                  n: 6,
                  title: '모바일은 따로 설정하기',
                  steps: [
                    'PC 홈형 스킨(스킨배경+위젯)은 모바일 앱/웹에 적용되지 않습니다.',
                    '블로그 앱 [홈 편집]에서 커버 이미지·커버 스타일을 별도로 선택.',
                    '핵심 메뉴는 외부채널·대표글로 노출되도록 구성하세요.',
                  ],
                },
              ].map(({ n, title, steps }) => (
                <div
                  key={n}
                  style={{ display: 'flex', gap: 14, marginBottom: 24 }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: '#f4f4f5',
                      color: '#18181b',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 14,
                    }}
                  >
                    {n}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        marginBottom: 6,
                        color: '#0f172a',
                      }}
                    >
                      {title}
                    </div>
                    {steps.map((s, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: 13,
                          color: '#475569',
                          marginBottom: 4,
                          lineHeight: 1.6,
                        }}
                      >
                        {i + 1}. {s}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 8,
                    color: '#0f172a',
                  }}
                >
                  🔧 안 될 때 체크리스트
                </div>
                {[
                  '위젯이 안 보임 → 레이아웃·위젯 설정에서 위젯 체크와 위치를 다시 확인.',
                  '위젯 등록이 안 됨 → 각 위젯은 가로 170px·높이 600px 이하인지 확인.',
                  '링크가 안 열림 → 카테고리 번호와 블로그 ID 또는 전체 링크 주소를 확인.',
                  '글씨가 삐뚤거나 어긋남 → 캔버스 가로를 3000으로 키워 다시 [이미지 다운로드]. (확대 export가 아닌 1:1 원본으로 나옴)',
                ].map((s, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 12,
                      color: '#475569',
                      marginBottom: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    · {s}
                  </p>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 16,
                borderTop: '1px solid #f1f5f9',
                background: '#f8fafc',
                borderRadius: '0 0 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    downloadWidget();
                  }}
                  style={btnStyle('#f1f5f9', '#374151', false, 'none', 12, 13)}
                >
                  <Download size={13} /> 투명 PNG (선택)
                </button>
                <button
                  onClick={() => {
                    setShowGuide(false);
                    setShowCode(true);
                  }}
                  style={btnStyle('#f1f5f9', '#374151', false, 'none', 12, 13)}
                >
                  <Code size={13} /> 코드 생성
                </button>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                style={btnStyle('#18181b', '#fff', true, 'none', 14, 14)}
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: '#18181b',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            padding: '11px 20px',
            borderRadius: 999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Style helpers ──────────────────────────────
const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15,23,42,0.7)',
  padding: 16,
};
const codePre: React.CSSProperties = {
  background: '#f8f8f8',
  border: '1px solid #e4e4e7',
  borderRadius: 10,
  padding: '10px 12px',
  fontSize: 11,
  fontFamily: 'monospace',
  overflowX: 'auto',
  lineHeight: 1.6,
  color: '#3f3f46',
  margin: 0,
  whiteSpace: 'pre',
};
const sectionLabel: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 10,
  fontWeight: 800,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 10,
};
const sectionBlock: React.CSSProperties = {
  marginBottom: 20,
  paddingBottom: 20,
  borderBottom: '1px solid #f1f5f9',
};
const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: '#94a3b8',
  marginBottom: 4,
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #e4e4e7',
  borderRadius: 8,
  outline: 'none',
  fontSize: 13,
  boxSizing: 'border-box',
  background: '#fff',
};
const addBtnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 14,
  background: '#fff',
  border: '2px dashed #e2e8f0',
  borderRadius: 14,
  cursor: 'pointer',
};

function btnStyle(
  bg: string,
  color: string,
  fullWidth = true,
  border = 'none',
  py = 9,
  fontSize = 11
): React.CSSProperties {
  return {
    flex: fullWidth ? undefined : 1,
    width: fullWidth ? '100%' : undefined,
    background: bg,
    color,
    border,
    borderRadius: 10,
    padding: `${py}px 12px`,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    whiteSpace: 'nowrap',
  };
}
