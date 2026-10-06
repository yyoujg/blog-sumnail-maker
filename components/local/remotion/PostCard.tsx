// @ts-nocheck -- scripts/sync-clip.sh 가 복사한 원본. 직접 고치지 말 것.
import React from 'react';
import { AbsoluteFill, Img, staticFile, delayRender, continueRender } from 'remotion';

// ponytail: Thumbnail.tsx/InfoCard.tsx와 같은 폰트 스택만 값 복사해서 씀(공유 모듈 안 만드는 게
// 이 저장소 기존 관례 - InfoCard.tsx도 FONT_STACK을 독자 정의함). 그림자/외곽선은 안 씀 -
// 참고 이미지처럼 불투명 배경 박스/패널로 대비를 주는 방식이라 텍스트 자체엔 효과가 필요 없음.
const FONT_STACK =
  "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

// Pretendard는 OS 설치 폰트라 로드 완료 신호가 없다 - 게이트 없이 찍으면 폰트 매칭이
// 안 끝난 채로 폴백 폰트로 캡처될 수 있다(CaptionVideo.tsx와 동일 사유, 2026-09-03).
// insetCover/tagCover가 실제로 쓰는 굵기(400/800)만 확인한다.
const fontHandle = delayRender('Pretendard 로딩 대기');
Promise.all([400, 800].map((w) => document.fonts.load(`${w} 48px Pretendard`)))
  .then(() => document.fonts.ready)
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

// 네이버클립 공식 "1:1 커버 이미지 제작 가이드"(2026.08.27, 사용자가 캡처로 확인시킴) 세이프 에어리어 -
// 900x900 캔버스 기준 상하좌우 100px 안쪽에 중요 오브젝트/텍스트를 둘 것. 모든 카드의 바닥 여백/좌우
// 여백을 이 값 이상으로 맞춘다. (900x1600 9:16 규격은 클립 "섬네일"(영상 커버)용 - 이 카드들과 별개)
const SAFE_BOTTOM = 100;
const SAFE_SIDE = 100;

// 2026-09-08: 게시물 카드 스타일을 insetCover(커버)+tagCover(나머지)로 통일 - cover/cafeCover/
// review/cafeReview/menu 타입은 전부 삭제했다(git 이력에서 복구 가능). 업종별로 스타일을 나누지 않는다.
export type PostCardProps =
  // 클립 썸네일(Thumbnail.tsx)과 같은 구조를 900x900 카드로 옮긴 것 - 전면 사진 +
  // 좌상단 인셋 사진카드 + 좌하단 텍스트. 업종 무관하게 쓴다.
  | {
      type: 'insetCover';
      imageUrl: string;
      imageZoom?: number;
      imagePosition?: string;
      /** 좌상단 인셋 사진 카드 1~2장. 메뉴 클로즈업 */
      insets?: {
        imageUrl: string;
        label: string;
        labelAt?: 'topLeft' | 'bottomRight';
        zoom?: number;
        position?: string;
      }[];
      category: string;
      title: string;
      description: string;
    }
  // 커버 다음 장들(공간·메뉴 사진)에 쓴다. 인셋 카드도, 태그도, 굵은 제목도 없다 -
  // 커버에서 다 보여줬으므로 나머지 장은 사진과 설명 한 덩어리만 남긴다.
  | {
      type: 'tagCover';
      imageUrl: string;
      imageZoom?: number;
      imagePosition?: string;
      /** 좌하단 설명. "\n"으로 줄바꿈, 2줄까지 */
      description: string;
    };

// 참고 레이아웃: 블로그 썸네일 카페 프리셋(src/thumb.js "카페")과 같은 형식 - 좌측정렬, 라벨 위/
// 굵은 2줄 제목 아래. 태그는 알약이 아니라 borderRadius 5 사각, 흰 배경 + 어두운 글자.
const INSET_TAG_FG = '#1a1a1a';

const InsetTag: React.FC<{ text: string; fontSize: number; style?: React.CSSProperties }> = ({
  text,
  fontSize,
  style,
}) => (
  <div
    style={{
      display: 'inline-block',
      backgroundColor: '#ffffff',
      color: INSET_TAG_FG,
      borderRadius: 5,
      padding: '7px 14px',
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

// 인셋 카드 자리 - 1번은 좌상단, 2번은 오른쪽·아래로 밀어 엇갈리게. 3장 이상은 마지막 자리에 겹친다
const INSET_SLOTS = [
  { top: SAFE_BOTTOM, left: SAFE_SIDE },
  { top: SAFE_BOTTOM + 180, left: SAFE_SIDE + 200 },
];

// 사진 + 하단 그라데이션 + 좌하단 설명. 커버(insetCover)와 같은 톤이되 요소를 뺀 판.
const TagCoverCard: React.FC<Extract<PostCardProps, { type: 'tagCover' }>> = ({
  imageUrl,
  imageZoom,
  imagePosition,
  description,
}) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Img
      src={staticFile(imageUrl)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: imagePosition || 'center',
        transform: imageZoom ? `scale(${imageZoom})` : undefined,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0) 100%)',
      }}
    />
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: `0 ${SAFE_SIDE}px ${SAFE_BOTTOM}px`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_STACK,
          fontWeight: 400,
          fontSize: 24,
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

const InsetCoverCard: React.FC<Extract<PostCardProps, { type: 'insetCover' }>> = ({
  imageUrl,
  imageZoom,
  imagePosition,
  insets = [],
  category,
  title,
  description,
}) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Img
      src={staticFile(imageUrl)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: imagePosition || 'center',
        transform: imageZoom ? `scale(${imageZoom})` : undefined,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0) 100%)',
      }}
    />

    {/* 900x900은 세로 여유가 없어 세로 스택(클립 썸네일 방식)이 안 들어간다 -
        대각선으로 엇갈리게 놓고 2번 카드가 1번 모서리에 살짝 겹치게 한다 */}
    {insets.map((inset, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          ...INSET_SLOTS[Math.min(i, INSET_SLOTS.length - 1)],
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 270,
            backgroundColor: '#ffffff',
            padding: 4,
            borderRadius: 10,
                        overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile(inset.imageUrl)}
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              objectPosition: inset.position || 'center',
              transform: `scale(${inset.zoom ?? 1})`,
              transformOrigin: inset.position || 'center',
              borderRadius: 6,
            }}
          />
          <InsetTag
            text={inset.label}
            fontSize={18}
            style={
              (inset.labelAt || (i === 0 ? 'topLeft' : 'bottomRight')) === 'topLeft'
                ? { position: 'absolute', top: 16, left: 16 }
                : { position: 'absolute', bottom: 16, right: 16 }
            }
          />
        </div>
      </div>
    ))}

    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: `0 ${SAFE_SIDE}px ${SAFE_BOTTOM}px`,
      }}
    >
      <InsetTag text={category} fontSize={20} style={{ marginBottom: 12 }} />
      <div style={{ fontFamily: FONT_STACK, fontWeight: 800, fontSize: 50, color: '#ffffff' }}>
        {title}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONT_STACK,
          fontWeight: 400,
          fontSize: 24,
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

// 네이버클립 "게시물" 탭용 카드뉴스 - Thumbnail.tsx와 톤(폰트)은 이어받되,
// 참고 이미지 레이아웃(사진 위 오버레이가 아니라 불투명 패널/박스로 텍스트 배치)을 따름
export const PostCard: React.FC<PostCardProps> = (props) => {
  switch (props.type) {
    case 'insetCover':
      return <InsetCoverCard {...props} />;
    case 'tagCover':
      return <TagCoverCard {...props} />;
  }
};
