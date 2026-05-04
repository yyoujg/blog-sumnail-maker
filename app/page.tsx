'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Image as ImageIcon, Layout, Sparkles, BookOpen } from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType } from '@/lib/types';
import ControlPanel from '@/components/ControlPanel';
import ThumbnailPreview from '@/components/ThumbnailPreview';
import SkinMakerTool from '@/components/SkinMakerTool';
import SiteFooter from '@/components/SiteFooter';
import AdBanner from '@/components/AdBanner';
import { HTML2CANVAS_SCRIPT_SRC } from '@/lib/constants';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html2canvas?: (el: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

const STYLE_PRESETS = [
  {
    id: 'naver',
    label: '아웃라인',
    emoji: '📝',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/251116애플하우스/IMG_6831.JPG',
    textColor: '#ffffff',
    fontFamily: `'Pretendard', sans-serif`,
    frameType: 'band' as FrameType,
    overlayOpacity: 0,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '맥주 맛집 🍺\n치킨 세트 후기',
    subtitle: '수제맥주랑 먹으니 완벽했습니다',
    category: '',
    categoryOptions: ['맛집 후기', '술집 추천', '안주 맛집', '재방문 의사'],
    textShadow: true,
  },
  {
    id: 'cafe',
    label: '감성',
    emoji: '🍽️',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260208에디션엠/에디션엠-감귤케이크-딸기음료-메인.JPG',
    textColor: '#ffffff',
    fontFamily: `'Pretendard', sans-serif`,
    frameType: 'band' as FrameType,
    overlayOpacity: 30,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '분위기 좋은\n감성 카페 기록',
    subtitle: '혼자 오기 딱 좋은 조용한 공간',
    category: '카페 기록',
    categoryOptions: ['카페 기록', '맛집 탐방', '방문 후기', '재방문 리스트'],
    textShadow: false,
  },
  {
    id: 'review',
    label: '보더',
    emoji: '🎁',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/250118코르크베이크바/IMG_7578.JPG',
    textColor: '#ffffff',
    fontFamily: `'Pretendard', sans-serif`,
    frameType: 'solid' as FrameType,
    overlayOpacity: 30,
    textAlign: 'center' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '솔직한 체험단\n디저트 후기',
    subtitle: '직접 먹고 평가했습니다',
    category: '체험 후기',
    categoryOptions: ['체험 후기', '솔직 후기', '제품 리뷰', '사용 전/후'],
    textShadow: false,
  },
  {
    id: 'finance',
    label: '골드',
    emoji: '📈',
    bgType: 'image' as BgType,
    bgColor: '#0a2540',
    bgImage: '/images/251231지관서가/안동북카페-지관서가-1층내부-서가창가뷰.JPG',
    textColor: '#fdcb6e',
    fontFamily: `'Pretendard', sans-serif`,
    frameType: 'corners' as FrameType,
    overlayOpacity: 30,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '직장인\n재테크 실전기',
    subtitle: '절약과 투자, 지금 시작하세요',
    category: '재테크',
    categoryOptions: ['재테크 기초', '절약 팁', '투자 후기', '부업 기록'],
    textShadow: false,
  },
  {
    id: 'travel',
    label: '클래식',
    emoji: '✈️',
    bgType: 'image' as BgType,
    bgColor: '#2d3436',
    bgImage: '/images/251217포트웰브/포트웰브_바카운터프로젝터.JPG',
    textColor: '#ffffff',
    fontFamily: `'Pretendard', sans-serif`,
    frameType: 'double' as FrameType,
    overlayOpacity: 30,
    textAlign: 'right' as TextAlign,
    textVAlign: 'top' as TextVAlign,
    title: '국내 이색 공간\n나들이 추천',
    subtitle: '일상 탈출 코스로 딱입니다',
    category: '나들이',
    categoryOptions: ['나들이', '국내 여행', '이색 체험', '여행 준비'],
    textShadow: false,
  },
  {
    id: 'hobby',
    label: '팝',
    emoji: '🎸',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260321시온뮤직 수원권선점/시온뮤직-수원권선점-복도기타벽.JPG',
    textColor: '#ffffff',
    fontFamily: `'Jua', sans-serif`,
    frameType: 'band' as FrameType,
    overlayOpacity: 30,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '기타 독학\n6개월 솔직 후기',
    subtitle: '입문자가 꼭 알아야 할 것들',
    category: '취미',
    categoryOptions: ['취미', '음악', '독학 후기', '입문 가이드'],
    textShadow: false,
  },
  {
    id: 'lifestyle',
    label: '미니멀',
    emoji: '🌿',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260317야옹이네고양이카페/IMG_8552.JPG',
    textColor: '#ffffff',
    fontFamily: `'Pretendard', sans-serif`,
    frameType: 'none' as FrameType,
    overlayOpacity: 30,
    textAlign: 'center' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '고양이 카페\n일상 기록',
    subtitle: '힐링이 필요할 때 찾는 단골 공간',
    category: '일상',
    categoryOptions: ['일상', '힐링', '동물 카페', '자기계발'],
    textShadow: false,
  },
] as const;


export default function HomePage() {
  const [title, setTitle] = useState('맥주 맛집 🍺\n치킨 세트 후기');
  const [subtitle, setSubtitle] = useState('수제맥주랑 먹으니 완벽했습니다');
  const [category, setCategory] = useState('');

  const [bgType, setBgType] = useState<BgType>('image');
  const [bgColor, setBgColor] = useState('#1a1a1a');
  const [bgImage, setBgImage] = useState<string | null>('/images/251116애플하우스/IMG_6831.JPG');

  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState(`'Jua', sans-serif`);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [textVAlign, setTextVAlign] = useState<TextVAlign>('bottom');
  const [textOffsetX, setTextOffsetX] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);

  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [frameType, setFrameType] = useState<FrameType>('band');
  const [textShadow, setTextShadow] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState(60);
  const [bgOffsetX, setBgOffsetX] = useState(50);
  const [bgOffsetY, setBgOffsetY] = useState(50);
  const [bgRotation, setBgRotation] = useState(0);

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [downloadScale, setDownloadScale] = useState<1 | 2>(2);
  const [fileName, setFileName] = useState('blog_thumbnail');
  const [activePresetId, setActivePresetId] = useState<string | null>('naver');
  const [isDownloadDone, setIsDownloadDone] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'thumbnail' | 'skin'>('thumbnail');

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
    setTextShadow(preset.textShadow);
    setTitleFontSize(60);
    setBgOffsetX(50);
    setBgOffsetY(50);
    setBgRotation(0);
    setActivePresetId(preset.id);
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
          setBgOffsetX(50);
          setBgOffsetY(50);
          setBgRotation(0);
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
      const rect = element.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      element.style.setProperty('width', `${w}px`);
      element.style.setProperty('height', `${h}px`);
      element.style.setProperty('aspect-ratio', 'auto');
      element.style.setProperty('box-shadow', 'none');
      const canvas = await window.html2canvas(element, {
        scale: downloadScale,
        useCORS: true,
        backgroundColor: bgType === 'color' ? bgColor : '#ffffff',
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });
      element.style.removeProperty('width');
      element.style.removeProperty('height');
      element.style.removeProperty('aspect-ratio');
      element.style.removeProperty('box-shadow');
      const mimeType = downloadFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = downloadFormat === 'jpg' ? 0.95 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const link = document.createElement('a');
      link.download = `${fileName || 'blog_thumbnail'}.${downloadFormat}`;
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
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans flex flex-col">

      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-50 bg-[#111111] border-b border-white/10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-sm select-none cursor-pointer">
            <Sparkles className="w-4 h-4 text-white/60" />
            BlogKit
          </Link>

          <div className="relative flex bg-white/10 rounded-xl p-1">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-white transition-transform duration-200 ease-in-out pointer-events-none"
              style={{
                width: 'calc(50% - 2px)',
                transform: activeMainTab === 'skin' ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
              }}
            />
            <button
              onClick={() => setActiveMainTab('thumbnail')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                activeMainTab === 'thumbnail' ? 'text-gray-900' : 'text-white/60 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              썸네일
            </button>
            <button
              onClick={() => setActiveMainTab('skin')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                activeMainTab === 'skin' ? 'text-gray-900' : 'text-white/60 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              스킨
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/blog" className="px-3 py-2 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">블로그 가이드</Link>
            <Link href="/guide/thumbnail" className="px-3 py-2 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">썸네일 팁</Link>
          </nav>
        </div>
      </header>

      {/* 사이트 목적 — 도구 + 정보성 콘텐츠 */}
      <section
        aria-labelledby="site-intro-heading"
        className="px-4 md:px-8 py-8 md:py-10 border-b border-gray-200 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">BlogKit</p>
              <h1 id="site-intro-heading" className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                네이버 블로그 썸네일 무료 제작과 운영 가이드
              </h1>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed max-w-4xl">
            <p>
              이 사이트는 단순히 이미지 한 장을 내보내는 도구만 제공하지 않습니다. 맛집·카페·여행 등 네이버
              블로그에서 클릭이 나오려면 <strong className="font-semibold text-gray-800">대표 이미지 문구</strong>가
              검색 키워드와 읽는 맥락을 동시에 맞춰야 한다는 전제를 바탕으로, 제작기와 함께{' '}
              <strong className="font-semibold text-gray-800">실전 노하우 글</strong>을 같은 도메인에 모아
              두었습니다. 그래서 홈에서는 바로 썸네일·스킨을 만들고, 블로그 섹션에서는 제목·키워드·사진까지
              연결되는 긴 글을 이어 읽을 수 있습니다.
            </p>
            <p>
              아래 도구는 브라우저 안에서만 동작하며, 배경으로 올린 사진은 서버로 전송되지 않습니다. 작업
              흐름은 &ldquo;가이드로 왜 이렇게 쓰는지 이해 → 같은 스타일로 썸네일 통일 → 글 본문과 톤
              맞추기&rdquo; 순서를 추천합니다. 운영 목적과 연락처는{' '}
              <Link href="/about" className="text-gray-900 font-medium underline underline-offset-2 hover:no-underline">
                About
              </Link>
              에 정리해 두었습니다.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              블로그·가이드 전체 보기
            </Link>
            <Link
              href="/guide/thumbnail"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors"
            >
              썸네일 만드는 법 (가이드)
            </Link>
            <Link
              href="/guide/blog-seo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors"
            >
              블로그 검색 노출 기초
            </Link>
          </div>
        </div>
      </section>

      {/* ── 도구 탭 ── */}
      <section id="tool" className="px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto">

          {/* 썸네일 메이커 탭 */}
          {activeMainTab === 'thumbnail' && (
            <>
              {/* 스타일 프리셋 선택 */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">스타일 선택</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition ${
                        activePresetId === preset.id
                          ? 'bg-[#111111] text-white border-gray-900 shadow'
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
                      className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
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
                  {...(textShadow ? { titleFontSize, setTitleFontSize } : {})}
                />
                <ThumbnailPreview
                  previewRef={previewRef}
                  title={title} subtitle={subtitle} category={category}
                  textColor={textColor} fontFamily={fontFamily} textAlign={textAlign} textVAlign={textVAlign} textOffsetX={textOffsetX} textOffsetY={textOffsetY}
                  bgType={bgType} bgColor={bgColor} bgImage={bgImage}
                  overlayOpacity={overlayOpacity} frameType={frameType}
                  textShadow={textShadow}
                  titleFontSize={titleFontSize}
                  bgOffsetX={bgOffsetX}
                  bgOffsetY={bgOffsetY}
                  onBgOffsetChange={(x, y) => { setBgOffsetX(x); setBgOffsetY(y); }}
                  bgRotation={bgRotation}
                  onBgRotate={() => setBgRotation(r => (r + 90) % 360)}
                  onDownload={downloadThumbnail} isDownloading={isDownloading} isDownloadDone={isDownloadDone}
                  downloadFormat={downloadFormat} onFormatChange={setDownloadFormat}
                  downloadScale={downloadScale} onScaleChange={setDownloadScale}
                  fileName={fileName} setFileName={setFileName}
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

      {/* 다운로드 완료 후 다음 단계 */}
      {isDownloadDone && activeMainTab === 'thumbnail' && (
        <section className="px-4 md:px-8 py-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">다운로드 완료 - 다음 단계</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/blog/how-to-make-blog-thumbnail" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition bg-[#f5f5f0]">
                <span className="text-xl mt-0.5">📝</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">이 썸네일로 글 쓰는 법</p>
                  <p className="text-xs text-gray-500">글 구조부터 이미지 삽입까지</p>
                </div>
              </Link>
              <Link href="/blog/blog-writing-tips" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition bg-[#f5f5f0]">
                <span className="text-xl mt-0.5">🔤</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">조회수 잘 나오는 제목 쓰는 법</p>
                  <p className="text-xs text-gray-500">클릭률 2배 높이는 제목 공식</p>
                </div>
              </Link>
              <Link href="/blog/blog-monetization-guide" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition bg-[#f5f5f0]">
                <span className="text-xl mt-0.5">💰</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">블로그 수익화 시작하기</p>
                  <p className="text-xs text-gray-500">애드포스트·체험단·CPA 연결법</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 광고 */}
      <div className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <AdBanner position="home-mid" type="adsense" />
        </div>
      </div>

      {/* 인기 템플릿 */}
      <section id="popular-templates" className="px-4 md:px-8 py-10 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">인기 템플릿</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">클릭률 높은 썸네일 스타일</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  applyPreset(preset);
                  setActiveMainTab('thumbnail');
                  document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left group"
              >
                <div className="aspect-video bg-gray-200 relative rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preset.bgImage} alt={preset.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                    <span className="text-white text-xs font-bold drop-shadow">{preset.label}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {preset.emoji} {preset.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 광고 */}
      <div className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <AdBanner position="home-bottom" type="adsense" />
        </div>
      </div>

      {/* html2canvas: 썸네일 다운로드 기능이 있는 이 페이지에서만 로드 */}
      <Script src={HTML2CANVAS_SCRIPT_SRC} strategy="afterInteractive" />

      <SiteFooter />
    </div>
  );
}
