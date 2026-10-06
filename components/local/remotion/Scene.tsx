// @ts-nocheck -- scripts/sync-clip.sh 가 복사한 원본. 직접 고치지 말 것.
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

type SceneProps = {
  text?: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  durationInFrames: number;
};

const FONT_STACK =
  "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const TEXT_MAX_WIDTH = 760; // 네이버클립 앱 우측 아이콘 컬럼(좋아요/댓글/공유)에 자막 우측이 가려진다는 피드백으로 960→760 (2026-08-27)

// 확대되는 느낌보다 좌->우로 패닝하는 느낌이 나도록: 확대는 고정값, 가로 이동만 애니메이션
function useKenBurns(durationInFrames: number) {
  const frame = useCurrentFrame();
  const scale = 1.5; // 여백(빈 배경) 없이 꽉 차 보이게 더 확대. 1.15->1.3->1.5(2026-09-04)
  const translateX = interpolate(frame, [0, durationInFrames], [40, -40], { extrapolateRight: 'clamp' });
  return { scale, translateX };
}

// 영상 씬은 자체 촬영 움직임이 있어 Ken Burns 패닝은 안 쓰지만, 그대로 두면 배경 여백이
// 넓게 보여서 정적으로 확대만 한다(2026-09-04, 이미지 씬 확대와 같은 이유).
const VIDEO_ZOOM = 1.2;

// 자막 타이핑 효과(2026-09-08) - 씬 길이와 무관하게 항상 이 프레임 수 안에 다 타이핑된다.
// 문장이 짧을수록 한 글자당 노출 시간이 길어져 너무 빨리 끝나지 않는다.
const TYPE_FRAMES = 24; // 0.6s -> 0.8s (2026-09-08, "조금만 느리게" 요청으로 조정)

function useTypewriter(text: string | undefined) {
  const frame = useCurrentFrame();
  if (!text) return { displayText: '', isTyping: false };
  const progress = Math.min(1, frame / TYPE_FRAMES);
  const visibleChars = Math.ceil(text.length * progress);
  return { displayText: text.slice(0, visibleChars), isTyping: progress < 1 };
}

export const Scene: React.FC<SceneProps> = ({
  text,
  imageUrl,
  mediaType = 'image',
  durationInFrames,
}) => {
  const { width, height } = useVideoConfig();
  const { scale, translateX } = useKenBurns(durationInFrames);
  const { displayText, isTyping } = useTypewriter(text);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill
        style={
          mediaType === 'video'
            ? { transform: `scale(${VIDEO_ZOOM})`, transformOrigin: 'center center' }
            : { transform: `translateX(${translateX}px) scale(${scale})`, transformOrigin: 'center center' }
        }
      >
        {mediaType === 'video' ? (
          <OffthreadVideo
            src={staticFile(imageUrl)}
            muted
            loop
            style={{ width, height, objectFit: 'cover' }}
          />
        ) : (
          <Img
            src={staticFile(imageUrl)}
            style={{
              width,
              height,
              objectFit: 'cover',
            }}
          />
        )}
      </AbsoluteFill>

      {text ? (
        <>
          {/* 사진 전체를 어둡게 하던 그라데이션은 뺐다(2026-09-04) - 자막 자체가 검은
              반투명 배경 박스를 가지고 있어서 가독성은 그걸로 해결되고, 사진은 원본 밝기
              그대로 보여준다. ⚠️ Thumbnail.tsx 커버는 인셋+업체명 텍스트 버전으로 되돌려서
              지금도 하단 그라데이션을 쓴다 - 본문(이 컴포넌트)과 커버는 위치·스타일이 다르다. */}
          {/* top 506px - 좌우 110px는 기기 화면 크롭 안전여백. 자막은 중앙정렬, 항상 한 줄
              고정(\n 금지, nowrap)이다(2026-09-08 재확정 - 2줄 허용은 되돌림). 한 화면 = 한 정보,
              한 줄에 안 들어가면 문장을 줄여서 쓴다. 굵기 강조 없이 전부 기본(400).
              타이핑 효과(2026-09-08): 글자가 TYPE_FRAMES 동안 순차로 나타나고, 타이핑 중엔
              끝에 커서(|)를 붙인다 - 박스는 nowrap이라 타이핑되는 만큼 자연스럽게 넓어진다. */}
          <AbsoluteFill
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '506px 110px 0',
            }}
          >
            <div
              style={{
                maxWidth: TEXT_MAX_WIDTH,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 6,
                padding: '10px 20px',
                fontFamily: FONT_STACK,
                fontSize: 32,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.92)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {displayText}
              {isTyping ? '|' : ''}
            </div>
          </AbsoluteFill>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
