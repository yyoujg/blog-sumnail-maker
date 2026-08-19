'use client';

import React, { type RefObject, useRef, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { TextAlign, TextVAlign, FrameType, BgType, SubtitlePosition, StylePreset } from '@/lib/types';

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
  bandDarkness: number;
  onDownload: () => void;
  isDownloading: boolean;
  isDownloadDone: boolean;
  downloadFormat: 'png' | 'jpg';
  onFormatChange: (f: 'png' | 'jpg') => void;
  downloadScale: 1 | 2;
  onScaleChange: (s: 1 | 2) => void;
  fileName: string;
  setFileName: (v: string) => void;
  textShadow?: boolean;
  titleFontSize?: number;
  accentColor?: string;
  outlineWidth?: number;
  outlineColor?: string;
  titleHighlightColor?: string;
  subtitlePosition?: SubtitlePosition;
  subtitleFontFamily?: string;
  subtitleColor?: string;
  bgOffsetX: number;
  bgOffsetY: number;
  onBgOffsetChange: (x: number, y: number) => void;
  bgRotation: number;
  onBgRotate: () => void;
  bgScale: number;
  onBgScaleChange: (v: number) => void;
}

const OUTLINE = '-1px -1px 0 rgba(0,0,0,0.75), 1px -1px 0 rgba(0,0,0,0.75), -1px 1px 0 rgba(0,0,0,0.75), 1px 1px 0 rgba(0,0,0,0.75), 0 2px 10px rgba(0,0,0,0.55)';

const BAND_GRADIENT_BASE = [0.92, 0.7, 0.55, 0.22] as const;

function bandGradient(darkness: number) {
  const m = darkness / 100;
  const [a0, a1, a2, a3] = BAND_GRADIENT_BASE.map((a) => a * m);
  return `linear-gradient(to top, rgba(0,0,0,${a0}) 0%, rgba(0,0,0,${a1}) 28%, rgba(0,0,0,${a2}) 45%, rgba(0,0,0,${a3}) 62%, rgba(0,0,0,0) 72%)`;
}
const EMOJI_RE = /([\u{1F000}-\u{1FFFF}][\uFE0F\u20E3]?|[\u{2300}-\u{27BF}][\uFE0F\u20E3]?)/gu;
const ACCENT_RE = /\*([^*\n]+)\*/g;

// html2canvas 1.4.1\uC774 -webkit-text-stroke\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544 \uB2E4\uBC29\uD5A5 text-shadow\uB85C \uC678\uACFD\uC120\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.
function outlineShadow(color: string, w: number) {
  const parts: string[] = [];
  for (let r = 1; r <= w; r++) {
    for (let a = 0; a < 16; a++) {
      const t = (a / 16) * 2 * Math.PI;
      parts.push(`${(r * Math.cos(t)).toFixed(2)}px ${(r * Math.sin(t)).toFixed(2)}px 0 ${color}`);
    }
  }
  parts.push('0 3px 10px rgba(0,0,0,0.35)');
  return parts.join(', ');
}

// 밝은 글자색(노랑·흰색)에 흰 외곽선을 두르면 묻히므로 명도로 외곽선 색을 고른다
function isLightColor(hex: string) {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 > 0.7;
}

// *\uB2E8\uC5B4*\uB294 \uAC15\uC870\uC0C9, \uC774\uBAA8\uC9C0\uB294 \uC678\uACFD\uC120 \uC81C\uC678 (\uCEEC\uB7EC \uC774\uBAA8\uC9C0\uC5D0 \uADF8\uB9BC\uC790\uAC00 \uBC88\uC9C0\uB294 \uAC83 \uBC29\uC9C0)
function renderTitleLine(line: string, shadowCss: string | null, accentColor?: string) {
  return line.split(ACCENT_RE).flatMap((seg, i) => {
    const isAccent = i % 2 === 1;
    return seg.split(EMOJI_RE).map((s, j) =>
      s === '' ? null : (
        <span
          key={`${i}-${j}`}
          style={{
            color: isAccent && accentColor ? accentColor : undefined,
            textShadow: j % 2 === 1 ? 'none' : shadowCss ?? undefined,
          }}
        >
          {s}
        </span>
      )
    );
  });
}

function FitWidthTitle({ lines, color, shadowCss, fontSize, accentColor, highlightColor }: {
  lines: string[];
  fontFamily?: string;
  color: string;
  shadowCss: string | null;
  fontSize: number;
  accentColor?: string;
  highlightColor?: string;
}) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {lines.map((line, i) => {
        const content = renderTitleLine(line, shadowCss, accentColor);
        return (
          <div
            key={i}
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              color,
              lineHeight: 1.15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {highlightColor ? (
              <span
                style={{
                  backgroundColor: highlightColor,
                  display: 'inline-block',
                  padding: '0.04em 0.24em',
                  borderRadius: '0.16em',
                  marginTop: i === 0 ? 0 : '0.12em',
                }}
              >
                {content}
              </span>
            ) : content}
          </div>
        );
      })}
    </div>
  );
}

// 인기 템플릿 카드용 정적 미니 미리보기 — 실제 프리셋 스타일(폰트·외곽선·강조·캡션)을 축소 렌더.
// 크기는 cqw(컨테이너 폭 비율)로 잡아 카드 폭이 달라져도 비율이 유지된다.
// ponytail: 외곽선 px는 실물 값 그대로 사용 — 카드가 실물의 ~70% 폭이라 비율 오차가 작다
export function PresetMiniPreview({ preset: p }: { preset: StylePreset }) {
  const shadowCss = !p.textShadow || p.titleHighlightColor
    ? null
    : p.outlineWidth
      ? outlineShadow(p.outlineColor ?? '#ffffff', p.outlineWidth)
      : OUTLINE;
  const justify = p.textVAlign === 'top' ? 'flex-start' : p.textVAlign === 'bottom' ? 'flex-end' : 'center';
  const align = p.textAlign === 'center' ? 'center' : p.textAlign === 'right' ? 'flex-end' : 'flex-start';
  return (
    <div
      role="img"
      aria-label={p.imageAlt}
      className="w-full aspect-square relative overflow-hidden"
      style={{
        backgroundColor: p.bgType === 'color' ? p.bgColor : '#ffffff',
        fontFamily: p.fontFamily,
        containerType: 'inline-size',
      }}
    >
      {p.bgType === 'image' && p.bgImage && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url('${p.bgImage}')`, backgroundSize: 'cover', backgroundPosition: '50% 50%' }}
        />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${p.overlayOpacity / 100})` }} />
      {p.frameType === 'solid' && (
        <div className="absolute" style={{ inset: '4cqw', border: `0.8cqw solid ${p.textColor}` }} />
      )}
      {p.frameType === 'double' && (
        <div className="absolute border-double" style={{ inset: '4cqw', borderWidth: '1.2cqw', borderColor: p.textColor }} />
      )}
      {p.frameType === 'corners' && (
        <div className="absolute" style={{ inset: '5cqw' }}>
          {(['top-0 left-0 border-t-4 border-l-4', 'top-0 right-0 border-t-4 border-r-4', 'bottom-0 left-0 border-b-4 border-l-4', 'bottom-0 right-0 border-b-4 border-r-4'] as const).map((cls) => (
            <div key={cls} className={`absolute w-[6cqw] h-[6cqw] ${cls}`} style={{ borderColor: p.textColor }} />
          ))}
        </div>
      )}
      {p.frameType === 'band' && (
        <div className="absolute inset-0" style={{ background: bandGradient(100) }} />
      )}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ justifyContent: justify, alignItems: align, padding: '4.4cqw', color: p.textColor, textAlign: p.textAlign }}
      >
        <div className="flex flex-col" style={{ gap: '1cqw', alignItems: align, maxWidth: '100%' }}>
          {p.subtitle && p.subtitlePosition === 'above' && (
            <p
              style={{
                fontSize: '4.8cqw',
                fontWeight: 700,
                fontFamily: p.subtitleFontFamily,
                color: p.subtitleColor,
                textShadow: outlineShadow(
                  p.subtitleColor && isLightColor(p.subtitleColor) ? 'rgba(0,0,0,0.75)' : '#ffffff',
                  2
                ),
              }}
            >
              {p.subtitle}
            </p>
          )}
          {p.category && (
            <span
              className="rounded-full border w-fit font-bold uppercase"
              style={{ fontSize: '2.8cqw', padding: '0.8cqw 2.4cqw', borderColor: p.textColor, opacity: 0.9, letterSpacing: '0.05em' }}
            >
              {p.category}
            </span>
          )}
          {p.title.split('\n').map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: p.textShadow ? '11cqw' : '9.5cqw',
                fontWeight: p.textShadow ? 900 : 700,
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '100%',
              }}
            >
              {p.titleHighlightColor ? (
                <span style={{ backgroundColor: p.titleHighlightColor, display: 'inline-block', padding: '0.04em 0.24em', borderRadius: '0.16em' }}>
                  {renderTitleLine(line, null, p.accentColor)}
                </span>
              ) : (
                renderTitleLine(line, shadowCss, p.accentColor)
              )}
            </div>
          ))}
          {p.subtitle && (p.subtitlePosition ?? 'below') === 'below' && (
            <p style={{ fontSize: '4cqw', opacity: 0.8, fontWeight: 500 }}>{p.subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
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
  bandDarkness,
  onDownload,
  isDownloading,
  isDownloadDone,
  downloadFormat,
  onFormatChange,
  downloadScale,
  onScaleChange,
  fileName,
  setFileName,
  textShadow = false,
  titleFontSize = 60,
  accentColor,
  outlineWidth = 0,
  outlineColor = '#ffffff',
  titleHighlightColor,
  subtitlePosition = 'below',
  subtitleFontFamily,
  subtitleColor,
  bgOffsetX,
  bgOffsetY,
  onBgOffsetChange,
  bgRotation,
  onBgRotate,
  bgScale,
  onBgScaleChange,
}: ThumbnailPreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startOX: number; startOY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (bgType !== 'image' || !bgImage) return;
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOX: bgOffsetX, startOY: bgOffsetY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const el = e.currentTarget as HTMLDivElement;
    const s = 100 / el.offsetWidth;
    const nx = Math.max(0, Math.min(100, dragRef.current.startOX - (e.clientX - dragRef.current.startX) * s));
    const ny = Math.max(0, Math.min(100, dragRef.current.startOY - (e.clientY - dragRef.current.startY) * s));
    onBgOffsetChange(nx, ny);
  };
  const handleDragEnd = () => { setIsDragging(false); dragRef.current = null; };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (bgType !== 'image' || !bgImage) return;
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { startX: t.clientX, startY: t.clientY, startOX: bgOffsetX, startOY: bgOffsetY };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current) return;
    const t = e.touches[0];
    const el = e.currentTarget as HTMLDivElement;
    const s = 100 / el.offsetWidth;
    const nx = Math.max(0, Math.min(100, dragRef.current.startOX - (t.clientX - dragRef.current.startX) * s));
    const ny = Math.max(0, Math.min(100, dragRef.current.startOY - (t.clientY - dragRef.current.startY) * s));
    onBgOffsetChange(nx, ny);
  };
  return (
    <div className="flex-1 order-1 lg:order-2 flex flex-col items-center lg:sticky lg:top-8 h-fit">
      <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4 flex flex-col items-center">
        <div className="w-full px-2 mb-4">
          <h3 className="text-left font-semibold text-gray-800">
            미리보기 (1:1 비율)
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-snug">
            네이버 모바일 최적화 (204x204 완벽 지원)
          </p>
        </div>

        <div className="relative w-full max-w-[500px]">
        <div
          className={`w-full aspect-square relative overflow-hidden z-0 ${textShadow ? 'p-0' : 'p-8 sm:p-12'}`}
          ref={previewRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          style={{
            backgroundColor: bgType === 'color' ? bgColor : '#ffffff',
            fontFamily: fontFamily,
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
            color: textColor,
            borderColor: 'transparent',
            outline: 'none',
            userSelect: 'none',
            cursor: bgType === 'image' && bgImage ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
        >
          {bgType === 'image' && bgImage && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: bgScale === 100 ? 'cover' : `${bgScale}%`,
                backgroundPosition: `${bgOffsetX}% ${bgOffsetY}%`,
                transform: `rotate(${bgRotation}deg)`,
                zIndex: 0,
              }}
            />
          )}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`, zIndex: 1 }}
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
          {frameType === 'band' && (
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                // html2canvas에서 height 경계(hairline seam)가 생기는 케이스를 피하기 위해
                // 하단 밴드를 "부분 높이 div"가 아니라 "전체 overlay + 그라데이션"으로 렌더링합니다.
                background: bandGradient(bandDarkness),
              }}
            />
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
              padding: textShadow ? '22px' :(frameType === 'none' || frameType === 'band') ? '1.75rem' : '2.5rem',
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
              {subtitle && subtitlePosition === 'above' && (
                <p
                  className="text-xl sm:text-2xl font-bold break-keep"
                  style={{
                    wordBreak: 'keep-all',
                    fontFamily: subtitleFontFamily,
                    color: subtitleColor,
                    // ponytail: 캡션 외곽선은 명도 기반 흑/백 자동 선택, 커스텀 요구가 생기면 필드로 승격
                    textShadow: outlineShadow(
                      subtitleColor && isLightColor(subtitleColor) ? 'rgba(0,0,0,0.75)' : '#ffffff',
                      2
                    ),
                  }}
                >
                  {subtitle}
                </p>
              )}
              {category && (
                <span
                  className="text-xs font-bold tracking-wider uppercase border rounded-full px-3 py-1 w-fit"
                  style={{ borderColor: textColor, opacity: 0.9 }}
                >
                  {category}
                </span>
              )}
              {title && (
                textShadow ? (
                  <FitWidthTitle
                    lines={title.split('\n')}
                    fontFamily={fontFamily}
                    color={textColor}
                    shadowCss={
                      titleHighlightColor
                        ? null
                        : outlineWidth > 0 ? outlineShadow(outlineColor, outlineWidth) : OUTLINE
                    }
                    fontSize={titleFontSize}
                    accentColor={accentColor}
                    highlightColor={titleHighlightColor}
                  />
                ) : (
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight break-keep"
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {title.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {renderTitleLine(line, null, accentColor)}
                        <br />
                      </React.Fragment>
                    ))}
                  </h1>
                )
              )}
              {subtitle && subtitlePosition === 'below' && (
                <p
                  className="text-sm sm:text-base md:text-xl opacity-80 break-keep font-medium"
                  style={{
                    wordBreak: 'keep-all',
                    textShadow: textShadow
                      ? '-1px -1px 0 rgba(0,0,0,0.65), 1px -1px 0 rgba(0,0,0,0.65), -1px 1px 0 rgba(0,0,0,0.65), 1px 1px 0 rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4)'
                      : undefined,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        {bgType === 'image' && bgImage && (
          <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => onBgScaleChange(Math.min(250, bgScale + 10))}
              disabled={bgScale >= 250}
              className="bg-black/50 hover:bg-black/70 disabled:opacity-40 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              title="배경 확대"
              aria-label={`배경 확대 (현재 ${bgScale}%)`}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => onBgScaleChange(Math.max(100, bgScale - 10))}
              disabled={bgScale <= 100}
              className="bg-black/50 hover:bg-black/70 disabled:opacity-40 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              title="배경 축소"
              aria-label={`배경 축소 (현재 ${bgScale}%)`}
            >
              −
            </button>
            <button
              type="button"
              onClick={onBgRotate}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              title="이미지 90도 회전"
              aria-label={`이미지 90도 회전 (현재 ${bgRotation}도)`}
            >
              &#8635;
            </button>
            {bgRotation !== 0 && (
              <span className="bg-black/60 text-white text-[10px] font-bold tabular-nums rounded-full px-1.5 py-0.5">{bgRotation}°</span>
            )}
          </div>
        )}

        {bgType === 'image' && bgImage && !isDragging && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/55 text-white text-[11px] font-medium rounded-full px-3 py-1 whitespace-nowrap">
            드래그해서 배경 위치 조절
          </div>
        )}
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
                      ? 'bg-[#111111] text-white border-gray-900'
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
                      ? 'bg-[#111111] text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1.5">파일명</p>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="blog_thumbnail"
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            />
            <span className="text-xs text-gray-400">.{downloadFormat}</span>
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
        aria-busy={isDownloading}
        aria-label={`${downloadFormat.toUpperCase()} 썸네일 다운로드`}
        className={`w-full max-w-[500px] flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
          isDownloading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-[#111111] hover:bg-[#111111] hover:shadow-xl hover:-translate-y-1'
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
      <div className="w-full max-w-[500px] mt-4">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-sm text-gray-800 mb-0.5">썸네일만으로는 부족합니다</p>
            <p className="text-xs text-gray-400">제목 · 키워드 · 글 구조가 조회수를 결정합니다</p>
          </div>
          <Link
            href="/guide/blog-seo"
            className="flex-shrink-0 px-3.5 py-2 bg-[#111111] text-white text-xs font-bold rounded-lg hover:bg-[#222222] transition"
          >
            가이드 보기
          </Link>
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
