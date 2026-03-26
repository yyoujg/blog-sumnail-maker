'use client';

import React, { type RefObject } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType } from '@/lib/types';
import CoupangCard from './CoupangCard';

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
      {/* ── CTA 영역 ── */}
      <div className="w-full max-w-[500px] mt-12">
        <hr className="border-gray-100 mb-12" />
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <p className="font-semibold text-sm text-gray-800 mb-2">썸네일만으로는 부족합니다</p>
          <p className="text-xs text-gray-500 mb-1">조회수는 이것으로 결정됩니다</p>
          <ul className="text-xs text-gray-500 mb-3 space-y-0.5 pl-3">
            <li>- 제목</li>
            <li>- 키워드</li>
            <li>- 글 구조</li>
          </ul>
          <Link
            href="/guide/blog-seo"
            className="text-sm font-semibold text-gray-900 underline underline-offset-2"
          >
            조회수 올리는 방법 보기 →
          </Link>
        </div>
      </div>

      {/* ── 광고 1개 ── */}
      <div className="w-full max-w-[500px] mt-12">
        <hr className="border-gray-100 mb-12" />
        <div className="max-w-[340px] mx-auto">
          <CoupangCard
            src="https://coupa.ng/clQwSN"
            name="셀루미 초경량 스마트폰 삼각대"
            desc="배경 사진 직접 찍어 쓰는 분들께 추천해요. 손떨림 없이 고정된 앵글로 찍으면 썸네일 소스 퀄리티가 확 달라집니다."
          />
        </div>
      </div>

      {isDownloadDone && (
        <div className="w-full max-w-[500px] mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-green-800">✔ 썸네일 완성되었습니다</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-green-700 font-semibold underline underline-offset-2 hover:text-green-900 flex-shrink-0"
          >
            다른 썸네일 만들기
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        * 생성된 이미지는 1:1 정방형 사이즈로 네이버 블로그에 최적화되어 있습니다.
      </p>
    </div>
  );
}
