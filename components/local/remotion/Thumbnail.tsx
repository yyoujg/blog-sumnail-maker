// @ts-nocheck -- scripts/sync-clip.sh 가 복사한 원본. 직접 고치지 말 것.
import React from 'react';
import { AbsoluteFill, Img, staticFile, delayRender, continueRender } from 'remotion';

// 전면 배경사진 + 인셋 사진카드 + 텍스트. **두 가지 용도가 서로 다른 레이아웃을 쓴다**
// (2026-09-04) - `variant` prop으로 나눈다:
//  - 'stack'(기본값) - 정지 썸네일(`Root.tsx`의 Thumbnail Composition → `클립/thumbnail.png`).
//    인셋 세로스택 + 좌하단 텍스트(업체명 포함). 사용자가 이 버전으로 최종 확정했다 - 손대지 말 것.
//  - 'topRow' - 영상 재생 시 나오는 커버 씬(`scenes-data.json`의 `type:"cover"`). 상단
//    텍스트(업체명 없음, 네이버클립 재생 UI 자체 캡션에 이미 나옴) + 인셋 가로줄. 재생 UI가
//    화면 하단~중단을 가리는 문제 때문에 만든 버전.
// ponytail: PostCard.tsx의 CafeCoverCard에서 그라데이션/좌측정렬 스택 값을 복사해 왔다
// (이 저장소는 공유 모듈 안 만드는 관례 - PostCard/InfoCard도 각자 FONT_STACK을 정의함).
const FONT_STACK =
  "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

// Pretendard는 OS 설치 폰트라 로드 완료 신호가 없다 - 게이트 없이 찍으면 폰트 매칭이
// 안 끝난 채로 폴백 폰트로 캡처될 수 있다(CaptionVideo.tsx와 동일 사유, 2026-09-03).
const fontHandle = delayRender('Pretendard 로딩 대기');
Promise.all([document.fonts.load('400 48px Pretendard'), document.fonts.load('800 48px Pretendard')])
  .then(() => document.fonts.ready)
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

// 라벨은 알약(borderRadius 999)이 아니라 살짝만 둥근 사각 태그
const TAG_RADIUS = 6;
const TAG_FG = '#1a1a1a';

export type ThumbnailProps = {
  imageUrl: string;
  /** 배경 확대. 1 = 원본 그대로 */
  imageZoom?: number;
  /** objectPosition, 예: '50% 40%'. 원본이 9:16이면 crop 여지가 없어 안 먹는다 */
  imagePosition?: string;
  /** 좌상단 인셋 사진 카드. 1~2장(레퍼런스는 2장). 메뉴 클로즈업을 쓴다 */
  insets?: {
    imageUrl: string;
    label: string;
    labelAt?: 'topLeft' | 'bottomRight';
    /** 라벨이 가리키는 메뉴만 보이게 확대. 1 = 원본 */
    zoom?: number;
    /** 확대 기준점 겸 크롭 위치. 예: '30% 40%' */
    position?: string;
  }[];
  /** 좌하단 작은 태그. 레퍼런스의 "미각" 자리 */
  category: string;
  /** 굵은 큰 제목(업체명). 'topRow'에서는 안 쓴다 */
  title?: string;
  /** 제목 아래 설명. "\n"으로 줄바꿈 */
  description: string;
  /** 'stack'(기본, 정지 썸네일용) | 'topRow'(영상 커버 씬용). 위 설명 참고 */
  variant?: 'stack' | 'topRow';
};

const Tag: React.FC<{ text: string; fontSize: number; style?: React.CSSProperties }> = ({
  text,
  fontSize,
  style,
}) => (
  <div
    style={{
      display: 'inline-block',
      backgroundColor: '#ffffff',
      color: TAG_FG,
      borderRadius: TAG_RADIUS,
      padding: '10px 20px',
      fontFamily: FONT_STACK,
      fontWeight: 400,
      fontSize,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </div>
);

// 흰 프레임 + 라벨 태그가 붙은 인셋 사진 카드. width는 배치에 따라 다르다
// (세로 스택 470 / 가로 2장 나란히 420 - 860px 가용폭에 맞춘 값, 아래 렌더 참고).
const InsetCard: React.FC<{
  imageUrl: string;
  label: string;
  labelAt: 'topLeft' | 'bottomRight';
  zoom: number;
  position: string;
  width: number;
}> = ({ imageUrl, label, labelAt, zoom, position, width }) => (
  <div
    style={{
      position: 'relative',
      width,
      backgroundColor: '#ffffff',
      padding: 5,
      borderRadius: 26,
      overflow: 'hidden',
    }}
  >
    <Img
      src={staticFile(imageUrl)}
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: '1 / 1',
        objectFit: 'cover',
        objectPosition: position,
        transform: `scale(${zoom})`,
        transformOrigin: position,
        borderRadius: 16,
      }}
    />
    <Tag
      text={label}
      fontSize={26}
      style={
        labelAt === 'topLeft'
          ? { position: 'absolute', top: 26, left: 26 }
          : { position: 'absolute', bottom: 26, right: 26 }
      }
    />
  </div>
);

export const Thumbnail: React.FC<ThumbnailProps> = ({
  imageUrl,
  imageZoom = 1,
  imagePosition = 'center',
  insets = [],
  category,
  title,
  description,
  variant = 'stack',
}) => {
  const bg = (
    <Img
      src={staticFile(imageUrl)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: imagePosition,
        transform: `scale(${imageZoom})`,
      }}
    />
  );

  if (variant === 'topRow') {
    return (
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {bg}

        {/* 상단만 어둡게(스택 버전과 반대) - 텍스트가 위에 있어서 */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.2) 62%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* top 506px·좌우 110px: 재생 UI(프로필·캡션·위치태그)와 기기 화면 크롭을 피한 값.
            업체명(title) 없이 카테고리+설명만, 그 아래 인셋 가로줄 */}
        <AbsoluteFill
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '506px 110px 0',
            gap: 28,
          }}
        >
          <Tag text={category} fontSize={30} />
          <div
            style={{
              fontFamily: FONT_STACK,
              fontWeight: 400,
              fontSize: 40,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.92)',
              whiteSpace: 'pre-line',
            }}
          >
            {description}
          </div>
          {insets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
              {insets.map((inset, i) => (
                <InsetCard
                  key={i}
                  imageUrl={inset.imageUrl}
                  label={inset.label}
                  labelAt="topLeft"
                  zoom={inset.zoom ?? 1}
                  position={inset.position || 'center'}
                  width={420}
                />
              ))}
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {bg}

      {/* 아래쪽만 어둡게 - 인셋 카드가 놓이는 위쪽은 사진 그대로 보여준다 */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 110,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          alignItems: 'flex-start',
        }}
      >
        {insets.map((inset, i) => (
          <InsetCard
            key={i}
            imageUrl={inset.imageUrl}
            label={inset.label}
            labelAt={inset.labelAt || (i === 0 ? 'topLeft' : 'bottomRight')}
            zoom={inset.zoom ?? 1}
            position={inset.position || 'center'}
            width={470}
          />
        ))}
      </div>

      {/* 인셋카드 스택 하단(y≈1208)과 안 겹치게 300으로 되돌림 - 470을 쓰면 카드 밑부분과
          텍스트 블록이 겹친다(2026-09-04, 사용자가 이 레이아웃으로 되돌려달라고 확정한 값). */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: '0 110px 300px',
        }}
      >
        <Tag text={category} fontSize={30} style={{ marginBottom: 22 }} />
        <div style={{ fontFamily: FONT_STACK, fontWeight: 800, fontSize: 84, color: '#ffffff' }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: FONT_STACK,
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.92)',
            whiteSpace: 'pre-line',
          }}
        >
          {description}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
