'use client';
import { useEffect, useState } from 'react';

export const SCRATCH = 'scratch';
export type Stage = 'prep' | 'post' | 'thumb' | 'published' | 'scenes' | 'video' | 'cards' | 'upload';
export const STAGES: Stage[] = ['prep', 'post', 'thumb', 'published', 'scenes', 'video', 'cards', 'upload'];
export const STAGE_LABEL: Record<Stage, string> = { prep: '파일 준비', post: '원고', thumb: '썸네일', published: '발행', scenes: '씬', video: '영상', cards: '카드', upload: '업로드 준비' };
export type Post = { name: string; rel: string; isDraft: boolean; group: string; hasMedia: boolean; hasCards: boolean; hasScenes: boolean; stages: Record<Stage, boolean>; next: Stage | null; mtime: number; thumb: string | null; date: string | null };
export type ReviewItem = { post: string; section: 'cards' | 'scenes' | 'thumb'; item: string; message: string };
export type Job = { id: string; label: string; post: string; status: 'running' | 'done' | 'error'; log: string; startedAt: number; endedAt?: number };
export type MediaItem = { name: string; rel: string; video: boolean };

export async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/local/${path}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `${res.status} ${path}`);
  return json as T;
}
export const fileUrl = (rel: string, bust: number | string = '') => `/api/local/fs?path=${encodeURIComponent(rel)}&t=${bust}`;
export const postHref = (rel: string) => `/local/${rel.split('/').map(encodeURIComponent).join('/')}`;
export const fmtDate = (ms: number) => new Date(ms).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');

// 렌더 큐 폴링(2초). 실행 중인 게 없으면 6초.
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try { const r = await api<{ jobs: Job[] }>('jobs'); setJobs(r.jobs); t = setTimeout(tick, r.jobs.some((j) => j.status === 'running') ? 2000 : 6000); }
      catch { t = setTimeout(tick, 6000); }
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  return jobs;
}

export const ui = {
  card: 'rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
  h: 'text-[15px] font-bold text-gray-900',
  sub: 'text-xs text-gray-400',
  input: 'w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#19C79A]',
  btn: 'rounded-lg bg-[#19C79A] px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40',
  btn2: 'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40',
  chip: 'rounded-full px-2 py-0.5 text-[11px] font-medium',
  mint: '#19C79A',
};
