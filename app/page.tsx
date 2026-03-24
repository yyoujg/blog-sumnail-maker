'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Palette,
  Download,
  Type,
  Layers,
  Layout,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType } from '@/lib/types';
import ControlPanel from '@/components/ControlPanel';
import ThumbnailPreview from '@/components/ThumbnailPreview';
import SkinMakerTool from '@/components/SkinMakerTool';
import CoupangCard from '@/components/CoupangCard';
import KakaoAdBanner from '@/components/KakaoAdBanner';
import { blogPosts } from '@/data/blogPosts';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html2canvas?: (el: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

const STYLE_PRESETS = [
  {
    id: 'food',
    label: '맛집 블로그',
    emoji: '🍽️',
    bgType: 'image' as BgType,
    bgColor: '#2d3436',
    bgImage: '/images/cafe.jpg',
    textColor: '#ffffff',
    fontFamily: `'Nanum Myeongjo', serif`,
    frameType: 'corners' as FrameType,
    overlayOpacity: 45,
    textAlign: 'center' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '성수동 감성 카페 추천',
    subtitle: '재방문 100% 카페 후기',
    category: '카페 기록',
    categoryOptions: ['프롤로그', '맛집 방문', '카페 기록', '재방문 리스트'],
  },
  {
    id: 'review',
    label: '체험단 블로그',
    emoji: '🎁',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/jungyeon-food-1390412.jpg',
    textColor: '#ffffff',
    fontFamily: `'Noto Sans KR', sans-serif`,
    frameType: 'none' as FrameType,
    overlayOpacity: 50,
    textAlign: 'center' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '체험단 솔직 후기',
    subtitle: '직접 써보고 솔직하게 적었어요',
    category: '체험단',
    categoryOptions: ['제품 후기', '솔직 리뷰', '사용 전/후', '총평'],
  },
  {
    id: 'finance',
    label: '재테크 블로그',
    emoji: '📈',
    bgType: 'image' as BgType,
    bgColor: '#0a3d62',
    bgImage: '/images/muqadastalib-moneybag-8727680_1920.jpg',
    textColor: '#ffffff',
    fontFamily: `'Noto Sans KR', sans-serif`,
    frameType: 'solid' as FrameType,
    overlayOpacity: 40,
    textAlign: 'left' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '월 50만원 절약하는 법',
    subtitle: '직장인 재테크 실전 가이드',
    category: '재테크',
    categoryOptions: ['재테크 기초', '절약 팁', '투자 후기', '수익 인증'],
  },
  {
    id: 'daily',
    label: '일상 블로그',
    emoji: '✨',
    bgType: 'image' as BgType,
    bgColor: '#2d3436',
    bgImage: '/images/rottonara-backpack-4339090_1920.jpg',
    textColor: '#ffffff',
    fontFamily: `'Noto Sans KR', sans-serif`,
    frameType: 'none' as FrameType,
    overlayOpacity: 40,
    textAlign: 'center' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '오늘의 일상 기록',
    subtitle: '소소하지만 특별한 하루',
    category: '일상',
    categoryOptions: ['일상', '취미', '여행', '라이프로그'],
  },
] as const;

const FAQ_ITEMS = [
  {
    q: '이 서비스는 무료인가요?',
    a: '완전 무료입니다. 회원가입, 로그인, 결제가 전혀 필요 없습니다. 지금 바로 사용하세요.',
  },
  {
    q: '썸네일 메이커와 스킨 메이커의 차이는 무엇인가요?',
    a: '썸네일 메이커는 블로그 포스팅 대표 이미지(1:1 비율)를 만드는 도구입니다. 스킨 메이커는 블로그 상단에 표시되는 홈페이지형 배너 스킨과 클릭 가능한 위젯 코드를 만드는 도구입니다.',
  },
  {
    q: '생성한 이미지는 어디에 저장되나요?',
    a: '이미지는 서버에 저장되지 않습니다. 다운로드 버튼을 누르면 내 기기에 바로 저장됩니다. 업로드한 배경 이미지도 브라우저 안에서만 처리됩니다.',
  },
  {
    q: '모바일에서도 사용할 수 있나요?',
    a: '네, PC와 모바일 모두 지원합니다. 다만 스킨 메이커처럼 세밀한 설정이 필요한 도구는 PC 환경에서 더 편리합니다.',
  },
  {
    q: '상업적으로 사용해도 되나요?',
    a: '생성한 이미지는 자유롭게 사용하실 수 있습니다. 단, 배경으로 업로드한 이미지의 저작권은 원저작자에게 있으니 저작권법을 준수해 주세요.',
  },
  {
    q: '추천 썸네일 크기는 어떻게 되나요?',
    a: '네이버 블로그 포스팅 대표 이미지는 1:1 비율(600×600px 이상)을 권장합니다. 본 메이커는 2배 해상도(약 720×720px)로 PNG를 생성하므로 모바일에서도 선명하게 보입니다.',
  },
  {
    q: 'PNG와 JPG 중 어떤 형식을 선택해야 하나요?',
    a: 'PNG는 투명 배경과 선명한 텍스트를 지원하며 블로그 썸네일에 권장합니다. JPG는 파일 크기가 작아 배경 이미지가 있는 경우 유용합니다.',
  },
  {
    q: '스킨 메이커로 만든 코드는 어떻게 적용하나요?',
    a: '스킨 저장 버튼으로 배경 이미지를 내려받고, 투명 위젯을 블로그 비공개 글로 업로드한 뒤 이미지 주소를 복사해 코드 생성 탭에 붙여넣으세요. 생성된 HTML 코드를 네이버 블로그 위젯에 등록하면 완성됩니다.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function HomePage() {
  const [title, setTitle] = useState('성수동 감성 카페 추천');
  const [subtitle, setSubtitle] = useState('재방문 100% 카페 후기');
  const [category, setCategory] = useState('카페 기록');

  const [bgType, setBgType] = useState<BgType>('image');
  const [bgColor, setBgColor] = useState('#2d3436');
  const [bgImage, setBgImage] = useState<string | null>('/images/cafe.jpg');

  const [textColor, setTextColor] = useState('#f8f8f8');
  const [fontFamily, setFontFamily] = useState(`'Nanum Myeongjo', serif`);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [textVAlign, setTextVAlign] = useState<TextVAlign>('middle');
  const [textOffsetX, setTextOffsetX] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);

  const [overlayOpacity, setOverlayOpacity] = useState(45);
  const [frameType, setFrameType] = useState<FrameType>('corners');

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [downloadScale, setDownloadScale] = useState<1 | 2>(2);
  const [activePresetId, setActivePresetId] = useState<string | null>('food');
  const [isDownloadDone, setIsDownloadDone] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'thumbnail' | 'skin'>('thumbnail');
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % 2), 5000);
    return () => clearInterval(timer);
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const applyPreset = (preset: typeof STYLE_PRESETS[number]) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setCategory(preset.category);
    setBgType(preset.bgType);
    setBgColor(preset.bgColor);
    setBgImage(preset.bgImage);
    setTextColor(preset.textColor);
    setFontFamily(preset.fontFamily);
    setFrameType(preset.frameType);
    setOverlayOpacity(preset.overlayOpacity);
    setTextAlign(preset.textAlign);
    setTextVAlign(preset.textVAlign);
    setTextOffsetX(0);
    setTextOffsetY(0);
    setActivePresetId(preset.id);
  };

  const scrollToTool = () => {
    document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const target = event.target;
        if (target && typeof target.result === 'string') {
          setBgImage(target.result);
          setBgType('image');
          setActivePresetId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadThumbnail = async () => {
    if (!window.html2canvas) {
      alert('이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    const element = previewRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      await document.fonts.ready;
      const w = element.offsetWidth;
      const h = element.offsetHeight;
      element.style.setProperty('width', `${w}px`);
      element.style.setProperty('height', `${h}px`);
      const canvas = await window.html2canvas(element, {
        scale: downloadScale,
        useCORS: true,
        backgroundColor: bgType === 'color' ? bgColor : '#ffffff',
      });
      element.style.removeProperty('width');
      element.style.removeProperty('height');
      const mimeType = downloadFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = downloadFormat === 'jpg' ? 0.95 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const link = document.createElement('a');
      link.download = `blog_thumbnail.${downloadFormat}`;
      link.href = dataUrl;
      link.click();
      setIsDownloadDone(true);
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`이미지 다운로드에 실패했습니다. (${message})`);
    } finally {
      setIsDownloading(false);
    }
  };

  const recentPosts = blogPosts.slice(0, 3);
  const activePreset = STYLE_PRESETS.find(p => p.id === activePresetId) ?? null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">

      {/* ── 헤더 / 네비게이션 ── */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-white/10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-white/60" />
            BlogKit
          </div>

          {/* 슬라이딩 pill */}
          <div className="relative flex bg-white/10 rounded-xl p-1">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-white transition-transform duration-200 ease-in-out pointer-events-none"
              style={{
                width: 'calc(50% - 2px)',
                transform: activeMainTab === 'skin' ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
              }}
            />
            <button
              onClick={() => { setActiveMainTab('thumbnail'); scrollToTool(); }}
              className={`relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                activeMainTab === 'thumbnail' ? 'text-gray-900' : 'text-white/70 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              썸네일 메이커
            </button>
            <button
              onClick={() => { setActiveMainTab('skin'); scrollToTool(); }}
              className={`relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                activeMainTab === 'skin' ? 'text-gray-900' : 'text-white/70 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4" />
              스킨 메이커
            </button>
          </div>

          {/* 우측 네비 */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/blog" className="text-sm font-medium text-white/60 hover:text-white transition">블로그</Link>
          </nav>
        </div>
      </header>

      {/* ── 히어로 슬라이더 ── */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${heroSlide * 100}%)` }}
        >
          {/* ── 슬라이드 1: 썸네일 메이커 ── */}
          <div className="w-full flex-shrink-0 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  썸네일 메이커
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                  조회수 잘 나오는<br />썸네일, 1분 완성
                </h1>
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  제목만 입력하면 끝. 디자인 없이 바로 다운로드.
                </p>
                <div className="relative mb-5">
                  <input
                    type="text"
                    value={title}
                    onChange={e => { setTitle(e.target.value); setActivePresetId(null); }}
                    placeholder="블로그 글 제목을 입력하세요"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition pr-28"
                  />
                  <button
                    onClick={() => { setActiveMainTab('thumbnail'); scrollToTool(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-900 font-bold text-xs px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    미리보기 →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => { applyPreset(preset); setActiveMainTab('thumbnail'); scrollToTool(); }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition text-left ${
                        activePresetId === preset.id
                          ? 'bg-white text-gray-900 border-white'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="text-base">{preset.emoji}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setActiveMainTab('thumbnail'); scrollToTool(); }}
                  className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  썸네일 만들기
                </button>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {[
                  { bgImage: '/images/cafe.jpg', category: '맛집', title: '성수동 감성 카페', overlay: 0.45 },
                  { bgImage: '/images/jungyeon-food-1390412.jpg', category: '체험단', title: '솔직 체험단 후기', overlay: 0.5 },
                  { bgImage: '/images/muqadastalib-moneybag-8727680_1920.jpg', category: '재테크', title: '월 50만원 절약', overlay: 0.4 },
                  { bgImage: '/images/rottonara-backpack-4339090_1920.jpg', category: '일상', title: '오늘의 라이프로그', overlay: 0.4 },
                ].map((s, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-5 text-center"
                    style={{ backgroundImage: `url(${s.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${s.overlay})` }} />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/80 text-white/90">{s.category}</span>
                      <p className="font-bold text-sm leading-snug text-white">{s.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 슬라이드 2: 스킨 메이커 ── */}
          <div className="w-full flex-shrink-0 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-5">
                  <Layout className="w-3.5 h-3.5" />
                  스킨 메이커
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                  5분 만에 완성하는<br />홈페이지형 블로그
                </h1>
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  배너 스킨 + 카테고리 링크 위젯을 한 번에.<br />예제 템플릿으로 바로 시작.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { emoji: '🍜', label: '맛집 리뷰' },
                    { emoji: '🎁', label: '체험단' },
                    { emoji: '📈', label: '재테크' },
                    { emoji: '🌿', label: '라이프스타일' },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 text-white">
                      <span className="text-base">{t.emoji}</span>
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setActiveMainTab('skin'); scrollToTool(); }}
                  className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg"
                >
                  <Layout className="w-4 h-4" />
                  스킨 만들기
                </button>
              </div>
              {/* 스킨 배너 스타일 미리보기 4종 */}
              <div className="hidden lg:flex flex-col gap-3">
                {[
                  {
                    img: '/images/cafe.jpg',
                    overlay: 0.5,
                    name: '성수동 카페 탐방',
                    sub: '서울 감성 카페 기록',
                    cats: ['홈', '카페', '맛집', '후기'],
                    accent: '#fdcb6e',
                  },
                  {
                    img: '/images/muqadastalib-moneybag-8727680_1920.jpg',
                    overlay: 0.45,
                    name: '재테크 실전 기록',
                    sub: '직장인의 절약·투자 도전기',
                    cats: ['홈', '주식', '절약', '부업'],
                    accent: '#4fc3f7',
                  },
                  {
                    img: '/images/rottonara-backpack-4339090_1920.jpg',
                    overlay: 0.4,
                    name: '나의 일상 기록',
                    sub: '소소하지만 특별한 하루하루',
                    cats: ['홈', '일상', '여행', '취미'],
                    accent: '#55efc4',
                  },
                  {
                    img: '/images/builtbymath-camera-1362419.jpg',
                    overlay: 0.5,
                    name: '체험단 블로그',
                    sub: '솔직한 제품·서비스 후기',
                    cats: ['홈', '제품', '리뷰', '총평'],
                    accent: '#fd79a8',
                  },
                ].map((skin, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-md flex-shrink-0 relative"
                    style={{ backgroundImage: `url(${skin.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${skin.overlay})` }} />
                    <div className="relative z-10 px-4 py-5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-white leading-snug">{skin.name}</p>
                        <p className="text-[10px] mt-1 text-white/70">{skin.sub}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full" style={{ background: skin.accent }} />
                    </div>
                    <div className="relative z-10 flex border-t border-white/20">
                      {skin.cats.map((cat, j) => (
                        <div key={cat} className="flex-1 text-center py-2 text-[9px] font-semibold"
                          style={{
                            color: j === 0 ? '#ffffff' : 'rgba(255,255,255,0.55)',
                            borderBottom: j === 0 ? '2px solid #ffffff' : '2px solid transparent',
                          }}>
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 이전/다음 버튼 */}
        <button
          onClick={() => setHeroSlide(s => (s - 1 + 2) % 2)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setHeroSlide(s => (s + 1) % 2)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 닷 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1].map(i => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className={`rounded-full transition-all duration-300 ${heroSlide === i ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </section>

      {/* ── 도구 탭 ── */}
      <section id="tool" className="py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* 썸네일 메이커 탭 */}
          {activeMainTab === 'thumbnail' && (
            <>
              {/* 스타일 프리셋 선택 */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="text-xs font-semibold text-gray-400 mr-1">스타일 선택:</span>
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition ${
                      activePresetId === preset.id
                        ? 'bg-gray-900 text-white border-gray-900 shadow'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span>{preset.emoji}</span>
                    {preset.label}
                  </button>
                ))}
                {activePresetId && (
                  <button
                    onClick={() => setActivePresetId(null)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
                  >
                    초기화
                  </button>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <ControlPanel
                  title={title} setTitle={setTitle}
                  subtitle={subtitle} setSubtitle={setSubtitle}
                  category={category} setCategory={setCategory}
                  categoryOptions={activePreset?.categoryOptions as readonly string[] | undefined}
                  fontFamily={fontFamily} setFontFamily={setFontFamily}
                  textColor={textColor} setTextColor={setTextColor}
                  textAlign={textAlign} setTextAlign={setTextAlign}
                  textVAlign={textVAlign} setTextVAlign={setTextVAlign}
                  textOffsetX={textOffsetX} setTextOffsetX={setTextOffsetX}
                  textOffsetY={textOffsetY} setTextOffsetY={setTextOffsetY}
                  bgType={bgType} setBgType={setBgType}
                  bgColor={bgColor} setBgColor={setBgColor}
                  bgImage={bgImage} setBgImage={setBgImage}
                  onImageUpload={handleImageUpload}
                  overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity}
                  frameType={frameType} setFrameType={setFrameType}
                />
                <ThumbnailPreview
                  previewRef={previewRef}
                  title={title} subtitle={subtitle} category={category}
                  textColor={textColor} fontFamily={fontFamily} textAlign={textAlign} textVAlign={textVAlign} textOffsetX={textOffsetX} textOffsetY={textOffsetY}
                  bgType={bgType} bgColor={bgColor} bgImage={bgImage}
                  overlayOpacity={overlayOpacity} frameType={frameType}
                  onDownload={downloadThumbnail} isDownloading={isDownloading} isDownloadDone={isDownloadDone}
                  downloadFormat={downloadFormat} onFormatChange={setDownloadFormat}
                  downloadScale={downloadScale} onScaleChange={setDownloadScale}
                />
              </div>

            </>
          )}

          {/* 스킨 메이커 탭 */}
          {activeMainTab === 'skin' && (
            <SkinMakerTool embedded />
          )}

        </div>
      </section>

      {/* ── 블로그 수익화 섹션 ── */}
      <section className="py-12 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <TrendingUp className="w-3.5 h-3.5" /> 블로그 수익화 가이드
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">썸네일 완성! 이제 블로그로 수익을 내보세요</h2>
            <p className="text-gray-400 text-sm">방문자가 늘었다면 수익화는 생각보다 간단합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              {
                emoji: '🎁',
                title: '체험단으로 용돈 벌기',
                desc: '네이버·리뷰플레이스·강남언니 등 체험단 플랫폼에 신청해 제품을 무료로 받고 후기를 작성하면 됩니다.',
                link: '/blog/review-blog-tips',
                linkLabel: '체험단 가이드 읽기',
              },
              {
                emoji: '💰',
                title: '애드센스로 광고 수익',
                desc: '하루 방문자 100명 이상이면 애드센스 신청이 가능합니다. 승인 요건과 빠른 승인 팁을 정리했습니다.',
                link: '/blog/adsense-guide',
                linkLabel: '애드센스 승인 가이드',
              },
              {
                emoji: '🛒',
                title: '쿠팡 파트너스 추천 수익',
                desc: '글에 쿠팡 링크를 넣는 것만으로 수익이 발생합니다. 리뷰 글에 자연스럽게 연결하는 것이 포인트입니다.',
                link: '/blog/blog-monetization-guide',
                linkLabel: '수익화 시작하기',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group"
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{item.desc}</p>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white transition flex items-center gap-1">
                  {item.linkLabel} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 이런 분께 유용해요 */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">이런 분께 특히 유용해요</h2>
          <p className="text-gray-500 text-center text-sm mb-10">썸네일과 스킨 하나로 블로그 완성도가 달라집니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Palette className="w-6 h-6 text-gray-900" />, title: '디자인 도구가 낯선 초보 블로거', desc: '포토샵·캔바 없이도 전문적인 느낌의 썸네일과 스킨을 만들 수 있습니다. 클릭 몇 번으로 완성됩니다.' },
              { icon: <Type className="w-6 h-6 text-gray-900" />, title: '매일 포스팅하는 파워블로거', desc: '포스팅마다 썸네일 만드는 시간이 아깝다면? 스타일 프리셋으로 1분 만에 일관된 스타일을 유지하세요.' },
              { icon: <Layout className="w-6 h-6 text-gray-900" />, title: '홈페이지형 블로그를 원하는 블로거', desc: '스킨 메이커로 상단 배너를 꾸미고 카테고리 링크를 설정하면 블로그가 홈페이지처럼 바뀝니다.' },
            ].map((card, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center mb-4">{card.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 썸네일 제작 팁 */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">썸네일 제작 팁</h2>
          <p className="text-gray-500 text-center text-sm mb-10">이것만 지켜도 클릭률이 달라집니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: <Download className="w-5 h-5 text-gray-900" />, title: '추천 사이즈: 600×600px 이상', desc: '네이버 블로그 대표 이미지는 1:1 비율(600×600px 이상)이 가장 안정적입니다. 본 메이커의 2× 고화질 모드로 저장하면 모바일에서도 선명합니다.' },
              { icon: <Type className="w-5 h-5 text-gray-900" />, title: '텍스트는 15자 이내', desc: '목록에서 썸네일은 작게 보입니다. 긴 문장은 읽히지 않으니 핵심 키워드 위주로 짧고 굵게 입력하세요.' },
              { icon: <Palette className="w-5 h-5 text-gray-900" />, title: '배경과 텍스트 대비를 높여라', desc: '어두운 배경에는 흰색 텍스트, 밝은 배경에는 검정 텍스트. 배경 이미지 위에는 오버레이를 20~50% 적용하면 가독성이 확보됩니다.' },
              { icon: <Layers className="w-5 h-5 text-gray-900" />, title: '카테고리 레이블을 활용하세요', desc: '"요리", "여행", "리뷰" 같은 카테고리를 썸네일에 넣으면 방문자가 글의 주제를 즉시 파악합니다. 서브타이틀 영역을 활용해보세요.' },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">{tip.icon}</div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-6xl mx-auto -mt-4">
        <CoupangCard src="https://coupa.ng/clQwSN" name="셀루미 초경량 스마트폰 삼각대" desc="배경 사진 직접 찍어 쓰는 분들께 추천해요. 손떨림 없이 고정된 앵글로 찍으면 썸네일 소스 퀄리티가 확 달라집니다." />
      </div>

      {/* FAQ */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">자주 묻는 질문</h2>
          <p className="text-gray-500 text-center text-sm mb-8">궁금한 점이 있으시면 아래를 확인해 주세요.</p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            더 궁금한 점은{' '}
            <Link href="/contact" className="text-gray-900 hover:underline">문의 페이지</Link>
            에서 이메일로 보내주세요.
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-3xl mx-auto -mt-4">
        <CoupangCard src="https://coupa.ng/clQwZb" name="라이프썸 미니 블루투스 키보드" desc="태블릿으로 블로그 포스팅하는 분들께 딱 맞아요. 3대 멀티 페어링에 C타입 충전까지 되어서 하나 사두면 오래 씁니다." />
      </div>

      {/* 블로그 최신 글 */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">썸네일 제작 가이드</h2>
              <p className="text-gray-500 text-sm mt-1">더 잘 만들기 위한 팁을 읽어보세요.</p>
            </div>
            <Link href="/blog" className="flex items-center gap-1 text-sm text-gray-900 hover:underline font-medium">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-900 transition-colors mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 페이지 최하단 카카오 광고 */}
      <div className="w-full bg-white border-t border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <KakaoAdBanner />
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-10 px-4 md:px-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
                네이버 블로그 디자인 도구
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                썸네일 메이커와 스킨 메이커를 누구나 무료로 사용할 수 있습니다. 가입·설치 없이 바로 시작하세요.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
              <Link href="/skin-maker" className="hover:text-white transition-colors font-medium text-gray-300">스킨 메이커</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/blog" className="hover:text-white transition-colors">블로그</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">개인정보 처리방침</Link>
              <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <Link href="/contact" className="hover:text-white transition-colors">문의</Link>
            </nav>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} 네이버 블로그 디자인 도구. All rights reserved.</p>
            <p className="mt-1">문의 및 제휴: andn1026@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
