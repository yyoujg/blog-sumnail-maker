'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Code, Trash2, Layout, Download,
  Type, Image as ImageIcon, Sparkles, Settings2,
  BookOpen, Link as LinkIcon, ArrowLeft, TrendingUp,
  ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react';

// ── Constants ──────────────────────────────────
const WIDGET_W = 170;
const WIDGET_GAP = 5;

interface TextElement {
  id: number;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
}

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
    bgImage: '/images/250118코르크베이크바/IMG_7578.JPG',
    bgOverlay: 40,
    bgPosition: 'center center',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '오늘의 맛집 & 베이커리 기록', x: 630, y: 135, fontSize: 52, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '매일 새로운 맛집을 찾아 솔직하게 기록합니다 🍽️', x: 680, y: 210, fontSize: 18, color: 'rgba(255,255,255,0.80)', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 525, y: 360, w: 170, h: 60, url: 'https://', label: '맛집 탐방', labelColor: '#ffffff' },
      { id: 102, x: 700, y: 360, w: 170, h: 60, url: 'https://', label: '카페 기록', labelColor: '#ffffff' },
      { id: 103, x: 875, y: 360, w: 170, h: 60, url: 'https://', label: '레시피', labelColor: '#ffffff' },
      { id: 104, x: 1050, y: 360, w: 170, h: 60, url: 'https://', label: '배달 후기', labelColor: '#ffffff' },
      { id: 105, x: 1225, y: 360, w: 170, h: 60, url: 'https://', label: '카페 투어', labelColor: '#ffffff' },
    ],
  },
  {
    id: 'review',
    label: '체험단',
    emoji: '🎁',
    desc: '제품 리뷰·체험단',
    bg: '#1a1a1a',
    bgImage: '/images/251116애플하우스/IMG_6829.JPG',
    bgOverlay: 50,
    bgPosition: 'center center',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '식당 & 맛집 체험단 후기', x: 650, y: 135, fontSize: 52, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '직접 먹어보고 솔직하게 기록합니다 ✔️', x: 760, y: 210, fontSize: 18, color: 'rgba(255,255,255,0.80)', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 525, y: 360, w: 170, h: 60, url: 'https://', label: '체험단', labelColor: '#ffffff' },
      { id: 102, x: 700, y: 360, w: 170, h: 60, url: 'https://', label: '뷰티·스킨', labelColor: '#ffffff' },
      { id: 103, x: 875, y: 360, w: 170, h: 60, url: 'https://', label: '생활용품', labelColor: '#ffffff' },
      { id: 104, x: 1050, y: 360, w: 170, h: 60, url: 'https://', label: '식품 리뷰', labelColor: '#ffffff' },
      { id: 105, x: 1225, y: 360, w: 170, h: 60, url: 'https://', label: '서비스', labelColor: '#ffffff' },
    ],
  },
  {
    id: 'finance',
    label: '재테크',
    emoji: '📈',
    desc: '주식·부동산·절약',
    bg: '#0a2540',
    bgImage: '/images/260313코어바디필라테스/IMG_8447.JPG',
    bgOverlay: 62,
    bgPosition: 'center 35%',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '재테크 & 자기계발 기록', x: 660, y: 135, fontSize: 52, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '몸과 돈, 함께 투자하고 기록합니다 📊', x: 760, y: 210, fontSize: 16, color: '#94a3b8', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 525, y: 360, w: 170, h: 60, url: 'https://', label: '주식 투자', labelColor: '#e2e8f0' },
      { id: 102, x: 700, y: 360, w: 170, h: 60, url: 'https://', label: '부동산', labelColor: '#e2e8f0' },
      { id: 103, x: 875, y: 360, w: 170, h: 60, url: 'https://', label: '절약 팁', labelColor: '#e2e8f0' },
      { id: 104, x: 1050, y: 360, w: 170, h: 60, url: 'https://', label: '재테크 정보', labelColor: '#e2e8f0' },
      { id: 105, x: 1225, y: 360, w: 170, h: 60, url: 'https://', label: '수익 후기', labelColor: '#e2e8f0' },
    ],
  },
  {
    id: 'lifestyle',
    label: '라이프스타일',
    emoji: '🌿',
    desc: '일상·여행·취미',
    bg: '#1a1a1a',
    bgImage: '/images/260317야옹이네고양이카페/IMG_8552.JPG',
    bgOverlay: 38,
    bgPosition: 'center 30%',
    cw: 1920, ch: 450,
    elements: [
      { id: 1, type: 'text', text: '나의 일상 & 취미 기록', x: 670, y: 135, fontSize: 52, color: '#ffffff', fontWeight: 'bold' },
      { id: 2, type: 'text', text: '소소하지만 특별한 하루하루를 기록합니다 ☀️', x: 730, y: 210, fontSize: 18, color: 'rgba(255,255,255,0.80)', fontWeight: 'normal' },
    ],
    rects: [
      { id: 101, x: 525, y: 360, w: 170, h: 60, url: 'https://', label: '일상 기록', labelColor: '#ffffff' },
      { id: 102, x: 700, y: 360, w: 170, h: 60, url: 'https://', label: '여행', labelColor: '#ffffff' },
      { id: 103, x: 875, y: 360, w: 170, h: 60, url: 'https://', label: '운동·체험', labelColor: '#ffffff' },
      { id: 104, x: 1050, y: 360, w: 170, h: 60, url: 'https://', label: '취미', labelColor: '#ffffff' },
      { id: 105, x: 1225, y: 360, w: 170, h: 60, url: 'https://', label: '맛집', labelColor: '#ffffff' },
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
function buildHTML(rects: LinkRect[], imgSrc: string): string {
  const src = imgSrc || '투명이미지주소를_입력해주세요';
  return rects.map((r, i) => {
    const x1 = Math.round(r.x % (WIDGET_W + WIDGET_GAP));
    return `<!-- 위젯 칸 ${Math.floor(r.x / (WIDGET_W + WIDGET_GAP)) + 1}번 (영역 ${i + 1}) -->\n<img src="${src}" usemap="#map_${i}" />\n<map name="map_${i}">\n <area shape="rect" coords="${x1},${Math.round(r.y)},${x1 + Math.round(r.w)},${Math.round(r.y + r.h)}" href="${r.url}" target="_top" />\n</map>`;
  }).join('\n\n');
}

function triggerDownload(dataUrl: string, name: string) {
  const a = document.createElement('a');
  a.href = dataUrl; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function copyText(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); alert('복사되었습니다!'); }
  catch { alert('직접 드래그해서 복사해주세요.'); }
  document.body.removeChild(ta);
}

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

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [rects, setRects] = useState<LinkRect[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [previewRect, setPreviewRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedEl = elements.find(e => e.id === selectedId) || null;

  // ── element helpers ──
  const updateEl = (id: number, patch: Partial<CanvasElement>) =>
    setElements(prev => prev.map(e => e.id === id ? { ...e, ...patch } as CanvasElement : e));

  const removeEl = (id: number) => {
    setElements(prev => prev.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveEl = (id: number, dx: number, dy: number) =>
    setElements(prev => prev.map(e => e.id === id ? { ...e, x: e.x + dx, y: e.y + dy } : e));

  const addText = () => {
    const id = Date.now();
    setElements(prev => [...prev, { id, type: 'text', text: '새 텍스트', x: 910, y: 300, fontSize: 30, color: '#333333', fontWeight: 'bold' }]);
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

  const loadTemplate = (tpl: BlogTemplate) => {
    setCw(tpl.cw); setCh(tpl.ch); setBg(tpl.bg);
    setBgImage(tpl.bgImage ?? null);
    setBgOverlay(tpl.bgOverlay ?? 0);
    setBgPosition(tpl.bgPosition ?? 'center center');
    setElements(tpl.elements);
    setRects(tpl.rects);
    setSelectedId(null);
    setActiveTemplateId(tpl.id);
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [activeTemplateId, cw]);

  // ── drag to move element ──
  const startDrag = (e: React.MouseEvent, id: number) => {
    if (sidebarTab === 'link') return;
    e.stopPropagation();
    setSelectedId(id);
    let px = e.clientX, py = e.clientY;
    const onMove = (me: MouseEvent) => { moveEl(id, me.clientX - px, me.clientY - py); px = me.clientX; py = me.clientY; };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── canvas mouse ──
  const canvasPos = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
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
    const rect = { id: Date.now(), x: Math.min(startPos.x, p.x), y: Math.min(startPos.y, p.y), w: Math.abs(p.x - startPos.x), h: Math.abs(p.y - startPos.y), url: 'https://' };
    if (rect.w > 5 && rect.h > 5) setRects(prev => [...prev, rect]);
    setPreviewRect(null);
  };

  // ── download ──
  const downloadSkin = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d')!;
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
        ctx.font = `${el.fontWeight} ${el.fontSize}px -apple-system, sans-serif`;
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
        ctx.fillText(r.label, r.x + r.w / 2, r.y + r.h / 2);
      }
    }
    triggerDownload(canvas.toDataURL('image/png'), '블로그_스킨.png');
  };

  const downloadWidget = () => {
    const canvas = document.createElement('canvas');
    canvas.width = WIDGET_W; canvas.height = ch;
    triggerDownload(canvas.toDataURL('image/png'), `투명위젯_${WIDGET_W}x${ch}.png`);
  };

  // ── render ──
  return (
    <div className={`font-sans text-gray-800 ${embedded ? '' : 'min-h-screen bg-gray-50 py-8 px-4 md:px-8'}`}>
      <div className={embedded ? '' : 'max-w-6xl mx-auto'}>

      {!embedded && (
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition mb-6">
          <ArrowLeft size={12} /> 홈으로
        </Link>
      )}

      {/* 스타일 선택 탭 */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="text-xs font-semibold text-gray-400 mr-1">스타일 선택:</span>
        {BLOG_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => { loadTemplate(tpl); setSidebarTab('design'); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition ${
              activeTemplateId === tpl.id
                ? 'bg-gray-900 text-white border-gray-900 shadow'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <span>{tpl.emoji}</span>
            {tpl.label}
          </button>
        ))}
        {activeTemplateId && (
          <button
            onClick={() => { setElements([]); setRects([]); setActiveTemplateId(null); }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
          >
            초기화
          </button>
        )}
      </div>

      {/* 두 컬럼 레이아웃 */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── 왼쪽: 컨트롤 패널 ── */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">

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
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
                  sidebarTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
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
                    {([['가로', cw, setCw], ['세로', ch, setCh]] as [string, number, (v: number) => void][]).map(([label, val, setter]) => (
                      <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <div className="text-xs font-semibold text-gray-400 mb-1">{label} (px)</div>
                        <input type="number" value={val} onChange={e => setter(+e.target.value || val)}
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
                      </>
                    )}
                    {selectedEl.type === 'image' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">크기 조절 (너비)</label>
                        <input type="range" min="50" max="1000" value={selectedEl.w}
                          onChange={e => { const w = +e.target.value; updateEl(selectedEl.id, { w, h: Math.round(w * selectedEl.h / selectedEl.w) }); }}
                          className="w-full accent-gray-800" />
                      </div>
                    )}
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
                            className="text-gray-300 hover:text-red-400 transition p-0.5">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">연결한 링크 목록 ({rects.length})</label>
                  {rects.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4 italic">캔버스에서 드래그해 클릭 영역을 만드세요</p>
                  ) : (
                    <div className="space-y-2">
                      {rects.map(r => (
                        <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold bg-gray-200 text-gray-700 rounded px-2 py-0.5">
                              위젯 칸 {Math.floor(r.x / 175) + 1}
                            </span>
                            <button onClick={() => setRects(prev => prev.filter(x => x.id !== r.id))}
                              className="text-gray-300 hover:text-red-400 transition">
                              <Trash2 size={13} />
                            </button>
                          </div>
                              <input value={r.label ?? ''} onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, label: e.target.value } : x))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-1.5"
                            placeholder="버튼 텍스트 (예: 맛집 탐방)" />
                          <input value={r.url} onChange={e => setRects(prev => prev.map(x => x.id === r.id ? { ...x, url: e.target.value } : x))}
                            className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-gray-500 mb-2"
                            placeholder="이동할 URL 입력" />
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
        <div className="flex-1 min-w-0 flex flex-col">

          {/* 캔버스 카드 */}
          <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4">
            <h3 className="text-left font-semibold text-gray-800 mb-3 px-1 text-sm">
              미리보기 ({cw}×{ch})
              {sidebarTab === 'link' && (
                <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">드래그로 링크 영역 그리기</span>
              )}
            </h3>
            <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden rounded-xl border border-gray-100">
              <div
                ref={canvasRef}
                style={{ position: 'relative', width: cw, height: ch, backgroundColor: bg, backgroundImage: bgImage ? `url(${bgImage})` : 'none', backgroundSize: 'cover', backgroundPosition: bgPosition, flexShrink: 0, cursor: sidebarTab === 'link' ? 'crosshair' : 'default' }}
                onMouseDown={onCanvasDown}
                onMouseMove={onCanvasMove}
                onMouseUp={onCanvasUp}
              >
                {/* BG overlay */}
                {bgImage && bgOverlay > 0 && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0,0,0,${bgOverlay / 100})`, pointerEvents: 'none', zIndex: 1 }} />
                )}
                {/* Grid guide */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none', opacity: 0.15, zIndex: 2 }}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} style={{ width: WIDGET_W, marginRight: WIDGET_GAP, height: '100%', borderRight: '1px dashed #18181b', flexShrink: 0 }} />
                  ))}
                </div>

                {/* Empty state */}
                {elements.length === 0 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, pointerEvents: 'none' }}>
                    <div style={{ fontSize: 36 }}>🎨</div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8' }}>위에서 블로그 유형을 선택하세요</p>
                  </div>
                )}

                {/* Elements */}
                {elements.map(el => (
                  <div
                    key={el.id}
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
                        style={{ fontSize: el.fontSize, color: el.color, fontWeight: el.fontWeight, whiteSpace: 'nowrap', padding: '0 8px', outline: 'none' }}
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
                      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: r.labelColor || '#333333', pointerEvents: 'none', userSelect: 'none' }}>{r.label}</span>
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
            <button onClick={downloadSkin}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
              <Download className="w-4 h-4" /> 이미지 다운로드
            </button>
            <button onClick={() => setShowGuide(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition text-sm">
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
              <button onClick={() => setShowCode(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 24, overflowY: 'auto' }}>
              {!imgUrl && <div style={{ background: '#f4f4f5', color: '#52525b', border: '1px solid #d4d4d8', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>⚠️ [링크] 탭에서 투명 이미지 주소를 입력하지 않았습니다.</div>}
              <pre style={{ background: '#f8f8f8', border: '1px solid #e4e4e7', borderRadius: 12, padding: 16, fontSize: 11, fontFamily: 'monospace', overflowX: 'auto', maxHeight: 280, lineHeight: 1.6, color: '#3f3f46' }}>
                {buildHTML(rects, imgUrl)}
              </pre>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => copyText(buildHTML(rects, imgUrl))} style={btnStyle('#18181b', '#fff', false, 'none', 14, 14)}>전체 코드 복사하기</button>
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
              <button onClick={() => setShowGuide(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 24, flex: 1 }}>
              {[
                { n: 1, title: '스킨 저장 & 투명 위젯 올리기', steps: ['[스킨 저장]으로 스킨 이미지를 저장하고, [투명 위젯 다운로드]도 저장합니다.', '블로그 [세부 디자인 설정] > [스킨 배경] > [직접 등록] > 상단영역에 스킨 이미지를 올립니다.', '투명 위젯을 비공개 글로 올린 뒤, 우클릭 → 이미지 주소 복사.'] },
                { n: 2, title: '위젯 코드 복사 & 등록하기', steps: ['[링크] 탭에 투명 이미지 주소를 넣고 [코드 생성].', '[꾸미기 설정] > [레이아웃·위젯 설정]에서 [+ 위젯 직접 등록] 클릭.', '위젯명(투명1~5)과 각 칸 코드를 나눠 5개 등록.'] },
                { n: 3, title: '레이아웃 정리하기 ⭐', steps: ['상단 레이아웃을 오른쪽 끝에서 2번째(1단 넓은 레이아웃)로 선택.', '투명위젯 1~5번을 타이틀 바로 아래 가로 1줄로 배치.', '[타이틀]과 [블로그 메뉴] 체크 해제. 불필요한 위젯은 숨기기.'] },
              ].map(({ n, title, steps }) => (
                <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f4f4f5', color: '#18181b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>{n}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#0f172a' }}>{title}</div>
                    {steps.map((s, i) => <p key={i} style={{ fontSize: 13, color: '#475569', marginBottom: 4, lineHeight: 1.6 }}>{i + 1}. {s}</p>)}
                  </div>
                </div>
              ))}
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
