'use client';

import React, { type RefObject } from 'react';
import Link from 'next/link';
import { Download, ArrowRight } from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType } from '@/lib/types';
import CoupangCard from './CoupangCard';
import AdBanner from './AdBanner';

interface ThumbnailPreviewProps {
  previewRef: RefObject<HTMLDivElement | null>;
  title: string;
  subtitle: string;
  category: string;
  textColor: string;
  fontFamily: string;
  textAlign: TextAlign;
  textVAlign: TextVAlign;
  textOffsetX: number;
  textOffsetY: number;
  bgType: BgType;
  bgColor: string;
  bgImage: string | null;
  overlayOpacity: number;
  frameType: FrameType;
  onDownload: () => void;
  isDownloading: boolean;
  isDownloadDone: boolean;
  downloadFormat: 'png' | 'jpg';
  onFormatChange: (f: 'png' | 'jpg') => void;
  downloadScale: 1 | 2;
  onScaleChange: (s: 1 | 2) => void;
}

export default function ThumbnailPreview({
  previewRef,
  title,
  subtitle,
  category,
  textColor,
  fontFamily,
  textAlign,
  textVAlign,
  textOffsetX,
  textOffsetY,
  bgType,
  bgColor,
  bgImage,
  overlayOpacity,
  frameType,
  onDownload,
  isDownloading,
  isDownloadDone,
  downloadFormat,
  onFormatChange,
  downloadScale,
  onScaleChange,
}: ThumbnailPreviewProps) {
  return (
    <div className="flex-1 flex flex-col items-center lg:sticky lg:top-8 h-fit">
      <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4 flex flex-col items-center">
        <h3 className="w-full text-left font-semibold text-gray-800 mb-4 px-2">
          미리보기 (1:1 비율)
        </h3>

        <div
          className="w-full max-w-[500px] aspect-square relative overflow-hidden p-8 sm:p-12"
          ref={previewRef}
          style={{
            backgroundColor: bgType === 'color' ? bgColor : '#ffffff',
            backgroundImage: bgType === 'image' && bgImage ? `url(${bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: fontFamily,
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
            color: textColor,
            borderColor: 'transparent',
            outline: 'none',
          }}
        >
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
          />

          {frameType === 'solid' && (
            <div
              className="absolute inset-4 sm:inset-6 border-4 z-10 pointer-events-none"
              style={{ borderColor: textColor }}
            />
          )}
          {frameType === 'double' && (
            <div
              className="absolute inset-4 sm:inset-6 border-[6px] border-double z-10 pointer-events-none"
              style={{ borderColor: textColor }}
            />
          )}
          {frameType === 'corners' && (
            <div className="absolute inset-6 z-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: textColor }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: textColor }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: textColor }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: textColor }} />
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent:
                textVAlign === 'top' ? 'flex-start' :
                textVAlign === 'bottom' ? 'flex-end' : 'center',
              alignItems:
                textAlign === 'center' ? 'center' :
                textAlign === 'right' ? 'flex-end' : 'flex-start',
              padding: frameType === 'none' ? '1.75rem' : '2.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: textColor,
                textAlign: textAlign,
                alignItems:
                  textAlign === 'center' ? 'center' :
                  textAlign === 'right' ? 'flex-end' : 'flex-start',
                maxWidth: '100%',
                transform: `translate(${textOffsetX}%, ${textOffsetY}%)`,
              }}
            >
              {category && (
                <span
                  className="text-xs font-bold tracking-wider uppercase border rounded-full px-3 py-1 w-fit"
                  style={{ borderColor: textColor, opacity: 0.9 }}
                >
                  {category}
                </span>
              )}
              {title && (
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight break-keep"
                  style={{ wordBreak: 'keep-all' }}
                >
                  {title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base md:text-xl opacity-80 break-keep font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 결과 이미지 아래 심리 자극 문구 */}
        <p className="mt-3 text-xs text-center text-green-700 font-semibold bg-green-50 rounded-xl px-4 py-2 w-full max-w-[500px]">
          이 썸네일 그대로 블로그에 쓰면 클릭률 올라갑니다
        </p>
      </div>

      {/* Download options */}
      <div className="w-full max-w-[500px] bg-white rounded-2xl border border-gray-200 p-4 mb-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">파일 형식</p>
            <div className="flex gap-2">
              {(['png', 'jpg'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => onFormatChange(f)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                    downloadFormat === f
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">해상도</p>
            <div className="flex gap-2">
              {([
                { value: 1 as const, label: '1× 표준' },
                { value: 2 as const, label: '2× 고화질' },
              ]).map((s) => (
                <button
                  key={s.value}
                  onClick={() => onScaleChange(s.value)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                    downloadScale === s.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {downloadFormat === 'jpg' && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            JPG는 투명 배경을 지원하지 않습니다. 배경이 있는 썸네일에 사용하세요.
          </p>
        )}
      </div>

      <button
        onClick={onDownload}
        disabled={isDownloading}
        className={`w-full max-w-[500px] flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${
          isDownloading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1'
        }`}
      >
        {isDownloading ? (
          <span className="animate-pulse">이미지 생성 중...</span>
        ) : (
          <>
            <Download className="w-6 h-6" />
            {downloadFormat.toUpperCase()} 다운로드 {downloadScale === 2 ? '(고화질)' : ''}
          </>
        )}
      </button>
      {/* 쿠팡: 다운로드 버튼 바로 아래 */}
      <CoupangCard
        src="https://coupa.ng/clQwOg"
        name="KL-149B 미니 LED 촬영 조명"
        desc="배경 이미지 찍을 때 조명 하나 있으면 사진 퀄리티가 확 달라져요. 작고 가벼워서 책상 위에 두고 쓰기 딱 좋습니다."
      />

      {isDownloadDone && (
        <div className="w-full max-w-[500px] mt-2 flex flex-col gap-3">

          {/* ① 블로그 글 쓰기 유도 */}
          <div className="bg-gray-900 rounded-2xl p-5 text-white">
            <p className="font-bold text-base mb-0.5">✔ 썸네일 완성되었습니다</p>
            <p className="text-sm text-gray-300 font-semibold mb-4">👇 이제 이걸로 블로그 글 써보세요</p>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { label: '조회수 잘 나오는 제목 만들기', href: '/blog/high-ctr-thumbnail', emoji: '✏️' },
                { label: '키워드 찾는 방법', href: '/blog/naver-blog-seo-guide', emoji: '🔍' },
                { label: '블로그 수익 구조', href: '/blog/blog-monetization-guide', emoji: '💰' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-sm font-semibold transition"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 bg-white text-gray-900 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-100 transition"
            >
              추천 글 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ② 진짜 돈 구간 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="font-bold text-sm text-gray-800 mb-3">블로그 하시는 분들은 이거 같이 씁니다</p>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { label: '키워드 분석 툴', href: '/blog/naver-blog-seo-guide' },
                { label: '글쓰기 강의', href: '/blog/blog-writing-tips' },
                { label: '수익화 방법', href: '/blog/blog-monetization-guide' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
                >
                  <span className="text-green-500 font-bold">✔</span>
                  <span>{item.label}</span>
                  <ArrowRight className="w-3 h-3 ml-auto text-gray-400" />
                </Link>
              ))}
            </div>
            <Link
              href="/blog/blog-monetization-guide"
              className="flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
            >
              추천 도구 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 재사용 유도 */}
          <p className="text-center text-xs text-gray-500 py-1">
            다른 썸네일도 만들어보세요 →{' '}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-800 font-semibold underline underline-offset-2 hover:text-gray-900"
            >
              스타일 바꾸기
            </button>
          </p>
        </div>
      )}

      <AdBanner type="adsense" position="main-download-below" />
      <p className="text-sm text-gray-500 mt-4 text-center">
        * 생성된 이미지는 1:1 정방형 사이즈로 네이버 블로그에 최적화되어 있습니다.
        <br />
        (PC와 모바일에서 모두 잘림 없이 보입니다)
      </p>
    </div>
  );
}
