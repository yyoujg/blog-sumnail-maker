'use client';
// Player용 컴포넌트 로더. 모듈 스코프에서 document.fonts.load를 부르는 컴포넌트라 SSR 금지이고,
// staticFile()이 window.remotion_staticBase를 호출 시점에 읽으므로 import 전에 먼저 잡아둔다.
export const STATIC_BASE = '/api/local/public';

type Mods = {
  PostCard: typeof import('./remotion/PostCard').PostCard;
  Thumbnail: typeof import('./remotion/Thumbnail').Thumbnail;
  Scene: typeof import('./remotion/Scene').Scene;
  CaptionVideo: typeof import('./remotion/CaptionVideo').CaptionVideo;
  getTotalDurationInFrames: typeof import('./remotion/CaptionVideo').getTotalDurationInFrames;
};
let promise: Promise<Mods> | null = null;
export function loadClip(): Promise<Mods> {
  if (!promise) {
    window.remotion_staticBase = STATIC_BASE;
    promise = Promise.all([import('./remotion/PostCard'), import('./remotion/Thumbnail'), import('./remotion/Scene'), import('./remotion/CaptionVideo')])
      .then(([pc, th, sc, cv]) => ({ PostCard: pc.PostCard, Thumbnail: th.Thumbnail, Scene: sc.Scene, CaptionVideo: cv.CaptionVideo, getTotalDurationInFrames: cv.getTotalDurationInFrames }));
  }
  return promise;
}
