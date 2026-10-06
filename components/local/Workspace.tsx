'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api, postHref, useJobs, ui, STAGES, STAGE_LABEL, type Post, type MediaItem, type ReviewItem } from './api';
import { Shell } from './Shell';
import { Overview } from './Overview';
import { CardsSection, type CardsData } from './CardsSection';
import { ScenesSection, type ScenesData } from './ScenesSection';
import { ThumbSection } from './ThumbSection';
import { FinanceSection } from './FinanceSection';
import { MediaStrip } from './MediaStrip';

export type Loaded<T> = { dataPath: string; data: T } | null;

export function Workspace({ post }: { post: string }) {
  const [info, setInfo] = useState<Post | null>(null);
  const [neighbors, setNeighbors] = useState<{ prev: Post | null; next: Post | null }>({ prev: null, next: null });
  const [cards, setCards] = useState<Loaded<CardsData>>(null);
  const [scenes, setScenes] = useState<Loaded<ScenesData>>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [pickTarget, setPickTarget] = useState<{ label: string; onPick: (m: MediaItem) => void } | null>(null);
  const [err, setErr] = useState('');
  const jobs = useJobs().filter((j) => j.post === post);
  const q = `post=${encodeURIComponent(post)}`;

  const reload = useCallback(() => {
    api<{ post: Post }>(`fs?op=post&${q}`).then((r) => setInfo(r.post)).catch((e) => setErr(e.message));
    api<{ posts: Post[] }>('fs?op=posts').then((r) => { const i = r.posts.findIndex((p) => p.rel === post); setNeighbors({ prev: r.posts[i - 1] || null, next: r.posts[i + 1] || null }); }).catch(() => {});
    api<{ items: ReviewItem[] }>('fs?op=review').then((r) => setReview(r.items.filter((x) => x.post === post))).catch(() => {});
  }, [post, q]);

  useEffect(() => {
    reload();
    api<{ dataPath: string; data: CardsData }>(`cards?${q}`).then((r) => setCards(r)).catch(() => setCards(null));
    api<{ dataPath: string; data: ScenesData }>(`scenes?${q}`).then((r) => setScenes(r)).catch(() => setScenes(null));
    api<{ media: MediaItem[] }>(`fs?op=media&${q}`).then((r) => setMedia(r.media)).catch(() => {});
  }, [post, q, reload]);

  // 섹션의 useEffect 의존성에 들어가므로 참조가 고정돼야 한다(매 렌더 새 함수면 무한 루프).
  const setCardsDirty = useCallback((v: boolean) => setDirty((d) => (d.cards === v ? d : { ...d, cards: v })), []);
  const setScenesDirty = useCallback((v: boolean) => setDirty((d) => (d.scenes === v ? d : { ...d, scenes: v })), []);
  const requestPick = useCallback((label: string, onPick: (m: MediaItem) => void) => setPickTarget({ label, onPick }), []);
  const anyDirty = Object.values(dirty).some(Boolean);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (anyDirty) e.preventDefault(); };
    window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h);
  }, [anyDirty]);

  const right = (
    <>
      <div className={ui.card}>
        <div className={ui.h}>단계</div>
        <ol className="mt-3 space-y-2 text-[13px]">
          {info && STAGES.map((s) => { const done = info.stages[s]; const isNext = info.next === s; return (
            <li key={s} className={`flex items-center gap-2 ${done ? 'text-gray-400' : isNext ? 'font-bold text-gray-900' : 'text-gray-300'}`}>
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${done ? 'bg-[#19C79A] text-white' : isNext ? 'border-2 border-[#19C79A]' : 'border border-gray-200'}`}>{done ? '✓' : ''}</span>
              {STAGE_LABEL[s]}{isNext && <span className="ml-auto text-[11px] text-[#19C79A]">다음 할 일</span>}
            </li>
          ); })}
        </ol>
      </div>
      <div className={ui.card}>
        <div className={ui.h}>검수 경고 <span className="text-xs font-normal text-gray-400">{review.length}</span></div>
        <div className="mt-2 space-y-1.5 text-[12px]">
          {review.length === 0 && <div className="text-gray-400">없어요</div>}
          {review.map((r, i) => <a key={i} href={`#${r.section}`} className="block text-gray-600 hover:text-[#19C79A]"><b>{r.item}</b> {r.message}</a>)}
        </div>
      </div>
      <div className={ui.card}>
        <div className={ui.h}>이 글의 렌더</div>
        <div className="mt-2 space-y-1.5 text-[12px]">
          {jobs.length === 0 && <div className="text-gray-400">아직 없어요</div>}
          {jobs.slice(0, 6).map((j) => <div key={j.id} className="flex gap-2"><span className={j.status === 'running' ? 'text-[#19C79A]' : j.status === 'error' ? 'text-red-500' : 'text-gray-400'}>●</span><span className="truncate">{j.label}</span>{j.status === 'error' && <span className="truncate text-red-500">{j.log.split('\n').pop()}</span>}</div>)}
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        {neighbors.prev && <Link className={`${ui.btn2} flex-1 truncate text-center`} href={postHref(neighbors.prev.rel)}>← {neighbors.prev.name.replace(/^\d{6}/, '')}</Link>}
        {neighbors.next && <Link className={`${ui.btn2} flex-1 truncate text-center`} href={postHref(neighbors.next.rel)}>{neighbors.next.name.replace(/^\d{6}/, '')} →</Link>}
      </div>
    </>
  );

  return (
    <Shell right={right} inWorkspace>
      <div className="flex items-center gap-3">
        <Link href="/local" className="text-sm text-gray-400 hover:text-gray-700">작업판</Link><span className="text-gray-300">/</span>
        <h1 className="text-lg font-extrabold text-gray-900">{post.split('/').pop()}</h1>
        <span className={ui.sub}>{post}</span>
        {anyDirty && <span className={`${ui.chip} bg-amber-50 text-amber-700`}>저장 안 됨</span>}
      </div>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <section id="overview"><Overview post={post} info={info} cards={cards?.data ?? null} scenes={scenes?.data ?? null} /></section>
      <section id="media"><MediaStrip media={media} cards={cards?.data ?? null} scenes={scenes?.data ?? null} target={pickTarget} onCancel={() => setPickTarget(null)} /></section>
      <section id="thumb"><ThumbSection post={post} info={info} media={media} onSaved={reload} requestPick={requestPick} /></section>
      <section id="cards">{cards && <CardsSection post={post} loaded={cards} onChange={(d) => { setCards({ ...cards, data: d }); }} setDirty={setCardsDirty} onSaved={reload} requestPick={requestPick} />}</section>
      <section id="scenes">{scenes && <ScenesSection post={post} loaded={scenes} onChange={(d) => { setScenes({ ...scenes, data: d }); }} setDirty={setScenesDirty} onSaved={reload} requestPick={requestPick} />}</section>
      <section id="finance"><FinanceSection slug={post.split('/').pop()!.replace(/^\d{6}_?/, '')} compact /></section>
    </Shell>
  );
}
