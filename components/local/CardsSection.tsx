'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, fileUrl, ui, type MediaItem } from './api';
import { RemotionStill } from './RemotionStill';
import { PanZoom } from './PanZoom';
import { useSelect } from './useSelect';

export type Inset = { imageUrl: string; label?: string; labelAt?: string; zoom?: number; position?: string };
export type Card = { id: string; type: 'insetCover' | 'tagCover'; imageUrl: string | null; imageZoom?: number; imagePosition?: string; insets?: Inset[]; category?: string; title?: string; description?: string };
export type CardsData = { sourceDir: string; businessName?: string; canvas: { width: number; height: number; fps: number }; cards: Card[] };
type Props = { post: string; loaded: { dataPath: string; data: CardsData }; onChange: (d: CardsData) => void; setDirty: (v: boolean) => void; onSaved: () => void; requestPick: (label: string, onPick: (m: MediaItem) => void) => void };

export function CardsSection({ post, loaded, onChange, setDirty, onSaved, requestPick }: Props) {
  const { data, dataPath } = loaded;
  const [sel, setSel] = useState(data.cards[0]?.id ?? '');
  const [changed, setChanged] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [bust, setBust] = useState(0);
  useSelect('cards', useCallback((id: string | number) => setSel(String(id)), []));
  useEffect(() => { setDirty(changed.size > 0); }, [changed, setDirty]);

  const card = data.cards.find((c) => c.id === sel) ?? data.cards[0];
  const patch = (id: string, p: Partial<Card>) => { onChange({ ...data, cards: data.cards.map((c) => (c.id === id ? { ...c, ...p } : c)) }); setChanged((s) => new Set(s).add(id)); };
  const setInset = (id: string, i: number, p: Partial<Inset>) => { const c = data.cards.find((x) => x.id === id)!; const insets = [...(c.insets || [])]; insets[i] = { ...insets[i], ...p }; patch(id, { insets }); };

  const save = async (action: 'save' | 'render' | 'render-all', extra: Record<string, unknown> = {}) => {
    setBusy(action); setMsg('');
    try {
      const r = await api<{ data: CardsData; jobId: string | null }>('cards', { post, dataPath, data, action, ids: [...changed], ...extra });
      onChange(r.data); setChanged(new Set()); setBust(Date.now()); setMsg(r.jobId ? '렌더를 큐에 넣었어요(우상단 벨)' : '저장했어요'); onSaved();
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(''); }
  };
  const pick = (label: string, id: string, insetIndex?: number) => requestPick(label, async (m) => {
    setBusy('pick');
    try { const r = await api<{ data: CardsData }>('cards', { post, dataPath, data, action: 'save', pick: { cardId: id, insetIndex, media: m.rel } }); onChange(r.data); setChanged((s) => new Set(s).add(id)); }
    catch (e) { setMsg((e as Error).message); } finally { setBusy(''); }
  });

  if (!card) return null;
  return (
    <div className={ui.card}>
      <div className="flex flex-wrap items-center gap-3">
        <div className={ui.h}>클립 게시물 카드 <span className="text-xs font-normal text-gray-400">{data.cards.length}장 · {dataPath}</span></div>
        <div className="ml-auto flex gap-2">
          <button className={ui.btn2} disabled={!!busy} onClick={() => save('save')}>저장</button>
          <button className={ui.btn} disabled={!!busy || changed.size === 0} onClick={() => save('render')}>저장하고 바뀐 {changed.size}장 렌더</button>
          <button className={ui.btn2} disabled={!!busy} onClick={() => save('render-all')}>전체 렌더</button>
        </div>
        {msg && <div className="w-full text-xs text-gray-500">{msg}</div>}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[136px_minmax(0,1fr)]">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {data.cards.map((c) => (
            <button key={c.id} onClick={() => setSel(c.id)} className={`shrink-0 rounded-xl p-1 text-left ${c.id === sel ? 'ring-2 ring-[#19C79A]' : 'hover:ring-2 hover:ring-gray-200'}`}>
              {c.imageUrl ? <RemotionStill kind="card" inputProps={c} width={120} /> : <div className="flex h-[120px] w-[120px] items-center justify-center rounded-lg bg-red-50 text-[11px] text-red-500">사진 없음</div>}
              <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500"><span className="truncate">{c.id}</span>{changed.has(c.id) && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="shrink-0">
            <PanZoom position={card.imagePosition || '50% 50%'} zoom={card.imageZoom ?? 1} width={460} disabled={!card.imageUrl}
              onChange={({ position, zoom }) => patch(card.id, { imagePosition: position, imageZoom: zoom })}>
              {card.imageUrl ? <RemotionStill kind="card" inputProps={card} width={460} /> : <div className="flex h-[460px] w-[460px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">사진을 골라주세요</div>}
            </PanZoom>
            <div className="mt-2 flex gap-2">
              <button className={ui.btn2} onClick={() => pick(`${card.id} 배경`, card.id)}>사진 바꾸기</button>
              <input className={ui.input} value={card.imageUrl || ''} onChange={(e) => patch(card.id, { imageUrl: e.target.value })} placeholder="post-cards-images/…" />
            </div>
          </div>
          <div className="min-w-[280px] flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-700">{card.id}</span>
              <select className={`${ui.input} w-36`} value={card.type} onChange={(e) => patch(card.id, { type: e.target.value as Card['type'] })}><option>insetCover</option><option>tagCover</option></select>
              <span className="ml-auto text-xs text-gray-400">{card.imagePosition || '50% 50%'} · {(card.imageZoom ?? 1).toFixed(2)}x</span>
            </div>
            {card.type === 'insetCover' && (
              <div className="grid grid-cols-2 gap-2">
                <div><label className={ui.sub}>category (흰 태그)</label><input className={ui.input} value={card.category || ''} onChange={(e) => patch(card.id, { category: e.target.value })} /></div>
                <div><label className={ui.sub}>title</label><input className={ui.input} value={card.title || ''} onChange={(e) => patch(card.id, { title: e.target.value })} /></div>
              </div>
            )}
            <div><label className={ui.sub}>description (줄바꿈 = 줄 나눔)</label><textarea className={ui.input} rows={3} value={card.description || ''} onChange={(e) => patch(card.id, { description: e.target.value })} /></div>
            {card.type === 'insetCover' && (
              <div>
                <label className={ui.sub}>insets (최대 2)</label>
                <div className="space-y-2">
                  {(card.insets || []).map((ins, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 p-2">
                      <button className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100" onClick={() => pick(`${card.id} 인셋 ${i + 1}`, card.id, i)} title="사진 바꾸기">
                        {ins.imageUrl && <img src={`/api/local/public/${ins.imageUrl}`} alt="" className="h-full w-full object-cover" />}
                      </button>
                      <input className={ui.input} placeholder="라벨" value={ins.label || ''} onChange={(e) => setInset(card.id, i, { label: e.target.value })} />
                      <select className={`${ui.input} w-32`} value={ins.labelAt || (i === 0 ? 'topLeft' : 'bottomRight')} onChange={(e) => setInset(card.id, i, { labelAt: e.target.value })}><option value="topLeft">topLeft</option><option value="bottomRight">bottomRight</option></select>
                      <label className="flex items-center gap-1 text-[11px] text-gray-500">zoom<input type="range" min={1} max={2.5} step={0.05} value={ins.zoom ?? 1.3} onChange={(e) => setInset(card.id, i, { zoom: Number(e.target.value) })} /></label>
                      <input className={`${ui.input} w-24`} placeholder="50% 50%" value={ins.position || ''} onChange={(e) => setInset(card.id, i, { position: e.target.value })} />
                      <button className="text-xs text-red-500" onClick={() => patch(card.id, { insets: (card.insets || []).filter((_, j) => j !== i) })}>삭제</button>
                    </div>
                  ))}
                  {(card.insets || []).length < 2 && <button className={ui.btn2} onClick={() => patch(card.id, { insets: [...(card.insets || []), { imageUrl: '', label: '', labelAt: (card.insets || []).length ? 'bottomRight' : 'topLeft', zoom: 1.3, position: '50% 50%' }] })}>인셋 추가</button>}
                </div>
              </div>
            )}
            <details className="text-xs text-gray-400"><summary>렌더된 PNG 보기</summary><img src={fileUrl(`${data.sourceDir.replace(/^.*?(posts|발행완료)\//, '$1/')}/클립/게시물/${card.id}.png`, bust)} alt="" className="mt-2 w-60 rounded" /></details>
          </div>
        </div>
      </div>
    </div>
  );
}
