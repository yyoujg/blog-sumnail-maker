'use client';
import { useEffect, useRef, useState } from 'react';
import { api, fileUrl, ui } from './api';

type Block = { pill: string; m1: string; m2: string; sub: string; foot: string };
type Copy = Record<'a' | 'b' | 'c', Block>;
const KEYS: (keyof Block)[] = ['pill', 'm1', 'm2', 'sub', 'foot'];
const TITLES = { a: 'A 키워드형', b: 'B 후킹형', c: 'C 질문형' } as const;
const EMPTY_BLOCK: Block = { pill: '', m1: '', m2: '', sub: '', foot: '쑥쑥아리' };
const SCALE = 0.3;

// thumb/t.html을 iframe(같은 출처)으로 띄우고 contentDocument에 문구를 직접 넣는다 -> render-thumb.mjs와 같은 템플릿.
export function FinanceSection({ slug: initialSlug, compact }: { slug?: string; compact?: boolean }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [slug, setSlug] = useState(initialSlug || '');
  const [copy, setCopy] = useState<Copy | null>(null);
  const [exists, setExists] = useState(false);
  const [outs, setOuts] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [bust, setBust] = useState(0);
  const [open, setOpen] = useState(!compact);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => { api<{ slugs: string[] }>('fs?op=finance').then((r) => setSlugs(r.slugs)).catch(() => {}); }, []);
  useEffect(() => {
    if (!slug) return;
    api<{ copy: Copy | null; outs: string[] }>(`finance?slug=${encodeURIComponent(slug)}`)
      .then((r) => { setExists(!!r.copy); setCopy(r.copy || { a: { ...EMPTY_BLOCK }, b: { ...EMPTY_BLOCK }, c: { ...EMPTY_BLOCK } }); setOuts(r.outs); if (r.copy) setOpen(true); })
      .catch((e) => setMsg(e.message));
  }, [slug]);
  const inject = () => {
    const doc = frame.current?.contentDocument; if (!doc || !copy) return;
    for (const id of ['a', 'b', 'c'] as const) for (const k of KEYS) { const el = doc.querySelector(`#${id} .${k}`); if (el) el.textContent = copy[id][k]; }
  };
  useEffect(inject, [copy]);

  const render = async () => {
    setBusy(true); setMsg('');
    try { const r = await api<{ outs: string[] }>('finance', { slug, copy }); setOuts(r.outs); setBust(Date.now()); setExists(true); setMsg('thumb/out/에 3장 저장했어요'); }
    catch (e) { setMsg((e as Error).message); } finally { setBusy(false); }
  };

  if (compact && !open) return (
    <div className={ui.card}><div className="flex items-center gap-3"><div className={ui.h}>금융 썸네일</div><span className={ui.sub}>{exists ? `thumb/copy/${slug}.json` : '금융·정책 글일 때만'}</span>
      <button className={`${ui.btn2} ml-auto`} onClick={() => setOpen(true)}>{exists ? '열기' : '금융 썸네일 만들기'}</button></div></div>
  );
  return (
    <div className={ui.card}>
      <div className="flex flex-wrap items-center gap-3">
        <div className={ui.h}>금융 썸네일 <span className="text-xs font-normal text-gray-400">thumb/t.html · 2000x2000 3장</span></div>
        {!compact && <select className={`${ui.input} max-w-xs`} value={slug} onChange={(e) => setSlug(e.target.value)}><option value="">문구 파일 선택</option>{slugs.map((s) => <option key={s}>{s}</option>)}</select>}
        {!compact && <input className={`${ui.input} max-w-[200px]`} placeholder="새 slug (Enter)" onKeyDown={(e) => { if (e.key === 'Enter') setSlug((e.target as HTMLInputElement).value.trim()); }} />}
        {compact && <span className={ui.sub}>thumb/copy/{slug}.json</span>}
        <button className={`${ui.btn} ml-auto`} disabled={busy || !copy || !slug} onClick={render}>{busy ? '렌더 중…' : '저장하고 3장 렌더'}</button>
        {compact && <button className={ui.btn2} onClick={() => setOpen(false)}>접기</button>}
        {msg && <div className="w-full text-xs text-gray-500">{msg}</div>}
      </div>
      {copy && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="overflow-hidden rounded-xl bg-gray-100" style={{ width: 300, height: 900 }}>
            <iframe ref={frame} title="금융 썸네일 미리보기" src={fileUrl('thumb/t.html')} onLoad={inject} scrolling="no" style={{ width: 1000, height: 3000, border: 0, transform: `scale(${SCALE})`, transformOrigin: '0 0', pointerEvents: 'none' }} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(['a', 'b', 'c'] as const).map((k, i) => (
              <div key={k} className="space-y-1 rounded-xl border border-gray-100 p-3">
                <div className="text-sm font-semibold">{TITLES[k]}</div>
                {KEYS.map((f) => (
                  <div key={f}><label className={ui.sub}>{f}</label>
                    {f === 'm2' ? <textarea className={ui.input} rows={2} value={copy[k][f]} onChange={(e) => setCopy({ ...copy, [k]: { ...copy[k], [f]: e.target.value } })} />
                      : <input className={ui.input} value={copy[k][f]} onChange={(e) => setCopy({ ...copy, [k]: { ...copy[k], [f]: e.target.value } })} />}
                  </div>
                ))}
                {outs[i] && <a href={fileUrl(outs[i], bust)} target="_blank" rel="noreferrer" className="block text-[11px] text-[#19C79A] underline">저장된 PNG 열기</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
