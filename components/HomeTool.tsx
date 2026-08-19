'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { BookOpen, RotateCcw } from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType, SubtitlePosition } from '@/lib/types';
import ControlPanel from '@/components/ControlPanel';
import ThumbnailPreview from '@/components/ThumbnailPreview';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { HTML2CANVAS_SCRIPT_SRC } from '@/lib/constants';
import { blogPosts } from '@/data/blogPosts';

const HOME_PILLAR_SLUGS = [
  'how-to-make-blog-thumbnail',
  'blog-keyword-strategy-complete',
  'high-ctr-thumbnail',
  'naver-blog-increase-visitors',
] as const;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html2canvas?: (el: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

interface StylePreset {
  id: string;
  label: string;
  imageAlt: string;
  emoji: string;
  bgType: BgType;
  bgColor: string;
  bgImage: string;
  textColor: string;
  fontFamily: string;
  frameType: FrameType;
  overlayOpacity: number;
  textAlign: TextAlign;
  textVAlign: TextVAlign;
  title: string;
  subtitle: string;
  category: string;
  categoryOptions: readonly string[];
  textShadow: boolean;
  // 먹방 스타일 확장 (미지정 시 기존 렌더와 동일)
  accentColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  titleHighlightColor?: string;
  subtitlePosition?: SubtitlePosition;
  subtitleFontFamily?: string;
  subtitleColor?: string;
  titleFontSize?: number;
}

const STYLE_PRESETS: readonly StylePreset[] = [
  {
    id: 'naver',
    label: '아웃라인',
    imageAlt: '네이버 블로그 맛집 썸네일 204x204 치킨·맥주 후기 스타일 예시',
    emoji: '📝',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/251116애플하우스/IMG_6831.JPG',
    textColor: '#ffffff',
    fontFamily: `'SBAggro', sans-serif`,
    frameType: 'band' as FrameType,
    overlayOpacity: 0,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '*맥주* 맛집 🍺\n치킨 세트 후기',
    subtitle: '수제맥주랑 먹으니 완벽했습니다',
    category: '',
    categoryOptions: ['맛집 후기', '술집 추천', '안주 맛집', '재방문 의사'],
    textShadow: true,
    accentColor: '#ffe14d',
    outlineColor: '#111111',
    outlineWidth: 3,
  },
  {
    id: 'cafe',
    label: '감성',
    imageAlt: '네이버 블로그 카페·디저트 썸네일 204x204 감성 스타일 예시',
    emoji: '🍽️',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/260208에디션엠/에디션엠-감귤케이크-딸기음료-메인.JPG',
    textColor: '#ffffff',
    fontFamily: `'OwnglyphParkDaHyun', cursive`,
    frameType: 'none' as FrameType,
    overlayOpacity: 10,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '분위기 좋은\n*감성 카페* 기록',
    subtitle: '혼자 오기 딱 좋은 조용한 공간',
    category: '카페 기록',
    categoryOptions: ['카페 기록', '맛집 탐방', '방문 후기', '재방문 리스트'],
    textShadow: true,
    accentColor: '#ff8fb3',
    subtitlePosition: 'above',
    subtitleColor: '#5d4037',
  },
  {
    id: 'review',
    label: '보더',
    imageAlt: '네이버 블로그 체험단·디저트 리뷰 썸네일 204x204 예시',
    emoji: '🎁',
    bgType: 'image' as BgType,
    bgColor: '#1a1a1a',
    bgImage: '/images/250118코르크베이크바/IMG_7578.JPG',
    textColor: '#ffffff',
    fontFamily: `'TMoneyRoundWind', sans-serif`,
    frameType: 'solid' as FrameType,
    overlayOpacity: 30,
    textAlign: 'center' as TextAlign,
    textVAlign: 'middle' as TextVAlign,
    title: '솔직한 체험단\n*디저트* 후기',
    subtitle: '직접 먹고 평가했습니다',
    category: '체험 후기',
    categoryOptions: ['체험 후기', '솔직 후기', '제품 리뷰', '사용 전/후'],
    textShadow: false,
    accentColor: '#ffd43b',
    subtitlePosition: 'above',
    subtitleFontFamily: `'Gaegu', cursive`,
    subtitleColor: '#ffd43b',
  },
  {
    id: 'finance',
    label: '골드',
    imageAlt: '네이버 블로그 재테크·정보 썸네일 204x204 골드 톤 예시',
    emoji: '📈',
    bgType: 'image' as BgType,
    bgColor: '#0a2540',
    bgImage: '/images/251231지관서가/안동북카페-지관서가-1층내부-서가창가뷰.JPG',
    textColor: '#fdcb6e',
    fontFamily: `'GmarketSans', sans-serif`,
    frameType: 'corners' as FrameType,
    overlayOpacity: 30,
    textAlign: 'left' as TextAlign,
    textVAlign: 'bottom' as TextVAlign,
    title: '직장인\n*재테크* 실전기',
    subtitle: '절약과 투자, 지금 시작하세요',
    category: '재테크',
    categoryOptions: ['재테크 기초', '절약 팁', '투자 후기', '부업 기록'],
    textShadow: false,
    accentColor: '#ffffff',
  },
  {
    id: 'travel',
    label: '클래식',
    imageAlt: '네이버 블로그 여행·나들이 썸네일 204x204 예시',
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
    title: '국내 *이색 공간*\n나들이 추천',
    subtitle: '일상 탈출 코스로 딱입니다',
    category: '나들이',
    categoryOptions: ['나들이', '국내 여행', '이색 체험', '여행 준비'],
    textShadow: false,
    accentColor: '#ffd43b',
  },
  {
    id: 'mukbang-red',
    label: '푸드팝',
    imageAlt: '네이버 블로그 먹방 썸네일 204x204 두꺼운 외곽선 뭉티기 예시',
    emoji: '🍖',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/260402환이네뭉티기호매실본점/IMG_9191.JPG',
    textColor: '#ffffff',
    fontFamily: `'CookieRun', sans-serif`,
    frameType: 'none',
    overlayOpacity: 0,
    textAlign: 'center',
    textVAlign: 'bottom',
    title: '대구 별미\n*뭉티기* 먹방',
    subtitle: '입에서 살살 녹아요 ~~!!',
    category: '',
    categoryOptions: ['맛집 후기', '현지인 맛집', '먹방', '재방문 의사'],
    textShadow: true,
    accentColor: '#ffe14d',
    outlineColor: '#e63946',
    outlineWidth: 4,
    subtitlePosition: 'above',
    subtitleFontFamily: `'Nanum Pen Script', cursive`,
    subtitleColor: '#ffe14d',
  },
  {
    id: 'mukbang-fresh',
    label: '포차',
    imageAlt: '네이버 블로그 포차 안주 먹방 썸네일 204x204 컬러 제목 예시',
    emoji: '🍢',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/260315생마차/IMG_8526.JPG',
    textColor: '#ff5050',
    fontFamily: `'BMEuljiro', sans-serif`,
    frameType: 'none',
    overlayOpacity: 0,
    textAlign: 'left',
    textVAlign: 'bottom',
    title: '퇴근하고 *생마차*\n안주 털기',
    subtitle: '포차 감성 그 자체 ~~',
    category: '',
    categoryOptions: ['술집 추천', '안주 맛집', '먹방', '재방문 의사'],
    textShadow: true,
    accentColor: '#aee92e',
    outlineColor: '#ffffff',
    outlineWidth: 4,
    subtitlePosition: 'above',
    subtitleFontFamily: `'Nanum Pen Script', cursive`,
    subtitleColor: '#2f6b2f',
  },
  {
    id: 'mukbang-yellow',
    label: '옐로',
    imageAlt: '네이버 블로그 쌀국수 맛집 먹방 썸네일 204x204 옐로 톤 예시',
    emoji: '🧀',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/260328루나아시아/IMG_8977.JPG',
    textColor: '#ffd400',
    fontFamily: `'Cafe24Surround', sans-serif`,
    frameType: 'band',
    overlayOpacity: 0,
    textAlign: 'center',
    textVAlign: 'bottom',
    title: '루나아시아\n*쌀국수* 정복',
    subtitle: '국물이 진국이에요 !!',
    category: '',
    categoryOptions: ['맛집 후기', '아시아 음식', '먹방', '점심 추천'],
    textShadow: true,
    accentColor: '#ffffff',
    outlineColor: '#7b3f00',
    outlineWidth: 4,
    subtitlePosition: 'above',
    subtitleFontFamily: `'Nanum Pen Script', cursive`,
    subtitleColor: '#ffd400',
  },
  {
    id: 'mukbang-pink',
    label: '디저트',
    imageAlt: '네이버 블로그 디저트 먹방 썸네일 204x204 핑크 톤 요거트 예시',
    emoji: '🍦',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/260405요거트월드두바이폭탄반반/IMG_9425.JPG',
    textColor: '#ff8fb3',
    fontFamily: `'OneMobilePop', sans-serif`,
    frameType: 'none',
    overlayOpacity: 0,
    textAlign: 'center',
    textVAlign: 'bottom',
    title: '*두바이* 요거트\n반반 먹방',
    subtitle: '단짠단짠 미쳤다 ,,',
    category: '',
    categoryOptions: ['디저트 맛집', '카페 기록', '먹방', '신상 후기'],
    textShadow: true,
    accentColor: '#ffe14d',
    outlineColor: '#ffffff',
    outlineWidth: 4,
    subtitlePosition: 'above',
    subtitleFontFamily: `'Nanum Pen Script', cursive`,
    subtitleColor: '#ff8fb3',
  },
  {
    id: 'impact',
    label: '임팩트',
    imageAlt: '네이버 블로그 매운맛 먹방 썸네일 204x204 검정 외곽선 임팩트 예시',
    emoji: '🔥',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/251116애플하우스/IMG_6822.JPG',
    textColor: '#ffffff',
    fontFamily: `'Black Han Sans', sans-serif`,
    frameType: 'none',
    overlayOpacity: 0,
    textAlign: 'center',
    textVAlign: 'bottom',
    title: '스트레스 풀리는\n*매운맛* 모음',
    subtitle: '오늘은 맵부심 부리는 날 !!',
    category: '',
    categoryOptions: ['맛집 후기', '분식 맛집', '매운맛 도전', '재방문 의사'],
    textShadow: true,
    accentColor: '#ff5050',
    outlineColor: '#111111',
    outlineWidth: 3,
    subtitlePosition: 'above',
    subtitleFontFamily: `'Nanum Pen Script', cursive`,
    subtitleColor: '#ffe14d',
  },
  {
    id: 'highlight',
    label: '박스',
    imageAlt: '네이버 블로그 커리 맛집 썸네일 204x204 하이라이트 박스 예시',
    emoji: '🍛',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/260328루나아시아/IMG_8981.JPG',
    textColor: '#e8590c',
    fontFamily: `'Jua', sans-serif`,
    frameType: 'none',
    overlayOpacity: 0,
    textAlign: 'left',
    textVAlign: 'bottom',
    title: '동남아 *커리*\n맛집 리스트',
    subtitle: '향신료 가득 이국 감성 >.<',
    category: '',
    categoryOptions: ['맛집 후기', '아시아 음식', '이국 감성', '재방문 의사'],
    textShadow: true,
    accentColor: '#2b8a3e',
    titleHighlightColor: '#ffffff',
    subtitlePosition: 'above',
    subtitleFontFamily: `'Nanum Pen Script', cursive`,
    subtitleColor: '#e8590c',
  },
  {
    id: 'simple',
    label: '심플',
    imageAlt: '네이버 블로그 국밥 맛집 썸네일 204x204 해시태그 미니멀 예시',
    emoji: '🍲',
    bgType: 'image',
    bgColor: '#1a1a1a',
    bgImage: '/images/260315생마차/IMG_8534.JPG',
    textColor: '#ffffff',
    fontFamily: `'Paperlogy', sans-serif`,
    frameType: 'band',
    overlayOpacity: 0,
    textAlign: 'left',
    textVAlign: 'bottom',
    title: '서울 *국밥* 맛집 모음',
    subtitle: '다시 생각나는 진한 국물',
    category: '#서울맛집',
    categoryOptions: ['#서울맛집', '#국밥', '#혼밥', '#맛집모음'],
    textShadow: false,
    accentColor: '#ffd43b',
  },
  {
    id: 'infocard',
    label: '카드',
    imageAlt: '네이버 블로그 정보성 글 썸네일 204x204 텍스트 카드 예시',
    emoji: '📌',
    bgType: 'color',
    bgColor: '#fff4e6',
    bgImage: '',
    textColor: '#343a40',
    fontFamily: `'Do Hyeon', sans-serif`,
    frameType: 'solid',
    overlayOpacity: 0,
    textAlign: 'center',
    textVAlign: 'middle',
    title: '한 장 정리\n*생활 꿀팁*',
    subtitle: '저장해두고 보세요',
    category: '꿀팁 노트',
    categoryOptions: ['꿀팁 노트', '정보 정리', '체크리스트', '살림 팁'],
    textShadow: false,
    accentColor: '#e64980',
  },
];


export function HomeTool({ seoAfterTool }: { seoAfterTool?: React.ReactNode }) {
  const [title, setTitle] = useState('맥주 맛집 🍺\n치킨 세트 후기');
  const [subtitle, setSubtitle] = useState('수제맥주랑 먹으니 완벽했습니다');
  const [category, setCategory] = useState('');

  const [bgType, setBgType] = useState<BgType>('image');
  const [bgColor, setBgColor] = useState('#1a1a1a');
  const [bgImage, setBgImage] = useState<string | null>('/images/251116애플하우스/IMG_6831.JPG');

  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState(`'Pretendard', sans-serif`);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [textVAlign, setTextVAlign] = useState<TextVAlign>('bottom');
  const [textOffsetX, setTextOffsetX] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);

  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [frameType, setFrameType] = useState<FrameType>('band');
  const [bandDarkness, setBandDarkness] = useState(100);
  const [textShadow, setTextShadow] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState(60);
  const [accentColor, setAccentColor] = useState('#ffe14d');
  const [outlineColor, setOutlineColor] = useState('#ffffff');
  const [outlineWidth, setOutlineWidth] = useState(0);
  const [titleHighlightColor, setTitleHighlightColor] = useState<string | undefined>(undefined);
  const [subtitlePosition, setSubtitlePosition] = useState<SubtitlePosition>('below');
  const [subtitleFontFamily, setSubtitleFontFamily] = useState<string | undefined>(undefined);
  const [subtitleColor, setSubtitleColor] = useState<string | undefined>(undefined);
  const [bgOffsetX, setBgOffsetX] = useState(50);
  const [bgOffsetY, setBgOffsetY] = useState(50);
  const [bgRotation, setBgRotation] = useState(0);
  const [bgScale, setBgScale] = useState(100);

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [downloadScale, setDownloadScale] = useState<1 | 2>(2);
  const [fileName, setFileName] = useState('blog_thumbnail');
  const [activePresetId, setActivePresetId] = useState<string | null>('naver');
  const [isDownloadDone, setIsDownloadDone] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const applyPreset = (preset: StylePreset) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setCategory(preset.category);
    setBgType(preset.bgType);
    setBgColor(preset.bgColor);
    setBgImage(preset.bgImage || null);
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
    setBgScale(100);
    setBandDarkness(100);
    setAccentColor(preset.accentColor ?? '#ffe14d');
    setOutlineColor(preset.outlineColor ?? '#ffffff');
    setOutlineWidth(preset.outlineWidth ?? 0);
    setTitleHighlightColor(preset.titleHighlightColor);
    setSubtitlePosition(preset.subtitlePosition ?? 'below');
    setSubtitleFontFamily(preset.subtitleFontFamily);
    setSubtitleColor(preset.subtitleColor);
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
          setBgScale(100);
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
  const pillarPosts = HOME_PILLAR_SLUGS.map((slug) => blogPosts.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => p != null,
  );

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-800 font-sans flex flex-col">

      {/* ── 헤더 ── */}
      <SiteHeader />

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
                네이버 블로그 CTR·검색유입·썸네일 전략
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                검색 노출·제목·키워드·썸네일 문구를 다루는 가이드 허브 — 실습용 무료 도구 포함
              </p>
            </div>
          </div>
          <div className="space-y-4 text-base text-gray-600 leading-relaxed max-w-3xl">
            <p>
              BlogKit은 네이버 블로그 운영자를 위한 <strong className="font-semibold text-gray-800">콘텐츠·연구
              가이드</strong> 사이트입니다. 클릭률(CTR), 검색 유입, 제목 구조, 키워드 배치, 썸네일 문구 패턴을
              {blogPosts.length}편의 글로 정리해 두었고, 같은 도메인에서 가이드를 읽은 뒤 바로 적용할 수 있는{' '}
              <strong className="font-semibold text-gray-800">무료 썸네일·스킨 도구</strong>를 보조로 제공합니다.
            </p>
            <p>
              권장 흐름은 &ldquo;가이드로 전략 이해 → 썸네일 문구·디자인 통일 → 글 본문과 톤 맞추기&rdquo;입니다.
              아래 <a href="#tool" className="text-gray-900 font-medium underline underline-offset-2 hover:no-underline">썸네일 만들기</a>에서
              실습하고, 운영 방침·연락처는{' '}
              <Link href="/about" className="text-gray-900 font-medium underline underline-offset-2 hover:no-underline">
                About
              </Link>
              에 정리해 두었습니다.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">핵심 가이드</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pillarPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-4 bg-[#f5f5f0] rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <p className="text-sm font-bold text-gray-900 leading-snug mb-1">{post.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{post.summary}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              가이드 전체 보기
            </Link>
            <a
              href="#tool"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors"
            >
              썸네일 만들기
            </a>
            <Link
              href="/guide/blog-seo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors"
            >
              블로그 검색 노출 기초
            </Link>
            <Link
              href="/skin-maker"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:border-gray-400 transition-colors"
            >
              블로그 스킨메이커
            </Link>
          </div>
        </div>
      </section>

      {/* ── 도구 탭 ── */}
      <section id="tool" className="px-4 md:px-8 py-8 md:py-10">
        <div className="max-w-6xl mx-auto">

          {/* 썸네일 메이커 */}
          <>
              {/* 도구 안내 헤더 */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">무료 도구</p>
                <h2 className="text-xl font-bold text-gray-900 mb-1">썸네일 만들기</h2>
                <p className="text-sm text-gray-500 mb-6">프리셋을 고르고 제목만 바꾸면 됩니다. 가입 없이 PNG로 저장하세요.</p>
              </div>

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
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-gray-200 hover:border-gray-300 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
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
                  categoryOptions={activePreset?.categoryOptions}
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
                  bgScale={bgScale} setBgScale={setBgScale}
                  bandDarkness={bandDarkness} setBandDarkness={setBandDarkness}
                  accentColor={accentColor} setAccentColor={setAccentColor}
                  {...(textShadow ? { titleFontSize, setTitleFontSize, outlineWidth, setOutlineWidth, outlineColor, setOutlineColor } : {})}
                />
                <ThumbnailPreview
                  previewRef={previewRef}
                  title={title} subtitle={subtitle} category={category}
                  textColor={textColor} fontFamily={fontFamily} textAlign={textAlign} textVAlign={textVAlign} textOffsetX={textOffsetX} textOffsetY={textOffsetY}
                  bgType={bgType} bgColor={bgColor} bgImage={bgImage}
                  overlayOpacity={overlayOpacity} frameType={frameType}
                  bandDarkness={bandDarkness}
                  textShadow={textShadow}
                  titleFontSize={titleFontSize}
                  accentColor={accentColor}
                  outlineWidth={outlineWidth}
                  outlineColor={outlineColor}
                  titleHighlightColor={titleHighlightColor}
                  subtitlePosition={subtitlePosition}
                  subtitleFontFamily={subtitleFontFamily}
                  subtitleColor={subtitleColor}
                  bgOffsetX={bgOffsetX}
                  bgOffsetY={bgOffsetY}
                  onBgOffsetChange={(x, y) => { setBgOffsetX(x); setBgOffsetY(y); }}
                  bgRotation={bgRotation}
                  onBgRotate={() => setBgRotation(r => (r + 90) % 360)}
                  bgScale={bgScale}
                  onBgScaleChange={setBgScale}
                  onDownload={downloadThumbnail} isDownloading={isDownloading} isDownloadDone={isDownloadDone}
                  downloadFormat={downloadFormat} onFormatChange={setDownloadFormat}
                  downloadScale={downloadScale} onScaleChange={setDownloadScale}
                  fileName={fileName} setFileName={setFileName}
                />
              </div>
          </>

        </div>
      </section>

      {seoAfterTool}

      {/* 다운로드 완료 후 다음 단계 */}
      {isDownloadDone && (
        <section className="px-4 md:px-8 py-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">다운로드 완료 - 다음 단계</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/blog/how-to-make-blog-thumbnail" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition bg-[#f5f5f0]">
                <span className="text-xl mt-0.5">📝</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">이 썸네일로 글 쓰는 법</p>
                  <p className="text-xs text-gray-500">글 구조부터 이미지 삽입까지</p>
                </div>
              </Link>
              <Link href="/blog/blog-writing-tips" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition bg-[#f5f5f0]">
                <span className="text-xl mt-0.5">🔤</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">조회수 잘 나오는 제목 쓰는 법</p>
                  <p className="text-xs text-gray-500">클릭률 2배 높이는 제목 공식</p>
                </div>
              </Link>
              <Link href="/skin-maker" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition bg-[#f5f5f0]">
                <span className="text-xl mt-0.5">🎨</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">블로그 스킨도 같은 톤으로</p>
                  <p className="text-xs text-gray-500">무료 스킨메이커로 상단 영역 통일</p>
                </div>
              </Link>
              <Link href="/blog/blog-monetization-guide" className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition bg-[#f5f5f0]">
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

      {/* ── 가이드 글 목록 ── */}
      <section aria-labelledby="home-posts-heading" className="px-4 md:px-8 py-8 md:py-10 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">가이드 글</p>
          <h2 id="home-posts-heading" className="text-xl font-bold text-gray-900 mb-6">
            네이버 블로그 운영 실전 가이드
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...blogPosts]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 9)
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-4 bg-[#f5f5f0] rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <p className="text-xs text-gray-400 mb-1">{post.date}</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug mb-1">{post.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{post.summary}</p>
                </Link>
              ))}
          </div>
          <div className="mt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              전체 가이드 {blogPosts.length}편 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 인기 템플릿 */}
      <section id="popular-templates" className="px-4 md:px-8 py-8 md:py-10 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">인기 템플릿</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">클릭률 높은 썸네일 스타일</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  applyPreset(preset);
                  document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left group"
              >
                <div className="aspect-video bg-gray-200 relative rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                  {preset.bgType === 'color' ? (
                    <div className="w-full h-full" style={{ backgroundColor: preset.bgColor }} aria-label={preset.imageAlt} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preset.bgImage} alt={preset.imageAlt} className="w-full h-full object-cover" />
                  )}
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

      {/* html2canvas: 썸네일 다운로드 기능이 있는 이 페이지에서만 로드 */}
      <Script src={HTML2CANVAS_SCRIPT_SRC} strategy="afterInteractive" />

      <SiteFooter />
    </div>
  );
}
