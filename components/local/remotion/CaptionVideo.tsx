// @ts-nocheck -- scripts/sync-clip.sh 가 복사한 원본. 직접 고치지 말 것.
import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Scene } from './Scene';
import { InfoCard, InfoCardData } from './InfoCard';
import { Thumbnail, ThumbnailProps } from './Thumbnail';

// Pretendard 폰트 로딩 게이트는 Thumbnail.tsx가 모듈 스코프에서 이미 잡는다(400+800 전부
// 커버) - CaptionVideo.tsx가 항상 Thumbnail을 import하므로 번들에 같이 실려 중복 게이트가
// 필요 없다(2026-09-04, 여기 있던 별도 400-only 게이트 삭제).

// 씬 사이 크로스페이드 길이 (0.5초 @30fps) - 두 씬이 이 프레임 수만큼 겹치며 페이드
const TRANSITION_FRAMES = 15;

export type CaptionSceneData = {
  type?: 'caption';
  text: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  durationInFrames: number;
};

export type InfoCardSceneData = {
  type: 'infoCard';
  infoCard: InfoCardData;
  durationInFrames: number;
  imageUrl?: string;
};

// 맨 앞 커버(타이틀 카드). 썸네일 컴포넌트를 그대로 재사용한다 -
// 따로 만들면 썸네일을 고칠 때마다 영상 커버가 어긋난다.
export type CoverSceneData = { type: 'cover'; durationInFrames: number } & ThumbnailProps;

export type SceneData = CaptionSceneData | InfoCardSceneData | CoverSceneData;

export type CaptionVideoProps = {
  scenes: SceneData[];
};

export const CaptionVideo: React.FC<CaptionVideoProps> = ({ scenes }) => {
  const children: React.ReactNode[] = [];
  scenes.forEach((scene, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={scene.durationInFrames}>
        {scene.type === 'cover' ? (
          <Thumbnail {...scene} />
        ) : scene.type === 'infoCard' ? (
          <InfoCard infoCard={scene.infoCard} imageUrl={scene.imageUrl} />
        ) : (
          <Scene
            text={scene.text}
            imageUrl={scene.imageUrl}
            mediaType={scene.mediaType}
            durationInFrames={scene.durationInFrames}
          />
        )}
      </TransitionSeries.Sequence>
    );
    if (i < scenes.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
      );
    }
  });

  return <TransitionSeries>{children}</TransitionSeries>;
};

export function getTotalDurationInFrames(scenes: SceneData[]): number {
  const sum = scenes.reduce((total, s) => total + s.durationInFrames, 0);
  return sum - (scenes.length - 1) * TRANSITION_FRAMES;
}
