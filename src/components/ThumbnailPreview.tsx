import React, { type RefObject } from 'react';
import { Download } from 'lucide-react';
import type { TextAlign, FrameType, BgType } from '../types.ts';
import CoupangCard from './CoupangCard.tsx';
import KakaoAdBanner from './KakaoAdBanner.tsx';

interface ThumbnailPreviewProps {
  previewRef: RefObject<HTMLDivElement | null>;
  title: string;
  subtitle: string;
  category: string;
  textColor: string;
  fontFamily: string;
  textAlign: TextAlign;
  bgType: BgType;
  bgColor: string;
  bgImage: string | null;
  overlayOpacity: number;
  frameType: FrameType;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function ThumbnailPreview({
  previewRef,
  title,
  subtitle,
  category,
  textColor,
  fontFamily,
  textAlign,
  bgType,
  bgColor,
  bgImage,
  overlayOpacity,
  frameType,
  onDownload,
  isDownloading,
}: ThumbnailPreviewProps) {
  return (
    <div className="flex-1 flex flex-col items-center lg:sticky lg:top-8 h-fit">
      <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col items-center">
        <h3 className="w-full text-left font-semibold text-gray-800 mb-4 px-2">
          미리보기 (1:1 비율)
        </h3>

        <div
          className="w-full max-w-[500px] aspect-square relative overflow-hidden p-8 sm:p-12"
          ref={previewRef}
          style={{
            backgroundColor: bgType === 'color' ? bgColor : '#ffffff',
            backgroundImage:
              bgType === 'image' && bgImage ? `url(${bgImage})` : 'none',
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
            style={{
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
            }}
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
              <div
                className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4"
                style={{ borderColor: textColor }}
              />
              <div
                className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4"
                style={{ borderColor: textColor }}
              />
              <div
                className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4"
                style={{ borderColor: textColor }}
              />
              <div
                className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4"
                style={{ borderColor: textColor }}
              />
            </div>
          )}

          <div
            className="flex flex-col gap-3 sm:gap-5"
            style={{
              position: 'absolute',
              left: '50%',
              top: '54%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              color: textColor,
              textAlign: textAlign,
              alignItems:
                textAlign === 'center'
                  ? 'center'
                  : textAlign === 'right'
                    ? 'flex-end'
                    : 'flex-start',
              maxWidth: 'calc(100% - 4rem)',
              width: 'max-content',
            }}
          >
            {category && (
              <span
                className="text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase opacity-90 border rounded-full"
                style={{
                  borderColor: textColor,
                  display: 'inline-block',
                  textAlign: 'center',
                  height: '2rem',
                  boxSizing: 'border-box',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  marginTop: '-1rem',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    lineHeight: 1,
                  }}
                >
                  {category}
                </span>
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
              <p className="text-sm sm:text-base md:text-xl opacity-90 -mt-0.5 break-keep font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
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
            썸네일 다운로드 (PNG)
          </>
        )}
      </button>
      <KakaoAdBanner />
      <p className="text-sm text-gray-500 mt-4 text-center">
        * 생성된 이미지는 1:1 정방형 사이즈로 네이버 블로그에 최적화되어
        있습니다.
        <br />
        (PC와 모바일에서 모두 잘림 없이 보입니다)
      </p>

      <CoupangCard
        src="https://coupa.ng/clQwOg"
        name="KL-149B 미니 LED 촬영 조명"
        desc="배경 이미지 찍을 때 조명 하나 있으면 사진 퀄리티가 확 달라져요. 작고 가벼워서 책상 위에 두고 쓰기 딱 좋습니다."
      />

    </div>
  );
}
