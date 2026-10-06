'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api, fileUrl, postHref, fmtDate, useJobs, ui, STAGE_LABEL, type Post, type ReviewItem } from './api';
import { Shell } from './Shell';

type Tab = 'drafts' | 'published';
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function Dashboard({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [posts, setPosts] = useState<Post[]>([]);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [rows, setRows] = useState<{ period: string; finance: string; food: string; note: string }[]>([]);
  const [logTab, setLogTab] = useState<'jobs' | 'review'>('review');
  const [showAll, setShowAll] = useState(false);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [today, setToday] = useState<Date | null>(null); // 렌더 중 new Date()는 lint(purity) 위반 → 서버 시각을 받아 넣는다
  const jobs = useJobs();

  useEffect(() => {
    api<{ posts: Post[] }>('fs?op=posts').then((r) => setPosts(r.posts)).catch((e) => setErr(e.message));
    api<{ items: ReviewItem[] }>('fs?op=review').then((r) => setReview(r.items)).catch(() => {});
    api<{ rows: typeof rows; now: number }>('fs?op=calendar').then((r) => { setRows(r.rows); setToday(new Date(r.now)); }).catch(() => setToday(new Date()));
  }, []);

  const list = useMemo(() => posts.filter((p) => (tab === 'drafts' ? p.isDraft : !p.isDraft) && (!q || p.name.includes(q))), [posts, tab, q]);
  const counts = {
    썸네일: list.filter((p) => p.stages.post && !p.stages.thumb).length,
    카드: list.filter((p) => p.stages.scenes && !p.stages.cards).length,
    영상: list.filter((p) => p.stages.scenes && !p.stages.video).length,
    업로드: list.filter((p) => p.stages.cards && p.stages.video && !p.stages.upload).length,
  };
  const week = today ? [...Array(7)].map((_, i) => { const d = new Date(today); d.setDate(today.getDate() - today.getDay() + i); return d; }) : [];
  const reviewBy = (s: ReviewItem['section']) => review.filter((r) => r.section === s).length;
  // 캘린더 표(조회수30만주제.md)는 손으로 고치는 문서라 이미 발행한 글이 그대로 남는다 → 발행완료 폴더와 대조해 줄을 긋는다.
  const published = useMemo(() => posts.filter((p) => !p.isDraft).map((p) => ({ key: p.name.replace(/^\d{6}_?/, ''), date: p.date })), [posts]);

  const right = (
    <>
      <div className={ui.card}>
        <div className="flex items-baseline justify-between">
          <div className={ui.h}>오늘{today && `, ${DAYS[today.getDay()]}요일`} <span className="ml-1 text-xs font-normal text-gray-400">{today?.toISOString().slice(0, 10).replace(/-/g, '.')}</span></div>
        </div>
        <div className="mt-4 grid grid-cols-7 text-center text-xs text-gray-400">{DAYS.map((d) => <div key={d}>{d}</div>)}</div>
        <div className="mt-1 grid grid-cols-7 text-center text-sm font-semibold">
          {week.map((d) => { const isToday = d.toDateString() === today?.toDateString(); return (
            <div key={d.toISOString()} className="flex justify-center"><span className={`flex h-8 w-8 items-center justify-center rounded-full ${isToday ? 'bg-[#19C79A] text-white' : 'text-gray-800'}`}>{d.getDate()}</span></div>
          ); })}
        </div>
        <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-[13px]">
          {rows.slice(0, 3).map((r) => (
            <div key={r.period} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" /><div><span className="mr-2 text-gray-400">{r.period}</span><Tokens text={r.finance} published={published} className="text-gray-700" /><div className="text-[11px] text-gray-400"><Tokens text={r.food} published={published} /></div></div></div>
          ))}
        </div>
      </div>
      <div className={ui.card}>
        <div className={ui.h}>검수 대기</div>
        <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">검수를 기다리는 항목이 <span className="font-bold text-red-500 underline">{review.length}건</span> 있어요!</div>
        <div className="mt-3 flex justify-around text-xs text-gray-500">
          <span>카드 <b className="text-gray-900">{reviewBy('cards')}</b></span><span>씬 <b className="text-gray-900">{reviewBy('scenes')}</b></span><span>썸네일 <b className="text-gray-900">{reviewBy('thumb')}</b></span>
        </div>
      </div>
    </>
  );

  return (
    <Shell right={right}>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <div className={ui.card}>
        <div className="flex items-center gap-5 border-b border-gray-100 pb-3">
          {(['drafts', 'published'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-3.5 border-b-2 pb-3 text-[15px] font-bold ${tab === t ? 'border-[#19C79A] text-gray-900' : 'border-transparent text-gray-400'}`}>{t === 'drafts' ? '작업중 글' : '발행 글'}</button>
          ))}
          <button className="ml-auto text-xs text-gray-400 underline" onClick={() => setShowAll((v) => !v)}>{showAll ? '접기' : '더보기'}</button>
        </div>
        <div className="mt-3 flex gap-4 text-[13px]">
          {Object.entries(counts).map(([k, v], i) => <span key={k} className={i === 0 ? 'font-bold text-[#19C79A]' : 'text-gray-500'}>{k} 대기 {v}</span>)}
          <span className="ml-auto text-gray-400">{list.length}편</span>
        </div>
        {showAll ? (
          <div className="mt-4">
            <input className={`${ui.input} mb-3 max-w-xs`} placeholder="폴더명 검색" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{list.map((p) => <PostCard key={p.rel} p={p} />)}</div>
          </div>
        ) : (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">{list.slice(0, 12).map((p) => <PostCard key={p.rel} p={p} />)}</div>
        )}
      </div>

      <div className={ui.card}>
        <div className="flex items-center gap-5 border-b border-gray-100 pb-3">
          {(['review', 'jobs'] as const).map((t) => (
            <button key={t} onClick={() => setLogTab(t)} className={`-mb-3.5 border-b-2 pb-3 text-[15px] font-bold ${logTab === t ? 'border-[#19C79A] text-gray-900' : 'border-transparent text-gray-400'}`}>{t === 'review' ? '검수 필요' : '렌더 결과'}</button>
          ))}
        </div>
        <div className="mt-2 divide-y divide-gray-50 text-[13px]">
          {logTab === 'review' && review.slice(0, 10).map((r, i) => (
            <Link key={i} href={`${postHref(r.post)}#${r.section}`} className="flex items-center gap-3 py-2.5 hover:text-[#19C79A]">
              <span className={`${ui.chip} bg-red-50 text-red-500`}>{r.section === 'cards' ? '카드' : r.section === 'scenes' ? '씬' : '썸네일'}</span>
              <span className="truncate">{r.post.split('/').pop()} · {r.item}</span><span className="ml-auto shrink-0 text-gray-400">{r.message}</span>
            </Link>
          ))}
          {logTab === 'review' && review.length === 0 && <div className="py-3 text-gray-400">검수할 게 없어요</div>}
          {logTab === 'jobs' && jobs.slice(0, 10).map((j) => (
            <Link key={j.id} href={postHref(j.post)} className="flex items-center gap-3 py-2.5">
              <span className={`${ui.chip} ${j.status === 'running' ? 'bg-emerald-50 text-[#19C79A]' : j.status === 'error' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>{j.status === 'running' ? '진행중' : j.status === 'error' ? '실패' : '완료'}</span>
              <span className="truncate">{j.label} · {j.post.split('/').pop()}</span><span className="ml-auto text-gray-400">{new Date(j.startedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </Link>
          ))}
          {logTab === 'jobs' && jobs.length === 0 && <div className="py-3 text-gray-400">아직 렌더한 게 없어요</div>}
        </div>
      </div>
    </Shell>
  );
}

function PostCard({ p }: { p: Post }) {
  return (
    <Link href={postHref(p.rel)} className="relative block h-[190px] w-[150px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-[#1FAE86] to-[#2F6BFF] text-white">
      {p.thumb && <img src={fileUrl(p.thumb)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
      <div className="absolute left-2.5 top-2 text-[10px] font-medium opacity-90">{p.group === 'posts' ? '초안' : p.group}</div>
      <div className="absolute right-2.5 top-2 text-[10px] opacity-90">{p.date ? p.date.slice(5).replace('-', '.') : fmtDate(p.mtime)}</div>
      <div className="absolute bottom-2.5 left-2.5 right-2.5">
        <div className="line-clamp-2 text-[13px] font-bold leading-tight">{p.name.replace(/^\d{6}_?/, '')}</div>
        <div className="mt-1.5 inline-block rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-800">{p.next ? `다음: ${STAGE_LABEL[p.next]}` : '완료'}</div>
      </div>
    </Link>
  );
}


// "A → B, C(설명)" 같은 셀을 항목 단위로 쪼개 이미 발행된 항목은 숨긴다(남은 일만 보이게).
function Tokens({ text, published, className }: { text: string; published: { key: string; date: string | null }[]; className?: string }) {
  const norm = (t: string) => t.replace(/\(.*?\)|\*\*|\s/g, '').replace(/%/g, '퍼센트');
  // 항목이 발행 폴더명을 통째로 품을 때만(양방향 부분일치는 '파킹통장' ⊂ '대신더더더파킹통장' 같은 오탐).
  const isDone = (part: string) => { const n = norm(part); return n.length >= 4 && published.some((p) => n.includes(norm(p.key))); };
  const parts = text.split(/→|,|·/).map((t) => t.trim()).filter(Boolean);
  const left = parts.filter((t) => !isDone(t));
  const done = parts.length - left.length;
  return (
    <span className={className}>
      {left.join(' → ')}
      {done > 0 && <span className="ml-1 text-[10px] text-[#19C79A]">{left.length ? `(+${done}편 발행완료)` : `${done}편 모두 발행완료`}</span>}
    </span>
  );
}
