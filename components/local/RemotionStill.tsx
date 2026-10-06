'use client';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { Thumbnail as PlayerThumbnail, Player } from '@remotion/player';
import { loadClip } from './remotion-loader';

export type Kind = 'card' | 'cover' | 'scene';
const SIZE: Record<Kind, [number, number]> = { card: [900, 900], cover: [1080, 1920], scene: [1080, 1920] };
export const SCENE_STILL_FRAME = 30; // Scene.tsx TYPE_FRAMES(24) 지난 뒤 = 자막이 다 찍힌 시점

type Mods = Awaited<ReturnType<typeof loadClip>>;
export function useClip() {
  const [mods, setMods] = useState<Mods | null>(null);
  useEffect(() => { loadClip().then(setMods); }, []);
  return mods;
}

// 정지 프레임 한 장. width = 표시 폭(px). 컴포지션 크기는 kind로 고정.
export function RemotionStill({ kind, inputProps, width, frame, className, onClick }: {
  kind: Kind; inputProps: Record<string, unknown>; width: number; frame?: number; className?: string; onClick?: () => void;
}) {
  const mods = useClip();
  const [w, h] = SIZE[kind];
  const height = Math.round((width * h) / w);
  // Player는 inputProps/style 객체 참조가 바뀌면 내부 상태를 다시 잡는다 → 매 렌더 새 객체를 주면 update depth 초과. 내용 기준으로 고정.
  const key = JSON.stringify(inputProps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const props = useMemo(() => inputProps, [key]);
  const style = useMemo(() => ({ width, height }), [width, height]);
  if (!mods) return <div className={className} style={{ width, height, background: '#e5e7eb', borderRadius: 8 }} />;
  const component = (kind === 'card' ? mods.PostCard : kind === 'cover' ? mods.Thumbnail : mods.Scene) as ComponentType<Record<string, unknown>>;
  const dur = kind === 'scene' ? Math.max(60, Number(inputProps.durationInFrames) || 60) : 1;
  return (
    <div className={className} style={{ width, height, overflow: 'hidden', borderRadius: 8, cursor: onClick ? 'pointer' : undefined }} onClick={onClick}>
      <PlayerThumbnail component={component} inputProps={props} compositionWidth={w} compositionHeight={h}
        frameToDisplay={frame ?? (kind === 'scene' ? Math.min(SCENE_STILL_FRAME, dur - 1) : 0)} durationInFrames={dur} fps={30} style={style} />
    </div>
  );
}

// 영상 전체 재생(렌더 없이 확인).
export function ScenesPlayer({ scenes, width }: { scenes: Record<string, unknown>[]; width: number }) {
  const mods = useClip();
  const key = JSON.stringify(scenes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const props = useMemo(() => ({ scenes }), [key]);
  if (!mods) return null;
  const total = mods.getTotalDurationInFrames(scenes as never);
  return (
    <Player component={mods.CaptionVideo as ComponentType<Record<string, unknown>>} inputProps={props} compositionWidth={1080} compositionHeight={1920}
      durationInFrames={Math.max(1, total)} fps={30} controls style={{ width, height: Math.round((width * 1920) / 1080), borderRadius: 12, overflow: 'hidden' }} />
  );
}
