'use client';
import { useEffect, useMemo, useState } from 'react';
import { fileUrl, ui, type MediaItem } from './api';
import type { CardsData } from './CardsSection';
import type { ScenesData } from './ScenesSection';

export type PickTarget = { label: string; onPick: (m: MediaItem) => void } | null;

// 글의 블로그/media 사진을 가로로 항상 펼쳐둔다. 카드/씬에서 "사진 바꾸기"를 누르면 여기서 클릭.
export function MediaStrip({ media, cards, scenes, target, onCancel }: { media: MediaItem[]; cards: CardsData | null; scenes: ScenesData | null; target: PickTarget; onCancel: () => void }) {
  const [q, setQ] = useState('');
  const used = useMemo(() => {
    const m: Record<string, string[]> = {};
    const add = (url: string | null | undefined, label: string) => { if (!url) return; const k = url.split('/').pop()!.normalize('NFC'); (m[k] ??= []).push(label); };
    cards?.cards.forEach((c) => { add(c.imageUrl, `카드 ${c.id.slice(0, 2)}`); c.insets?.forEach((i) => add(i.imageUrl, `카드 ${c.id.slice(0, 2)} 인셋`)); });
    scenes?.scenes.forEach((s, i) => { add(s.imageUrl, `씬 ${i + 1}`); (s.insets as { imageUrl: string }[] | undefined)?.forEach((x) => add(x.imageUrl, `씬 ${i + 1} 인셋`)); });
    return m;
  }, [cards, scenes]);
  useEffect(() => {
    if (!target) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [target, onCancel]);
  const list = media.filter((m) => !q || m.name.includes(q));
  return (
    <div className={`${ui.card} ${target ? 'ring-2 ring-[#19C79A]' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={ui.h}>미디어 <span className="text-xs font-normal text-gray-400">{media.length}개</span></div>
        {target ? <span className="text-sm text-[#19C79A]">▶ <b>{target.label}</b>에 넣을 사진을 클릭하세요 <button className="ml-2 text-xs text-gray-400 underline" onClick={onCancel}>취소(Esc)</button></span>
          : <span className={ui.sub}>카드·씬의 [사진 바꾸기]를 누른 뒤 여기서 고르면 돼요</span>}
        <input className={`${ui.input} ml-auto w-40`} placeholder="파일명 검색" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {list.length === 0 && <div className="text-sm text-gray-400">블로그/media 폴더가 비어 있어요 (npm run prep 먼저)</div>}
        {list.map((m) => (
          <button key={m.rel} disabled={!target} onClick={() => target?.onPick(m)} title={m.name}
            className={`relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-lg bg-gray-100 ${target ? 'hover:ring-2 hover:ring-[#19C79A]' : 'cursor-default'}`}>
            {m.video ? <video src={fileUrl(m.rel)} muted className="h-full w-full object-cover" /> : <img src={fileUrl(m.rel)} alt="" className="h-full w-full object-cover" loading="lazy" />}
            {used[m.name] && <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white">{used[m.name][0]}{used[m.name].length > 1 ? ` +${used[m.name].length - 1}` : ''}</span>}
            <span className="absolute bottom-0 left-0 right-0 truncate bg-black/50 px-1 text-[9px] text-white">{m.name.replace(/\.[^.]+$/, '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
