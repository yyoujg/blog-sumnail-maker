'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Code, Trash2, Layout, Download,
  Type, Image as ImageIcon, Sparkles, Settings2,
  BookOpen, Link as LinkIcon, ArrowLeft, TrendingUp,
  ExternalLink, ChevronDown, ChevronUp,
  AlignHorizontalJustifyCenter, Undo2,
} from 'lucide-react';
import { FONTS } from '@/lib/constants';

// ── Constants ──────────────────────────────────
const WIDGET_W = 170;
const WIDGET_GAP = 10;

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
}

type CanvasElement = TextElement | ImageElement;

interface LinkRect {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  label?: string;
  labelColor?: string;
  bgColor?: string;      // undefined = 투명
  borderColor?: string;  // undefined = 기본 (#52525b), '' = 테두리 없음
  newWindow?: boolean;   // true = 새 창(<a target=_blank>), 그 외 = 현재 창(이미지맵)
}

interface BlogTemplate {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  bg: string;
  bgImage?: string;
  bgOverlay?: number;
  bgPosition?: string;
  cw: number;
  ch: number;
  elements: CanvasElement[];
  rects: LinkRect[];
}

// ── Blog Templates ──────────────────────────────
const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: 'food',
    label: '맛집 리뷰',
    emoji: '🍜',
    desc: '맛집·카페·레시피',
    bg: '#1a1a1a',
    bgImage: '/images/260208에디션엠/에디션엠-감귤케이크-딸기음료-메인.JPG',
    bgOverlay: 30,
    bgPosition: 'center center',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '오늘의 맛집 & 베이커리 기록', x: 630, y: 135, fontSize: 44, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '매일 새로운 맛집을 찾아 솔직하게 기록합니다 🍽️', x: 680, y: 210, fontSize: 18, color: 'rgba(255,255,255,0.80)', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 515, y: 0, w: 170, h: 450, url: 'https://', label: '맛집 탐방', labelColor: '#ffffff', borderColor: '' },
      { id: 102, x: 695, y: 0, w: 170, h: 450, url: 'https://', label: '카페 기록', labelColor: '#ffffff', borderColor: '' },
      { id: 103, x: 875, y: 0, w: 170, h: 450, url: 'https://', label: '레시피', labelColor: '#ffffff', borderColor: '' },
      { id: 104, x: 1055, y: 0, w: 170, h: 450, url: 'https://', label: '배달 후기', labelColor: '#ffffff', borderColor: '' },
      { id: 105, x: 1235, y: 0, w: 170, h: 450, url: 'https://', label: '카페 투어', labelColor: '#ffffff', borderColor: '' },
    ],
  },
  {
    id: 'review',
    label: '체험단',
    emoji: '🎁',
    desc: '제품 리뷰·체험단',
    bg: '#1a1a1a',
    bgImage: '/images/260208에디션엠/에디션엠-혜화역카페-내부좌석공간.JPG',
    bgOverlay: 30,
    bgPosition: 'center 40%',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '식당 & 맛집 체험단 후기', x: 650, y: 135, fontSize: 44, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '직접 먹어보고 솔직하게 기록합니다 ✔️', x: 760, y: 210, fontSize: 18, color: 'rgba(255,255,255,0.80)', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 515, y: 0, w: 170, h: 450, url: 'https://', label: '체험단', labelColor: '#ffffff', borderColor: '' },
      { id: 102, x: 695, y: 0, w: 170, h: 450, url: 'https://', label: '뷰티·스킨', labelColor: '#ffffff', borderColor: '' },
      { id: 103, x: 875, y: 0, w: 170, h: 450, url: 'https://', label: '생활용품', labelColor: '#ffffff', borderColor: '' },
      { id: 104, x: 1055, y: 0, w: 170, h: 450, url: 'https://', label: '식품 리뷰', labelColor: '#ffffff', borderColor: '' },
      { id: 105, x: 1235, y: 0, w: 170, h: 450, url: 'https://', label: '서비스', labelColor: '#ffffff', borderColor: '' },
    ],
  },
  {
    id: 'finance',
    label: '재테크',
    emoji: '📈',
    desc: '주식·부동산·절약',
    bg: '#0a2540',
    bgImage: '/images/251231지관서가/안동북카페-지관서가-커피케이크-메뉴.JPG',
    bgOverlay: 30,
    bgPosition: 'center 35%',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '재테크 & 자기계발 기록', x: 660, y: 135, fontSize: 44, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '몸과 돈, 함께 투자하고 기록합니다 📊', x: 760, y: 210, fontSize: 16, color: '#94a3b8', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 515, y: 0, w: 170, h: 450, url: 'https://', label: '주식 투자', labelColor: '#e2e8f0', borderColor: '' },
      { id: 102, x: 695, y: 0, w: 170, h: 450, url: 'https://', label: '부동산', labelColor: '#e2e8f0', borderColor: '' },
      { id: 103, x: 875, y: 0, w: 170, h: 450, url: 'https://', label: '절약 팁', labelColor: '#e2e8f0', borderColor: '' },
      { id: 104, x: 1055, y: 0, w: 170, h: 450, url: 'https://', label: '재테크 정보', labelColor: '#e2e8f0', borderColor: '' },
      { id: 105, x: 1235, y: 0, w: 170, h: 450, url: 'https://', label: '수익 후기', labelColor: '#e2e8f0', borderColor: '' },
    ],
  },
  {
    id: 'lifestyle',
    label: '라이프스타일',
    emoji: '🌿',
    desc: '일상·여행·취미',
    bg: '#1a1a1a',
    bgImage: '/images/260317야옹이네고양이카페/IMG_8552.JPG',
    bgOverlay: 30,
    bgPosition: 'center 35%',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '나의 일상 & 취미 기록', x: 670, y: 135, fontSize: 44, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '소소하지만 특별한 하루하루를 기록합니다 ☀️', x: 720, y: 210, fontSize: 18, color: 'rgba(255,255,255,0.85)', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 515, y: 0, w: 170, h: 450, url: 'https://', label: '일상 기록', labelColor: '#ffffff', borderColor: '' },
      { id: 102, x: 695, y: 0, w: 170, h: 450, url: 'https://', label: '카페·맛집', labelColor: '#ffffff', borderColor: '' },
      { id: 103, x: 875, y: 0, w: 170, h: 450, url: 'https://', label: '여행', labelColor: '#ffffff', borderColor: '' },
      { id: 104, x: 1055, y: 0, w: 170, h: 450, url: 'https://', label: '취미·체험', labelColor: '#ffffff', borderColor: '' },
      { id: 105, x: 1235, y: 0, w: 170, h: 450, url: 'https://', label: '리뷰', labelColor: '#ffffff', borderColor: '' },
    ],
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
  return [...rects].sort((a, b) => a.x - b.x).findIndex(x => x.id === r.id) + 1;
}

function buildHTML(rects: LinkRect[], imgSrc: string): string {
  const src = imgSrc || '투명이미지주소를_입력해주세요';
  return rects.map((r, i) => {
    const head = `<!-- 위젯 칸 ${widgetNo(rects, r)}번 -->`;
    const w = Math.round(r.w);
    const h = Math.round(r.h);
    // 이미지 = 버튼: 표시 크기를 영역 크기로 강제하고 좌표를 이미지 기준 상대좌표로 → 위치 독립.
    if (r.newWindow) {
      return `${head}\n<a href="${r.url}" target="_blank"><img src="${src}" width="${w}" height="${h}" /></a>`;
    }
    return `${head}\n<img src="${src}" width="${w}" height="${h}" usemap="#map_${i}" />\n<map name="map_${i}">\n <area shape="rect" coords="0,0,${w},${h}" href="${r.url}" target="_top" />\n</map>`;
  }).join('\n\n');
}

function triggerDownload(dataUrl: string, name: string) {
  const a = document.createElement('a');
  a.href = dataUrl; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function copyText(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

const STORAGE_KEY = 'blogkit_skin_state';

// ── Component ───────────────────────────────────
export default function SkinMakerTool({ embedded = false }: { embedded?: boolean }) {
  const [cw, setCw] = useState(1920);
  const [ch, setCh] = useState(450);
  const [bg, setBg] = useState('#f5f1ee');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgOverlay, setBgOverlay] = useState(0);
  const [bgPosition, setBgPosition] = useState('center center');

  const [sidebarTab, setSidebarTab] = useState<'template' | 'design' | 'link'>('template');
  const [showCode, setShowCode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [showGrowthTips, setShowGrowthTips] = useState(false);
  const [isDownloadingSkin, setIsDownloadingSkin] = useState(false);

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [rects, setRects] = useState<LinkRect[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [previewRect, setPreviewRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const selectedEl = elements.find(e => e.id === selectedId) || null;

  // ── toast ──
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  // ── undo history (design state snapshots) ──
  const [history, setHistory] = useState<string[]>([]);
  const restoringRef = useRef(false);
  const prevSnapRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);
  const suppressHistoryRef = useRef(false); // 드래그 중 중간 단계 기록 억제

  // ── element helpers ──
  const updateEl = (id: number, patch: Partial<CanvasElement>) =>
    setElements(prev => prev.map(e => e.id === id ? { ...e, ...patch } as CanvasElement : e));

  const removeEl = (id: number) => {
    setElements(prev => prev.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveEl = (id: number, dx: number, dy: number) =>
    setElements(prev => prev.map(e => e.id === id ? { ...e, x: e.x + dx, y: e.y + dy } : e));

  // ── 가로 가운데 정렬 ──
  const centerEl = (id: number) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    let w = el.type === 'image' ? el.w : 0;
    if (el.type === 'text') {
      const node = canvasRef.current?.querySelector(`[data-elid="${id}"]`) as HTMLElement | null;
      if (node) w = node.getBoundingClientRect().width / previewScale;
    }
    updateEl(id, { x: Math.round((cw - w) / 2) });
  };
  const centerRect = (id: number) =>
    setRects(prev => prev.map(r => r.id === id ? { ...r, x: Math.round((cw - r.w) / 2) } : r));

  // 링크 영역 전체를 한 덩어리로 가로 가운데 정렬 (상대 간격 유지)
  const centerRectsGroup = () => {
    setRects(prev => {
      if (prev.length === 0) return prev;
      const minX = Math.min(...prev.map(r => r.x));
      const maxX = Math.max(...prev.map(r => r.x + r.w));
      const dx = Math.round((cw - (maxX - minX)) / 2 - minX);
      return prev.map(r => ({ ...r, x: r.x + dx }));
    });
  };

  const addText = () => {
    const id = Date.now();
    setElements(prev => [...prev, { id, type: 'text', text: '새 텍스트', x: 910, y: 300, fontSize: 30, color: '#333333', fontWeight: 'bold', fontFamily: DEFAULT_FONT }]);
    setSelectedId(id);
  };

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const id = Date.now();
      setElements(prev => [...prev, { id, type: 'image', src: ev.target?.result as string, x: 835, y: 200, w: 250, h: 250 }]);
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
    setCw(tpl.cw); setCh(tpl.ch); setBg(tpl.bg);
    setBgImage(tpl.bgImage ?? null);
    setBgOverlay(tpl.bgOverlay ?? 0);
    setBgPosition(tpl.bgPosition ?? 'center center');
    setElements(tpl.elements);
    setRects(tpl.rects);
    setSelectedId(null);
    setActiveTemplateId(tpl.id);
    centerTextOnLoadRef.current = true; // 렌더 후 타이틀/서브타이틀 가로 가운데 정렬
  };

  // 템플릿 로드 직후 텍스트 요소를 안전영역(=캔버스) 가운데로 정렬
  const centerTextOnLoadRef = useRef(false);
  useEffect(() => {
    if (!centerTextOnLoadRef.current) return;
    centerTextOnLoadRef.current = false;
    requestAnimationFrame(() => {
      elements.forEach(el => { if (el.type === 'text') centerEl(el.id); });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  // 마운트: 저장된 작업 복원, 없으면 기본 템플릿
  useEffect(() => {
    let restored = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCw(s.cw); setCh(s.ch); setBg(s.bg);
        setBgImage(s.bgImage ?? null);
        setBgOverlay(s.bgOverlay ?? 0);
        setBgPosition(s.bgPosition ?? 'center center');
        setElements(s.elements ?? []);
        setRects(s.rects ?? []);
        setImgUrl(s.imgUrl ?? '');
        setActiveTemplateId(s.activeTemplateId ?? null);
        restored = true;
      }
    } catch { /* 손상된 저장값 무시 */ }
    if (!restored) loadTemplate(BLOG_TEMPLATES[0]);
    hydratedRef.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 디자인 상태 스냅샷 (undo + 자동저장 공용)
  const designSnap = JSON.stringify({ cw, ch, bg, bgImage, bgOverlay, bgPosition, elements, rects });

  // 자동저장 + undo 히스토리 적재
  useEffect(() => {
    if (!hydratedRef.current) return;
    // undo: 복원 중이 아니면 변경 직전 스냅샷을 history에 push
    if (restoringRef.current) {
      restoringRef.current = false;
    } else if (!suppressHistoryRef.current && prevSnapRef.current !== null && prevSnapRef.current !== designSnap) {
      const prev = prevSnapRef.current;
      setHistory(h => [...h.slice(-29), prev]);
    }
    prevSnapRef.current = designSnap;
    // 자동저장
    const payload = { cw, ch, bg, bgImage, bgOverlay, bgPosition, elements, rects, imgUrl, activeTemplateId };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ponytail: bgImage data URL이 5MB 쿼터 초과 가능. 빼고 재시도, 그래도 실패하면 스킵.
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, bgImage: null })); } catch { /* 저장 스킵 */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designSnap, imgUrl, activeTemplateId]);

  const undo = () => {
    if (history.length === 0) return;
    const s = JSON.parse(history[history.length - 1]);
    restoringRef.current = true;
    setCw(s.cw); setCh(s.ch); setBg(s.bg);
    setBgImage(s.bgImage ?? null);
    setBgOverlay(s.bgOverlay ?? 0);
    setBgPosition(s.bgPosition ?? 'center center');
    setElements(s.elements ?? []);
    setRects(s.rects ?? []);
    setSelectedId(null);
    setHistory(h => h.slice(0, -1));
  };
  const undoRef = useRef(undo);
  undoRef.current = undo;

  // Ctrl/Cmd+Z 되돌리기 (입력 필드 포커스 시 제외)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable) return;
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
    const observer = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setPreviewScale(Math.min(1, w / cw));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [cw]);

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
    let px = e.clientX, py = e.clientY;
    const onMove = (me: MouseEvent) => { moveEl(id, (me.clientX - px) / previewScale, (me.clientY - py) / previewScale); px = me.clientX; py = me.clientY; };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      suppressHistoryRef.current = false;
      if (dragStartSnap !== null && dragStartSnap !== prevSnapRef.current) {
        setHistory(h => [...h.slice(-29), dragStartSnap]);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── canvas mouse ──
  const canvasPos = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / previewScale, y: (e.clientY - r.top) / previewScale };
  };
  const onCanvasDown = (e: React.MouseEvent) => {
    if (sidebarTab === 'link') {
      const p = canvasPos(e);
      setDrawing(true); setStartPos(p);
      setPreviewRect({ x: p.x, y: p.y, w: 0, h: 0 });
    } else { setSelectedId(null); }
  };
  const onCanvasMove = (e: React.MouseEvent) => {
    if (sidebarTab !== 'link' || !drawing) return;
    const p = canvasPos(e);
    setPreviewRect({ x: Math.min(startPos.x, p.x), y: Math.min(startPos.y, p.y), w: Math.abs(p.x - startPos.x), h: Math.abs(p.y - startPos.y) });
  };
  const onCanvasUp = (e: React.MouseEvent) => {
    if (sidebarTab !== 'link' || !drawing) return;
    setDrawing(false);
    const p = canvasPos(e);
    const dragW = Math.abs(p.x - startPos.x);
    const dragH = Math.abs(p.y - startPos.y);
    // new.md: 위젯 가로 170px 고정, 세로 최대 600px.
    const rect = { id: Date.now(), x: Math.min(startPos.x, p.x), y: Math.min(startPos.y, p.y), w: WIDGET_W, h: Math.min(600, Math.round(dragH)), url: 'https://' };
    if (dragW > 5 && dragH > 5) setRects(prev => [...prev, rect]);
    setPreviewRect(null);
  };

  // ── download ──
  const downloadSkin = async () => {
    setIsDownloadingSkin(true);
    try {
    await document.fonts.ready; // 커스텀/손글씨 폰트가 canvas에 반영되도록 대기
    // 고해상도 내보내기: 글씨 선명하게(레티나/와이드 화면). 네이버 스킨배경 최대 3000px 한도 내에서 배율 적용.
    const exportScale = Math.max(1, Math.min(2, 3000 / cw));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cw * exportScale); canvas.height = Math.round(ch * exportScale);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(exportScale, exportScale);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);
    if (bgImage) {
      await new Promise<void>(res => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // object-fit: cover + bgPosition
          const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
          const dw = img.naturalWidth * scale;
          const dh = img.naturalHeight * scale;
          const parts = bgPosition.split(' ');
          const hStr = parts[0] ?? 'center';
          const vStr = parts[1] ?? 'center';
          const hFrac = hStr === 'left' ? 0 : hStr === 'right' ? 1 : hStr.endsWith('%') ? parseFloat(hStr) / 100 : 0.5;
          const vFrac = vStr === 'top' ? 0 : vStr === 'bottom' ? 1 : vStr.endsWith('%') ? parseFloat(vStr) / 100 : 0.5;
          const dx = -(dw - cw) * hFrac;
          const dy = -(dh - ch) * vFrac;
          ctx.drawImage(img, dx, dy, dw, dh);
          res();
        };
        img.onerror = () => res();
        img.src = bgImage;
      });
      if (bgOverlay > 0) {
        ctx.fillStyle = `rgba(0,0,0,${bgOverlay / 100})`;
        ctx.fillRect(0, 0, cw, ch);
      }
    }
    for (const el of elements) {
      if (el.type === 'image') {
        await new Promise<void>(res => {
          const img = new Image();
          img.onload = () => { ctx.drawImage(img, el.x, el.y, el.w, el.h); res(); };
          img.src = el.src;
        });
      } else {
        ctx.font = `${el.fontWeight} ${el.fontSize}px ${el.fontFamily || DEFAULT_FONT}`;
        ctx.fillStyle = el.color;
        ctx.textBaseline = 'top';
        ctx.fillText(el.text, el.x + 8, el.y);
      }
    }
    // Draw rect background, border, label
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
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
        ctx.font = `bold 20px -apple-system, sans-serif`;
        ctx.fillStyle = r.labelColor || '#333333';
        // 긴 컬럼 위젯: 메뉴 글자는 컬럼 하단(메뉴 위치)에 그림
        ctx.fillText(r.label, r.x + r.w / 2, r.y + Math.round(r.h * 0.7));
      }
    }
    triggerDownload(canvas.toDataURL('image/png'), '블로그_스킨.png');
    showToast('스킨 이미지 저장됨');
    } finally {
      setIsDownloadingSkin(false);
    }
  };

  const downloadWidget = () => {
    // 투명 위젯은 컬럼 1칸 = 가로 170px 고정 × 캔버스(대문) 높이. 투명이라 각 코드의 width/height로 손실 없이 스케일됨.
    const h = Math.min(600, ch); // 위젯 세로 최대 600
    const canvas = document.createElement('canvas');
    canvas.width = WIDGET_W; canvas.height = h;
    triggerDownload(canvas.toDataURL('image/png'), `투명위젯_${WIDGET_W}x${h}.png`);
  };

  // ── render ──
  return (
    <div className={`font-sans text-gray-800 ${embedded ? '' : 'min-h-screen bg-[#f5f5f0] py-8 px-4 md:px-8'}`}>
      <div className={embedded ? '' : 'max-w-6xl mx-auto'}>

      {!embedded && (
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition mb-6">
          <ArrowLeft size={12} /> 홈으로
        </Link>
      )}

      {/* 스타일 선택 탭 */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">스타일 선택</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {BLOG_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => { loadTemplate(tpl); setSidebarTab('design'); }}
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
            onClick={() => { setElements([]); setRects([]); setActiveTemplateId(null); try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ } }}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
          >
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
            {([
              { id: 'template' as const, label: '배경', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'design' as const, label: '디자인', icon: <Settings2 className="w-4 h-4" /> },
              { id: 'link' as const, label: '링크', icon: <LinkIcon className="w-4 h-4" /> },
            ]).map((tab) => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">배경 크기</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([['가로', cw, setCw, 600, 3000], ['세로', ch, setCh, 200, 600]] as [string, number, (v: number) => void, number, number][]).map(([label, val, setter, min, max]) => (
                      <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-gray-500">
                        <div className="text-xs font-semibold text-gray-400 mb-1">{label} (px)</div>
                        <input type="number" value={val} min={min} max={max} step={10}
                          aria-label={`배경 ${label} 크기 (px)`}
                          onChange={e => setter(Math.max(min, Math.min(max, +e.target.value || val)))}
                          className="bg-transparent border-none outline-none font-bold text-sm w-full text-gray-700" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">배경 색상</label>
                  <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer p-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지</label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">
                    {bgImage ? (
                      <>
                        <img src={bgImage} alt="배경 미리보기" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <span className="relative z-10 bg-white/80 px-3 py-1 rounded text-sm font-medium text-gray-700">이미지 변경</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">클릭하여 이미지 업로드</span>
                    )}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadBgImage(f); e.target.value = ''; }} />
                  </label>
                  {bgImage && (
                    <button type="button" onClick={() => setBgImage(null)}
                      className="mt-2 w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg py-1.5 transition">
                      이미지 제거
                    </button>
                  )}
                </div>
                {bgImage && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">어둡게 ({bgOverlay}%)</label>
                      <input type="range" min={0} max={80} value={bgOverlay}
                        aria-label="배경 어둡게 정도"
                        onChange={e => setBgOverlay(+e.target.value)}
                        className="w-full cursor-pointer accent-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">위치</label>
                      <div className="grid grid-cols-3 gap-1 w-fit">
                        {(['top', 'center', 'bottom'] as const).map((v) =>
                          (['left', 'center', 'right'] as const).map((h) => {
                            const value = `${h} ${v}`;
                            const isActive = bgPosition === value;
                            const dotPos = {
                              'top-left': 'items-start justify-start',
                              'top-center': 'items-start justify-center',
                              'top-right': 'items-start justify-end',
                              'center-left': 'items-center justify-start',
                              'center-center': 'items-center justify-center',
                              'center-right': 'items-center justify-end',
                              'bottom-left': 'items-end justify-start',
                              'bottom-center': 'items-end justify-center',
                              'bottom-right': 'items-end justify-end',
                            }[`${v}-${h}`];
                            const posLabel = `${v === 'top' ? '상단' : v === 'center' ? '중간' : '하단'} ${h === 'left' ? '왼쪽' : h === 'center' ? '가운데' : '오른쪽'}`;
                            return (
                              <button
                                key={`${v}-${h}`}
                                type="button"
                                title={posLabel}
                                aria-label={`배경 이미지 위치 ${posLabel}`}
                                aria-pressed={isActive}
                                onClick={() => setBgPosition(value)}
                                className={`w-9 h-9 rounded border flex p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1 ${
                                  isActive ? 'bg-[#111111] border-[#111111]' : 'bg-white border-gray-200 hover:border-gray-400'
                                }`}
                              >
                                <span className={`flex w-full h-full ${dotPos}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* 디자인 탭 */}
            {sidebarTab === 'design' && (
              <>
                {selectedEl && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">선택한 요소 수정</p>
                    {selectedEl.type === 'text' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">텍스트</label>
                          <input value={selectedEl.text} onChange={e => updateEl(selectedEl.id, { text: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">글자 크기</label>
                            <input type="number" value={selectedEl.fontSize} onChange={e => updateEl(selectedEl.id, { fontSize: parseInt(e.target.value) || 12 })}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">색상</label>
                            <input type="color" value={selectedEl.color} onChange={e => updateEl(selectedEl.id, { color: e.target.value })}
                              className="w-full h-[38px] rounded-lg border border-gray-300 cursor-pointer p-1" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">폰트</label>
                          <select value={selectedEl.fontFamily || DEFAULT_FONT}
                            onChange={e => updateEl(selectedEl.id, { fontFamily: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-500 bg-white">
                            {FONTS.map(f => (
                              <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    {selectedEl.type === 'image' && (
                      <div>
                        <label className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                          <span>크기 조절 (너비)</span>
                          <span className="tabular-nums text-gray-400">{selectedEl.w}px</span>
                        </label>
                        <input type="range" min="50" max="1000" value={selectedEl.w}
                          aria-label="이미지 너비 조절"
                          onChange={e => { const w = +e.target.value; updateEl(selectedEl.id, { w, h: Math.round(w * selectedEl.h / selectedEl.w) }); }}
                          className="w-full accent-gray-800" />
                      </div>
                    )}
                    <button onClick={() => centerEl(selectedEl.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:border-gray-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500">
                      <AlignHorizontalJustifyCenter size={13} /> 가로 가운데 정렬
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">요소 추가</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition">
                      <ImageIcon className="w-5 h-5 text-gray-400 mb-1.5" />
                      <span className="text-xs font-semibold text-gray-500">사진 추가</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) addImage(e.target.files[0]); }} />
                    </label>
                    <button onClick={addText} className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition">
                      <Type className="w-5 h-5 text-gray-400 mb-1.5" />
                      <span className="text-xs font-semibold text-gray-500">글자 추가</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">추가한 요소들</label>
                  {elements.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4 italic">템플릿을 선택하거나 요소를 추가하세요</p>
                  ) : (
                    <div className="space-y-1.5">
                      {elements.map((el, i) => (
                        <div key={el.id} onClick={() => setSelectedId(el.id)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border transition ${
                            selectedId === el.id ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-300'
                          }`}>
                          <span className="text-xs text-gray-300 font-bold w-4">{i + 1}</span>
                          <div className="bg-gray-100 text-gray-400 rounded p-1 flex-shrink-0">
                            {el.type === 'image' ? <ImageIcon size={11} /> : <Type size={11} />}
                          </div>
                          <span className="text-xs font-semibold text-gray-600 flex-1 truncate">
                            {el.type === 'image' ? '이미지' : el.text}
                          </span>
                          <button onClick={e => { e.stopPropagation(); removeEl(el.id); }}
                            aria-label="요소 삭제"
                            className="text-gray-300 hover:text-red-400 transition p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded">
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
                  <p className="text-xs font-bold text-green-800 mb-1">💡 카테고리 버튼에 링크 연결하기</p>
                  <p className="text-xs text-green-700 leading-relaxed">캔버스 위에서 드래그해 클릭 영역을 그리고, 아래에서 URL을 입력하세요.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">투명 위젯 이미지 주소</label>
                  <input value={imgUrl} onChange={e => setImgUrl(e.target.value)}
                    placeholder="https://postfiles.pstatic.net/..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-gray-500 outline-none" />
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">* 투명 위젯을 비공개 글로 올린 뒤 이미지 주소를 복사해 붙여넣으세요.</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">연결한 링크 목록 ({rects.length})</label>
                    {rects.length > 0 && (
                      <button onClick={centerRectsGroup}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg px-2 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500">
                        <AlignHorizontalJustifyCenter size={12} /> 전체 가운데 정렬
                      </button>
                    )}
                  </div>
                  {rects.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4 italic">캔버스에서 드래그해 클릭 영역을 만드세요</p>
                  ) : (
                    <div className="space-y-2">
                      {rects.map(r => (
                        <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold bg-gray-200 text-gray-700 rounded px-2 py-0.5">
                              위젯 칸 {widgetNo(rects, r)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => centerRect(r.id)}
                                aria-label="가로 가운데 정렬" title="가로 가운데 정렬"
                                className="text-gray-300 hover:text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded">
                                <AlignHorizontalJustifyCenter size={13} />
                              </button>
                              <button onClick={() => setRects(prev => prev.filter(x => x.id !== r.id))}
                                aria-label="링크 영역 삭제"
                                className="text-gray-300 hover:text-red-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                              <input value={r.label ?? ''} onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, label: e.target.value } : x))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-1.5"
                            placeholder="버튼 텍스트 (예: 맛집 탐방)" />
                          <input value={r.url} onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, url: e.target.value } : x))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-2"
                            placeholder="이동할 URL 입력" />
                          {/* 크기 — 네이버 위젯은 가로 170px 고정, 세로 최대 600px */}
                          <div className="grid grid-cols-2 gap-1.5 mb-2">
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold mb-1">너비 (px)</p>
                              <input type="text" value="170 (고정)" readOnly tabIndex={-1}
                                aria-label="링크 영역 너비 (170px 고정)"
                                className="w-full p-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-400 outline-none cursor-not-allowed" />
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold mb-1">높이 (px)</p>
                              <input type="number" min={5} max={600} value={Math.round(r.h)}
                                aria-label="링크 영역 높이"
                                onChange={e => { const v = Math.max(5, Math.min(600, +e.target.value || 5)); setRects(prev => prev.map(x => x.id === r.id ? { ...x, h: v } : x)); }}
                                className="w-full p-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500" />
                            </div>
                          </div>
                          {/* 색상 */}
                          <div className="grid grid-cols-3 gap-1.5">
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold mb-1">글자색</p>
                              <input type="color"
                                value={r.labelColor || '#333333'}
                                onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, labelColor: e.target.value } : x))}
                                className="w-full h-7 rounded border border-gray-200 cursor-pointer p-0.5"
                              />
                            </div>
                            <div>
                              <label className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-1 cursor-pointer">
                                <input type="checkbox"
                                  checked={!!r.bgColor}
                                  onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, bgColor: e.target.checked ? '#ffffff' : undefined } : x))}
                                  className="w-2.5 h-2.5"
                                />
                                배경색
                              </label>
                              <input type="color"
                                value={r.bgColor || '#ffffff'}
                                onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, bgColor: e.target.value } : x))}
                                disabled={!r.bgColor}
                                className="w-full h-7 rounded border border-gray-200 cursor-pointer p-0.5 disabled:opacity-30"
                              />
                            </div>
                            <div>
                              <label className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold mb-1 cursor-pointer">
                                <input type="checkbox"
                                  checked={r.borderColor !== ''}
                                  onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, borderColor: e.target.checked ? (x.borderColor || '#52525b') : '' } : x))}
                                  className="w-2.5 h-2.5"
                                />
                                테두리
                              </label>
                              <input type="color"
                                value={r.borderColor || '#52525b'}
                                onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, borderColor: e.target.value } : x))}
                                disabled={r.borderColor === ''}
                                className="w-full h-7 rounded border border-gray-200 cursor-pointer p-0.5 disabled:opacity-30"
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold mt-2 cursor-pointer">
                            <input type="checkbox"
                              checked={!!r.newWindow}
                              onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, newWindow: e.target.checked } : x))}
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
              미리보기 ({cw}×{ch})
              {sidebarTab === 'link' && (
                <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">드래그로 링크 영역 그리기</span>
              )}
            </h3>
            <div ref={previewWrapperRef} style={{ width: '100%', height: ch * previewScale, overflow: 'hidden', borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <div
                ref={canvasRef}
                style={{ position: 'relative', width: cw, height: ch, backgroundColor: bg, backgroundImage: bgImage ? `url('${bgImage}')` : 'none', backgroundSize: 'cover', backgroundPosition: bgPosition, flexShrink: 0, cursor: sidebarTab === 'link' ? 'crosshair' : 'default', transform: `scale(${previewScale})`, transformOrigin: 'top left' }}
                onMouseDown={onCanvasDown}
                onMouseMove={onCanvasMove}
                onMouseUp={onCanvasUp}
              >
                {/* BG overlay */}
                {bgImage && bgOverlay > 0 && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0,0,0,${bgOverlay / 100})`, pointerEvents: 'none', zIndex: 1 }} />
                )}
                {/* 위젯 칸 가이드 — 한 줄 5칸(가로 170px·간격 10px) 가운데 정렬 */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', gap: WIDGET_GAP, pointerEvents: 'none', opacity: 0.3, zIndex: 2 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{ width: WIDGET_W, height: '100%', border: '1px dashed #18181b', flexShrink: 0 }} />
                  ))}
                </div>
                {/* 안전 영역 가이드 (가운데 ~966px) */}
                {cw >= 966 && (
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: (cw - 966) / 2, width: 966, borderLeft: '2px dashed #2563eb', borderRight: '2px dashed #2563eb', pointerEvents: 'none', zIndex: 2, opacity: 0.45 }}>
                    <span style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>안전 영역 ~966px</span>
                  </div>
                )}

                {/* Empty state */}
                {elements.length === 0 && sidebarTab !== 'link' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, pointerEvents: 'none' }}>
                    <div style={{ fontSize: 36 }}>🎨</div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8' }}>위에서 블로그 유형을 선택하세요</p>
                  </div>
                )}
                {sidebarTab === 'link' && rects.length === 0 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, pointerEvents: 'none', zIndex: 41 }}>
                    <div style={{ fontSize: 30 }}>🖱️</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#2563eb', background: 'rgba(255,255,255,0.85)', padding: '6px 14px', borderRadius: 8 }}>메뉴 위치를 드래그해 클릭 영역을 그리세요</p>
                  </div>
                )}

                {/* Elements */}
                {elements.map(el => (
                  <div
                    key={el.id}
                    data-elid={el.id}
                    style={{
                      position: 'absolute', left: el.x, top: el.y, zIndex: selectedId === el.id ? 50 : 10,
                      cursor: sidebarTab !== 'link' ? 'move' : 'default',
                      outline: selectedId === el.id ? '2px solid #18181b' : 'none',
                      outlineOffset: 4, userSelect: 'none',
                    }}
                    onClick={e => { if (sidebarTab !== 'link') { e.stopPropagation(); setSelectedId(el.id); } }}
                    onMouseDown={e => startDrag(e, el.id)}
                  >
                    {el.type === 'image' ? (
                      <img src={el.src} width={el.w} height={el.h} style={{ display: 'block', pointerEvents: 'none' }} alt="" />
                    ) : (
                      <div
                        style={{ fontSize: el.fontSize, color: el.color, fontWeight: el.fontWeight, fontFamily: el.fontFamily || DEFAULT_FONT, whiteSpace: 'nowrap', padding: '0 8px', outline: 'none', borderRadius: 4, background: (selectedId === el.id && sidebarTab === 'design') ? 'rgba(250,204,21,0.25)' : 'transparent', cursor: (selectedId === el.id && sidebarTab === 'design') ? 'text' : 'inherit' }}
                        contentEditable={selectedId === el.id && sidebarTab === 'design' ? true : false}
                        suppressContentEditableWarning
                        onBlur={e => updateEl(el.id, { text: e.currentTarget.innerText })}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                      >
                        {el.text}
                      </div>
                    )}
                  </div>
                ))}

                {/* Link rects */}
                {rects.map(r => (
                  <div key={r.id} style={{
                    position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h,
                    border: r.borderColor === '' ? 'none' : `2px solid ${r.borderColor ?? '#52525b'}`,
                    background: r.bgColor ?? 'rgba(0,0,0,0.04)',
                    zIndex: 40, overflow: 'hidden',
                  }}>
                    <span style={{ position: 'absolute', top: 0, left: 0, background: '#52525b', color: '#fff', fontSize: 8, padding: '1px 4px', fontWeight: 700, zIndex: 1 }}>LINK</span>
                    {r.label && (
                      <span style={{ position: 'absolute', left: 0, right: 0, top: Math.round(r.h * 0.68), display: 'flex', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: r.labelColor || '#333333', pointerEvents: 'none', userSelect: 'none' }}>{r.label}</span>
                    )}
                  </div>
                ))}

                {previewRect && (
                  <div style={{ position: 'absolute', left: previewRect.x, top: previewRect.y, width: previewRect.w, height: previewRect.h, border: '2px solid #18181b', background: 'rgba(0,0,0,0.08)', zIndex: 40, pointerEvents: 'none' }} />
                )}
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 mb-4">
            <button onClick={undo}
              disabled={history.length === 0}
              aria-label="되돌리기"
              title="되돌리기 (Ctrl+Z)"
              className={`flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl font-bold text-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                history.length === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-gray-500 hover:bg-gray-50'
              }`}>
              <Undo2 className="w-4 h-4" /> 되돌리기
            </button>
            <button onClick={downloadSkin}
              disabled={isDownloadingSkin}
              aria-busy={isDownloadingSkin}
              aria-label="블로그 스킨 이미지 다운로드"
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1 ${
                isDownloadingSkin
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#111111] hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5'
              }`}>
              {isDownloadingSkin ? (
                <span className="animate-pulse">이미지 생성 중...</span>
              ) : (
                <><Download className="w-4 h-4" /> 이미지 다운로드</>
              )}
            </button>
            <button onClick={() => setShowGuide(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-[#111111] hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1">
              <BookOpen className="w-4 h-4" /> 블로그에 적용하기
            </button>
          </div>

          {/* 썸네일 메이커 연결 CTA */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">이 디자인 그대로 썸네일도 만들 수 있습니다</p>
            <Link href="/" className="text-sm font-semibold text-gray-900 underline underline-offset-2">
              썸네일 메이커 사용하기 →
            </Link>
          </div>

          {/* 블로그 성장 팁 */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <button onClick={() => setShowGrowthTips(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-sm font-semibold text-gray-600">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 블로그 성장 팁</span>
              {showGrowthTips ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {showGrowthTips && (
              <div className="bg-white px-2 py-1.5">
                {GROWTH_TIPS.map((tip) => (
                  <Link key={tip.label} href={tip.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                    <span className="text-sm">{tip.emoji}</span>
                    <span className="flex-1">{tip.label}</span>
                    <ExternalLink size={10} className="text-gray-300 flex-shrink-0" />
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
          <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ background: '#0f172a', padding: '24px 28px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, fontStyle: 'italic' }}>DONE!</div>
                <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>네이버 블로그 위젯 설정에 이 코드를 복사해 넣으세요.</div>
              </div>
              <button onClick={() => setShowCode(false)} aria-label="닫기" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 24, overflowY: 'auto' }}>
              {!imgUrl && <div style={{ background: '#f4f4f5', color: '#52525b', border: '1px solid #d4d4d8', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>⚠️ [링크] 탭에서 투명 이미지 주소를 입력하지 않았습니다.</div>}
              <pre style={{ background: '#f8f8f8', border: '1px solid #e4e4e7', borderRadius: 12, padding: 16, fontSize: 11, fontFamily: 'monospace', overflowX: 'auto', maxHeight: 280, lineHeight: 1.6, color: '#3f3f46' }}>
                {buildHTML(rects, imgUrl)}
              </pre>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => showToast(copyText(buildHTML(rects, imgUrl)) ? '복사되었습니다' : '복사 실패 - 직접 드래그해 복사하세요')} style={btnStyle('#18181b', '#fff', false, 'none', 14, 14)}>전체 코드 복사하기</button>
                <button onClick={() => setShowCode(false)} style={btnStyle('#f4f4f5', '#3f3f46', false, 'none', 14, 12)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* ── Guide Modal ── */}
      {showGuide && (
        <div style={overlay}>
          <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 640, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '24px 24px 0 0' }}>
              <div style={{ fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} style={{ color: '#18181b' }} /> 홈페이지형 블로그 적용 가이드
              </div>
              <button onClick={() => setShowGuide(false)} aria-label="닫기" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 24, flex: 1 }}>
              {[
                { n: 1, title: '디자인 & 링크 영역 잡기', steps: ['[배경]·[디자인] 탭에서 대문을 만들고, [링크] 탭에서 메뉴 위치마다 클릭 영역을 드래그해 그립니다.', "각 영역에 이동할 카테고리/URL을 입력합니다. 외부 링크는 '새 창으로 열기' 체크(내부 카테고리는 현재 창)."] },
                { n: 2, title: '스킨 이미지 & 투명 위젯 저장', steps: ['[이미지 다운로드]로 스킨 이미지를 저장합니다.', '아래 [투명 위젯 다운로드]로 투명 위젯 PNG도 받습니다.'] },
                { n: 3, title: '스킨배경 등록 & 위젯 이미지 주소 따기', steps: ['블로그 [관리 > 꾸미기 설정 > 세부 디자인 설정 > (리모컨) 스킨배경 > 직접등록]에 스킨 이미지를 올립니다. (와이드 대문은 타이틀이 아니라 스킨배경에 등록)', '투명 위젯 PNG를 비공개 글로 올린 뒤, 우클릭 → 이미지 주소 복사.'] },
                { n: 4, title: '위젯 코드 생성 & 등록하기', steps: ['[링크] 탭에 투명 이미지 주소를 넣고 [코드 생성].', '[레이아웃·위젯 설정 > + 위젯 직접 등록]에서 위젯명(투명1~5)과 칸별 코드를 나눠 등록.', '코드는 각 메뉴(영역) 크기에 맞춰 생성되어, 위젯을 메뉴 그림 위에 올리면 위치에 상관없이 클릭 영역이 맞습니다.'] },
                { n: 5, title: '레이아웃 정리하기 ⭐', steps: ['1단 레이아웃 선택(전체정렬 중앙·글 영역 넓게), 투명 위젯을 타이틀 바로 아래 가로 1줄로 배치.', "[메뉴 사용 설정]에서 '타이틀' 체크를 해제하거나, [세부 디자인 설정]에서 '블로그 제목 표시'를 끕니다.", '불필요한 위젯은 숨기기.'] },
                { n: 6, title: '모바일은 따로 설정하기 📱', steps: ['PC 홈형 스킨(스킨배경+위젯)은 모바일 앱/웹에 적용되지 않습니다.', '블로그 앱 [홈 편집]에서 커버 이미지·커버 스타일을 별도로 선택.', '핵심 메뉴는 외부채널·대표글로 노출되도록 구성하세요.'] },
              ].map(({ n, title, steps }) => (
                <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f4f4f5', color: '#18181b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>{n}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#0f172a' }}>{title}</div>
                    {steps.map((s, i) => <p key={i} style={{ fontSize: 13, color: '#475569', marginBottom: 4, lineHeight: 1.6 }}>{i + 1}. {s}</p>)}
                  </div>
                </div>
              ))}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#0f172a' }}>🔧 안 될 때 체크리스트</div>
                {[
                  '위젯이 안 보임 → 레이아웃·위젯 설정에서 위젯 체크와 위치를 다시 확인.',
                  '"이미지 정보가 올바르지 않습니다" → 투명 이미지의 절대 URL을 다시 정확히 복사.',
                  '이미지가 안 뜸 → http가 아닌 https 주소를 사용 (혼합 콘텐츠 차단).',
                ].map((s, i) => <p key={i} style={{ fontSize: 12, color: '#475569', marginBottom: 4, lineHeight: 1.6 }}>· {s}</p>)}
              </div>
            </div>
            <div style={{ padding: 16, borderTop: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '0 0 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { downloadWidget(); }} style={btnStyle('#f1f5f9', '#374151', false, 'none', 12, 13)}>
                  <Download size={13} /> 투명 위젯 다운로드
                </button>
                <button onClick={() => { setShowGuide(false); setShowCode(true); }} style={btnStyle('#f1f5f9', '#374151', false, 'none', 12, 13)}>
                  <Code size={13} /> 코드 생성
                </button>
              </div>
              <button onClick={() => setShowGuide(false)} style={btnStyle('#18181b', '#fff', true, 'none', 14, 14)}>확인했습니다</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div role="status" aria-live="polite"
          style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#18181b', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 20px', borderRadius: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Style helpers ──────────────────────────────
const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 100,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(15,23,42,0.7)', padding: 16,
};
const sectionLabel: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
  fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em',
  marginBottom: 10,
};
const sectionBlock: React.CSSProperties = {
  marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9',
};
const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 4,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #e4e4e7', borderRadius: 8,
  outline: 'none', fontSize: 13, boxSizing: 'border-box', background: '#fff',
};
const addBtnStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  padding: 14, background: '#fff', border: '2px dashed #e2e8f0', borderRadius: 14,
  cursor: 'pointer',
};

function btnStyle(bg: string, color: string, fullWidth = true, border = 'none', py = 9, fontSize = 11): React.CSSProperties {
  return {
    flex: fullWidth ? undefined : 1,
    width: fullWidth ? '100%' : undefined,
    background: bg, color, border, borderRadius: 10,
    padding: `${py}px 12px`, cursor: 'pointer', fontWeight: 700,
    fontSize, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    whiteSpace: 'nowrap',
  };
}
