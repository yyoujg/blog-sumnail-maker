'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  Image as ImageIcon,
  Layout,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType } from '@/lib/types';
import ControlPanel from '@/components/ControlPanel';
import ThumbnailPreview from '@/components/ThumbnailPreview';
import SkinMakerTool from '@/components/SkinMakerTool';
import { HTML2CANVAS_SCRIPT_SRC } from '@/lib/constants';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html2canvas?: (el: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

const STYLE_PRESETS = [
  {
    id: 'cafe',
    label: '카페·맛집',
    emoji: '🍽️',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260320일상엔베이커리/일상엔-바닐라라떼-아메리카노-두바이초코몽블랑-메인.JPG',
    textColor: '#ffffff',
    fontFamily: `'Nanum Myeongjo', serif`,
    frameType: 'band' as FrameType,
    overlayOpacity: 22,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '분위기 좋은 수원 로스터리 카페',
    subtitle: '혼자 가기 딱 좋은 조용한 감성 카페',
    category: '카페 기록',
    categoryOptions: ['카페 기록', '맛집 탐방', '방문 후기', '재방문 리스트'],
  },
  {
    id: 'review',
    label: '체험단·리뷰',
    emoji: '🎁',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260208에디션엠/에디션엠-베이커리쇼케이스-크루아상.JPG',
    textColor: '#ffffff',
    fontFamily: `'Noto Sans KR', sans-serif`,
    frameType: 'solid' as FrameType,
    overlayOpacity: 48,
    textAlign: 'center' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '솔직한 카페 디저트 후기',
    subtitle: '직접 먹어봤습니다 — 추천 vs 비추',
    category: '체험 후기',
    categoryOptions: ['체험 후기', '솔직 후기', '제품 리뷰', '사용 전/후'],
  },
  {
    id: 'finance',
    label: '재테크·부업',
    emoji: '📈',
    bgType: 'image' as BgType,
    bgColor: '#0a2540',
    bgImage: '/images/251231지관서가/안동북카페-지관서가-커피케이크-메뉴.JPG',
    textColor: '#fdcb6e',
    fontFamily: `'Noto Sans KR', sans-serif`,
    frameType: 'corners' as FrameType,
    overlayOpacity: 60,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '월급쟁이 재테크 실전기',
    subtitle: '직장인도 할 수 있는 절약과 투자',
    category: '재테크',
    categoryOptions: ['재테크 기초', '절약 팁', '투자 후기', '부업 기록'],
  },
  {
    id: 'travel',
    label: '여행·나들이',
    emoji: '✈️',
    bgType: 'image' as BgType,
    bgColor: '#2d3436',
    bgImage: '/images/251217포트웰브/포트웰브_크리스마스트리.JPG',
    textColor: '#ffffff',
    fontFamily: `'Nanum Myeongjo', serif`,
    frameType: 'double' as FrameType,
    overlayOpacity: 32,
    textAlign: 'right' as TextAlign,
    textVAlign: 'top' as TextVAlign,
    title: '국내 이색 공간 추천',
    subtitle: '일상 탈출 나들이 코스로 딱입니다',
    category: '나들이',
    categoryOptions: ['나들이', '국내 여행', '이색 체험', '여행 준비'],
  },
  {
    id: 'hobby',
    label: '취미·일상',
    emoji: '🎸',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260321시온뮤직 수원권선점/시온뮤직-드럼방전체-악보대TV.JPG',
    textColor: '#ffffff',
    fontFamily: `'Jua', sans-serif`,
    frameType: 'band' as FrameType,
    overlayOpacity: 18,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '기타 독학 6개월 솔직 후기',
    subtitle: '입문자가 꼭 알아야 할 것들',
    category: '취미',
    categoryOptions: ['취미', '음악', '독학 후기', '입문 가이드'],
  },
  {
    id: 'lifestyle',
    label: '라이프스타일',
    emoji: '🌿',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260317야옹이네고양이카페/IMG_8591.JPG',
    textColor: '#ffffff',
    fontFamily: `'Nanum Gothic', sans-serif`,
    frameType: 'none' as FrameType,
    overlayOpacity: 28,
    textAlign: 'center' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '고양이 카페 일상 기록',
    subtitle: '힐링이 필요할 때 찾는 단골 공간',
    category: '일상',
    categoryOptions: ['일상', '힐링', '동물 카페', '자기계발'],
  },
] as const;


export default function HomePage() {
  const [title, setTitle] = useState('분위기 좋은 수원 로스터리 카페');
  const [subtitle, setSubtitle] = useState('혼자 가기 딱 좋은 조용한 감성 카페');
  const [category, setCategory] = useState('카페 기록');

  const [bgType, setBgType] = useState<BgType>('image');
  const [bgColor, setBgColor] = useState('#1a1a1a');
  const [bgImage, setBgImage] = useState<string | null>('/images/260320일상엔베이커리/일상엔-바닐라라떼-아메리카노-두바이초코몽블랑-메인.JPG');

  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState(`'Nanum Myeongjo', serif`);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [textVAlign, setTextVAlign] = useState<TextVAlign>('bottom');
  const [textOffsetX, setTextOffsetX] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);

  const [overlayOpacity, setOverlayOpacity] = useState(18);
  const [frameType, setFrameType] = useState<FrameType>('band');

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [downloadScale, setDownloadScale] = useState<1 | 2>(2);
  const [activePresetId, setActivePresetId] = useState<string | null>('cafe');
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
                  썸네일 만들기 (추천)
                </button>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {[
                  '/images/blog_thumbnail.png',
                  '/images/blog_thumbnail_2.png',
                  '/images/blog_thumbnail_3.png',
                  '/images/blog_thumbnail_4.png',
                ].map((src, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <img src={src} alt={`썸네일 예시 ${i + 1}`} className="w-full h-full object-cover" />
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
                    img: '/images/260208에디션엠/에디션엠-혜화역카페-내부인테리어.JPG',
                    overlay: 0.45,
                    name: '카페·맛집 블로그',
                    sub: '감성 카페 & 맛집 기록',
                    cats: ['홈', '카페', '맛집', '후기'],
                    accent: '#fdcb6e',
                  },
                  {
                    img: '/images/260124포인핸드서울숲점/12_음료_아이스라떼_강아지배경.JPG',
                    overlay: 0.4,
                    name: '체험단 블로그',
                    sub: '솔직한 제품·서비스 후기',
                    cats: ['홈', '제품', '리뷰', '총평'],
                    accent: '#fd79a8',
                  },
                  {
                    img: '/images/251231지관서가/안동북카페-지관서가-1층내부-서가창가뷰.JPG',
                    overlay: 0.38,
                    name: '라이프스타일 블로그',
                    sub: '일상·여행·취미 기록',
                    cats: ['홈', '일상', '여행', '취미'],
                    accent: '#55efc4',
                  },
                  {
                    img: '/images/260313코어바디필라테스/IMG_8443.JPG',
                    overlay: 0.48,
                    name: '운동·취미 블로그',
                    sub: '필라테스·운동 후기',
                    cats: ['홈', '운동', '필라테스', '후기'],
                    accent: '#74b9ff',
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
                <span className="text-xs font-semibold text-gray-400 mr-1">조회수 잘 나오는 템플릿:</span>
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

      {/* html2canvas: 썸네일 다운로드 기능이 있는 이 페이지에서만 로드 */}
      <Script src={HTML2CANVAS_SCRIPT_SRC} strategy="afterInteractive" />

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
