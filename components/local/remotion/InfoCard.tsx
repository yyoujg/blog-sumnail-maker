// @ts-nocheck -- scripts/sync-clip.sh 가 복사한 원본. 직접 고치지 말 것.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

const FONT_STACK =
  "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

export type InfoCardData = {
  location: string;
  hours: string;
  price: string;
};

const ICON_COL_WIDTH = 64;
const TEXT_MAX_WIDTH = 780;

const InfoLine: React.FC<{ emoji: string; text: string }> = ({ emoji, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
    <span style={{ fontSize: 44, width: ICON_COL_WIDTH, flexShrink: 0, textAlign: 'center' }}>{emoji}</span>
    <span
      style={{
        fontFamily: FONT_STACK,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: 1.4,
        color: '#ffffff',
        maxWidth: TEXT_MAX_WIDTH,
        wordBreak: 'keep-all',
      }}
    >
      {text}
    </span>
  </div>
);

// 일반 자막 씬과 시각적으로 구분되는 전용 레이아웃: 블러+어둡게 처리한 배경 사진 + 중앙 정렬 리스트
export const InfoCard: React.FC<{ infoCard: InfoCardData; imageUrl?: string }> = ({ infoCard, imageUrl }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#111318' }}>
      {imageUrl ? (
        <>
          <Img
            src={staticFile(imageUrl)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px) brightness(0.5)' }}
          />
          <AbsoluteFill style={{ backgroundColor: 'rgba(17,19,24,0.55)' }} />
        </>
      ) : null}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 60, paddingRight: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48, maxWidth: ICON_COL_WIDTH + 20 + TEXT_MAX_WIDTH }}>
          <InfoLine emoji="📍" text={infoCard.location} />
          <InfoLine emoji="🕐" text={infoCard.hours} />
          <InfoLine emoji="💰" text={infoCard.price} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
