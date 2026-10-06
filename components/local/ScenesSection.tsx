'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, fileUrl, ui, type MediaItem } from './api';
import { RemotionStill, ScenesPlayer } from './RemotionStill';
import { PanZoom } from './PanZoom';
import { useSelect } from './useSelect';

export type Scene = {
  type?: 'caption' | 'infoCard' | 'cover'; text?: string; imageUrl?: string | null; mediaType?: 'image' | 'video'; durationInFrames: number;
  infoCard?: { location?: string; hours?: string; price?: string };
  imageZoom?: number; imagePosition?: string; insets?: { imageUrl: string; label?: string; labelAt?: string; zoom?: number; position?: string }[]; category?: string; title?: string; description?: string; variant?: string;
  [k: string]: unknown;
};
export type ScenesData = { fps: number; width: number; height: number; businessName?: string; scenes: Scene[] };
type Props = { post: string; loaded: { dataPath: string; data: ScenesData; video?: string | null }; onChange: (d: ScenesData) => void; setDirty: (v: boolean) => void; onSaved: () => void; requestPick: (label: string, onPick: (m: MediaItem) => void) => void };

// build-scenes-data.js computeDurationInFrames 와 같은 규칙: 16자/초, 1.8~3.2초, 30fps
export const autoDuration = (text: string) => Math.round(Math.min(3.2, Math.max(1.8, text.length / 16)) * 30);
const MAX_CHARS = 24;

export function ScenesSection({ post, loaded, onChange, setDirty, onSaved, requestPick }: Props) {
  const { data, dataPath } = loaded;
  const [sel, setSel] = useState(0);
  const [dirty, setDirtyLocal] = useState(false);
  const [locked, setLocked] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [play, setPlay] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const [bust, setBust] = useState(0);
  useSelect('scenes', useCallback((id: string | number) => setSel(Number(id)), []));
  useEffect(() => { setDirty(dirty); }, [dirty, setDirty]);

  const scenes = data.scenes;
  const sc = scenes[sel] ?? scenes[0];
  const setScenes = (next: Scene[]) => { onChange({ ...data, scenes: next }); setDirtyLocal(true); };
  const patch = (i: number, p: Partial<Scene>) => setScenes(scenes.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const setText = (i: number, text: string) => patch(i, locked.has(i) ? { text } : { text, durationInFrames: autoDuration(text) });
  const move = (from: number, to: number) => { if (to < 0 || to >= scenes.length || from === to) return; const n = [...scenes]; const [x] = n.splice(from, 1); n.splice(to, 0, x); setScenes(n); setSel(to); };
  const total = scenes.reduce((s, x) => s + x.durationInFrames, 0) - Math.max(0, scenes.length - 1) * 15;

  const post_ = async (action: 'save' | 'video' | 'validate') => {
    setBusy(action); setMsg('');
    try {
      const r = await api<{ data: ScenesData; jobId: string | null; log: string }>('scenes', { post, dataPath, data, action });
      onChange(r.data); setDirtyLocal(false); setBust(Date.now()); setMsg(action === 'validate' ? r.log : r.jobId ? '영상 렌더를 큐에 넣었어요(수 분, 우상단 벨)' : '저장했어요'); onSaved();
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(''); }
  };
  const pick = (label: string, i: number, insetIndex?: number) => requestPick(label, async (m) => {
    setBusy('pick');
    try { const r = await api<{ data: ScenesData }>('scenes', { post, dataPath, data, action: 'save', pick: { sceneIndex: i, insetIndex, media: m.rel } }); onChange(r.data); }
    catch (e) { setMsg((e as Error).message); } finally { setBusy(''); }
  });

  if (!sc) return null;
  const kind = sc.type === 'cover' ? 'cover' : 'scene';
  return (
    <div className={ui.card}>
      <div className="flex flex-wrap items-center gap-3">
        <div className={ui.h}>클립 영상 씬 <span className="text-xs font-normal text-gray-400">{scenes.length}씬 · {(total / data.fps).toFixed(1)}초 · {dataPath}</span></div>
        <div className="ml-auto flex gap-2">
          <button className={ui.btn2} onClick={() => setPlay((v) => !v)}>{play ? '재생 닫기' : '전체 재생'}</button>
          <button className={ui.btn2} disabled={!!busy} onClick={() => post_('validate')}>검증</button>
          <button className={ui.btn2} disabled={!!busy} onClick={() => post_('save')}>저장</button>
          <button className={ui.btn} disabled={!!busy} onClick={() => post_('video')}>저장하고 영상 렌더</button>
          <button className={ui.btn2} onClick={() => { setScenes([...scenes, { type: 'caption', text: '', imageUrl: '', durationInFrames: 60 }]); setSel(scenes.length); }}>씬 추가</button>
        </div>
        {dataPath !== 'clip-pipeline/scripts/scenes-data.json' && <div className="w-full text-[11px] text-amber-700">[영상 렌더]를 누르면 렌더용 작업 파일(clip-pipeline/scripts/scenes-data.json)이 이 글 내용으로 덮어써져요. 저장·검증은 이 글 파일만 건드려요.</div>}
        {msg && <pre className="w-full whitespace-pre-wrap text-xs text-gray-500">{msg}</pre>}
      </div>
      {play && <div className="mt-4 flex justify-center"><ScenesPlayer scenes={scenes as Record<string, unknown>[]} width={300} /></div>}
      {loaded.video && !play && <details className="mt-2 text-xs text-gray-400"><summary>렌더된 shorts.mp4</summary><video src={fileUrl(loaded.video, bust)} controls className="mt-2 max-h-[420px] rounded" /></details>}
      <div className="mt-4 grid gap-4 md:grid-cols-[112px_minmax(0,1fr)]">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {scenes.map((s, i) => (
            <button key={i} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag != null) move(drag, i); setDrag(null); }}
              onClick={() => setSel(i)} className={`shrink-0 rounded-xl p-1 text-left ${i === sel ? 'ring-2 ring-[#19C79A]' : 'hover:ring-2 hover:ring-gray-200'}`} title="드래그로 순서 변경">
              {s.type === 'infoCard' ? <div className="flex h-[160px] w-[90px] items-center justify-center rounded-lg bg-gray-100 text-[11px] text-gray-400">정보카드</div>
                : !s.imageUrl ? <div className="flex h-[160px] w-[90px] items-center justify-center rounded-lg bg-red-50 text-[11px] text-red-500">사진 없음</div>
                : <RemotionStill kind={s.type === 'cover' ? 'cover' : 'scene'} inputProps={s.type === 'cover' ? { ...s, variant: 'topRow' } : s} width={90} />}
              <div className={`mt-1 w-[90px] truncate text-[11px] ${(s.text || '').length > MAX_CHARS ? 'text-amber-600' : 'text-gray-500'}`}>{i + 1}. {s.type === 'cover' ? '커버' : s.type === 'infoCard' ? '정보' : s.text || '(자막 없음)'}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="shrink-0">
            {sc.type === 'infoCard' ? <div className="flex h-[533px] w-[300px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">정보카드(미리보기 없음)</div>
              : !sc.imageUrl ? <div className="flex h-[533px] w-[300px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">사진을 골라주세요</div>
              : sc.type === 'cover' ? (
                <PanZoom position={sc.imagePosition || '50% 50%'} zoom={sc.imageZoom ?? 1} width={300} onChange={({ position, zoom }) => patch(sel, { imagePosition: position, imageZoom: zoom })}>
                  <RemotionStill kind="cover" inputProps={{ ...sc, variant: 'topRow' }} width={300} />
                </PanZoom>
              ) : <RemotionStill kind={kind} inputProps={sc} width={300} />}
            <div className="mt-2 flex gap-2">
              <button className={ui.btn2} onClick={() => pick(`씬 ${sel + 1}`, sel)}>사진/영상 바꾸기</button>
              <input className={ui.input} value={sc.imageUrl || ''} onChange={(e) => patch(sel, { imageUrl: e.target.value })} placeholder="images/… 또는 videos/…" />
            </div>
          </div>
          <div className="min-w-[280px] flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono">#{sel + 1}</span>
              <select className={`${ui.input} w-28`} value={sc.type || 'caption'} onChange={(e) => patch(sel, { type: e.target.value as Scene['type'] })}><option>caption</option><option>cover</option><option>infoCard</option></select>
              <label className="flex items-center gap-1 text-xs text-gray-500">길이
                <input className={`${ui.input} w-20`} type="number" value={sc.durationInFrames} onChange={(e) => { setLocked((s) => new Set(s).add(sel)); patch(sel, { durationInFrames: Number(e.target.value) }); }} />
                <span>{(sc.durationInFrames / data.fps).toFixed(1)}s {locked.has(sel) ? '(수동)' : '(자막 길이 자동)'}</span>
              </label>
              <button className={ui.btn2} onClick={() => move(sel, sel - 1)}>↑</button><button className={ui.btn2} onClick={() => move(sel, sel + 1)}>↓</button>
              <button className="ml-auto text-xs text-red-500" onClick={() => { setScenes(scenes.filter((_, j) => j !== sel)); setSel(Math.max(0, sel - 1)); }}>씬 삭제</button>
            </div>
            {(sc.type ?? 'caption') === 'caption' && (
              <div><label className={ui.sub}>자막 {(sc.text || '').length > MAX_CHARS && <span className="text-amber-600">{(sc.text || '').length}자 - 한 줄(760px) 넘칠 수 있어요</span>}</label>
                <input className={`${ui.input} text-base`} value={sc.text || ''} onChange={(e) => setText(sel, e.target.value)} /></div>
            )}
            {sc.type === 'infoCard' && (
              <div className="grid grid-cols-3 gap-2">{(['location', 'hours', 'price'] as const).map((k) => (
                <div key={k}><label className={ui.sub}>{k}</label><input className={ui.input} value={sc.infoCard?.[k] || ''} onChange={(e) => patch(sel, { infoCard: { ...sc.infoCard, [k]: e.target.value } })} /></div>))}
              </div>
            )}
            {sc.type === 'cover' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className={ui.sub}>category</label><input className={ui.input} value={sc.category || ''} onChange={(e) => patch(sel, { category: e.target.value })} /></div>
                  <div><label className={ui.sub}>title</label><input className={ui.input} value={sc.title || ''} onChange={(e) => patch(sel, { title: e.target.value })} /></div>
                </div>
                <div><label className={ui.sub}>description</label><textarea className={ui.input} rows={2} value={sc.description || ''} onChange={(e) => patch(sel, { description: e.target.value })} /></div>
                <div className="space-y-2">{(sc.insets || []).map((ins, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 p-2">
                    <button className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100" onClick={() => pick(`씬 ${sel + 1} 인셋 ${i + 1}`, sel, i)}>{ins.imageUrl && <img src={`/api/local/public/${ins.imageUrl}`} alt="" className="h-full w-full object-cover" />}</button>
                    <input className={ui.input} placeholder="라벨" value={ins.label || ''} onChange={(e) => { const insets = [...(sc.insets || [])]; insets[i] = { ...ins, label: e.target.value }; patch(sel, { insets }); }} />
                    <button className="text-xs text-red-500" onClick={() => patch(sel, { insets: (sc.insets || []).filter((_, j) => j !== i) })}>삭제</button>
                  </div>))}
                  {(sc.insets || []).length < 2 && <button className={ui.btn2} onClick={() => patch(sel, { insets: [...(sc.insets || []), { imageUrl: '', label: '', labelAt: (sc.insets || []).length ? 'bottomRight' : 'topLeft', zoom: 1.2, position: '50% 50%' }] })}>인셋 추가</button>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
