'use client';
import { useEffect, useMemo, useState } from 'react';
import { api, fileUrl, ui, type MediaItem, type Post } from './api';
import { HomeTool } from '@/components/HomeTool';

type Args = { preset: string; bg: string; main: string; sub: string; cat: string; filter: string; font: string; pos: string; crop: string; accent: string };
const PRESETS = ['심플', '카페', '푸드팝', '임팩트', '크림', '골드', '클래식', '박스'];
const FONTS = ['고딕', '프리텐다드', '고딕엑스볼드', '고딕미디엄', '도현', '연성', '기랑', '나눔'];
const EMPTY: Args = { preset: '심플', bg: '', main: '', sub: '', cat: '', filter: '35', font: '고딕', pos: 'center', crop: 'center', accent: '' };
const PREVIEW_W = 400;

export function ThumbSection({ post, info, media, onSaved, requestPick }: { post: string; info: Post | null; media: MediaItem[]; onSaved: () => void; requestPick: (label: string, onPick: (m: MediaItem) => void) => void }) {
  const [args, setArgs] = useState<Args>(EMPTY);
  const [guessed, setGuessed] = useState(false);
  const [png, setPng] = useState<string | null>(null);
  const [html, setHtml] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [bust, setBust] = useState(0);
  const [blogkit, setBlogkit] = useState(false);
  const q = `post=${encodeURIComponent(post)}`;

  useEffect(() => {
    api<{ args: Partial<Args> | null; guessed: boolean; png: string | null }>(`thumb?${q}`)
      .then((r) => { if (r.args) setArgs({ ...EMPTY, ...r.args }); setGuessed(r.guessed && !!r.args); setPng(r.png); })
      .catch((e) => setMsg(e.message));
  }, [q]);

  // 라이브 미리보기: 같은 스크립트가 만든 HTML을 iframe에. 200ms 디바운스.
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = new URLSearchParams({ post, preview: '1', ...args }).toString();
      fetch(`/api/local/thumb?${qs}`).then((r) => r.text()).then(setHtml).catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [args, post]);

  const set = (p: Partial<Args>) => setArgs((a) => ({ ...a, ...p }));
  const bgRel = useMemo(() => media.find((m) => m.name === args.bg)?.rel, [media, args.bg]);
  const canRender = !!args.bg && !!args.main && !!info?.hasMedia;

  const render = async () => {
    setBusy(true); setMsg('');
    try { const r = await api<{ png: string; log: string }>('thumb', { post, args }); setPng(r.png); setBust(Date.now()); setGuessed(false); setMsg(r.log.split('\n').slice(-1)[0]); onSaved(); }
    catch (e) { setMsg((e as Error).message); } finally { setBusy(false); }
  };
  const saveFromBlogkit = async (dataUrl: string) => {
    const r = await api<{ png: string }>('thumb', { post, dataUrl }); setPng(r.png); setBust(Date.now()); setBlogkit(false); setMsg('BlogKit 결과를 저장했어요'); onSaved();
  };

  return (
    <div className={ui.card}>
      <div className="flex flex-wrap items-center gap-3">
        <div className={ui.h}>블로그 썸네일 <span className="text-xs font-normal text-gray-400">1000x1000 · src/thumb.js</span></div>
        <div className="ml-auto flex gap-2">
          <button className={ui.btn2} disabled={!info?.hasMedia} onClick={() => setBlogkit((v) => !v)}>{blogkit ? 'BlogKit 닫기' : 'BlogKit으로 자유 편집'}</button>
          <button className={ui.btn} disabled={busy || !canRender} onClick={render}>{busy ? '렌더 중…' : 'PNG 저장 (2~3초)'}</button>
        </div>
        {guessed && <div className="w-full rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-800">thumb.json이 없어서 post.md에서 추정한 값이에요(제목 = 썸네일 alt, 배경 = 본문 첫 사진). PNG 저장하면 기록돼요.</div>}
        {!info?.hasMedia && <div className="w-full text-xs text-amber-700">블로그/media 폴더가 없어요. `npm run prep -- &lt;slug&gt;` 먼저.</div>}
        {msg && <div className="w-full text-xs text-gray-500">{msg}</div>}
      </div>
      {blogkit ? (
        <div className="mt-4 rounded-xl border border-gray-100 p-2">
          <div className="mb-2 text-xs text-gray-500">아래 도구의 [다운로드]를 누르면 파일로 내려받는 대신 이 글 폴더의 썸네일로 저장돼요.</div>
          <HomeTool embedded initial={{ bgImage: bgRel ? fileUrl(bgRel) : undefined, title: args.main.split('|')[0] || undefined, subtitle: args.sub || undefined, category: args.cat || undefined }} onSave={saveFromBlogkit} />
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="shrink-0">
            <div className="overflow-hidden rounded-xl bg-gray-100" style={{ width: PREVIEW_W, height: PREVIEW_W }}>
              <iframe title="썸네일 미리보기" srcDoc={html} sandbox="allow-same-origin" scrolling="no" style={{ width: 1000, height: 1000, border: 0, transform: `scale(${PREVIEW_W / 1000})`, transformOrigin: '0 0', pointerEvents: 'none' }} />
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400"><span>라이브 미리보기 (저장 전)</span>{png && <a className="underline" href={fileUrl(png, bust)} target="_blank" rel="noreferrer">저장된 PNG 열기</a>}</div>
          </div>
          <div className="min-w-[280px] flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><label className={ui.sub}>프리셋</label><select className={ui.input} value={args.preset} onChange={(e) => set({ preset: e.target.value })}>{PRESETS.map((p) => <option key={p}>{p}</option>)}</select></div>
              <div><label className={ui.sub}>글꼴</label><select className={ui.input} value={args.font} onChange={(e) => set({ font: e.target.value })}>{FONTS.map((p) => <option key={p}>{p}</option>)}</select></div>
            </div>
            <div><label className={ui.sub}>배경 사진</label>
              <div className="flex items-center gap-2">
                <button className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100" onClick={() => requestPick('썸네일 배경', (m) => set({ bg: m.name }))}>{bgRel && <img src={fileUrl(bgRel)} alt="" className="h-full w-full object-cover" />}</button>
                <input className={ui.input} value={args.bg} onChange={(e) => set({ bg: e.target.value })} placeholder="파일명" />
                <button className={ui.btn2} onClick={() => requestPick('썸네일 배경', (m) => set({ bg: m.name }))}>고르기</button>
              </div></div>
            <div><label className={ui.sub}>제목 (줄바꿈 = 줄 나눔, **단어** = 포인트색)</label>
              <textarea className={`${ui.input} text-base`} rows={2} value={args.main.split('|').join('\n')} onChange={(e) => set({ main: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean).join('|') })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={ui.sub}>설명(--sub)</label><input className={ui.input} value={args.sub} onChange={(e) => set({ sub: e.target.value })} /></div>
              <div><label className={ui.sub}>카테고리(--cat)</label><input className={ui.input} value={args.cat} onChange={(e) => set({ cat: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div><label className={ui.sub}>어둡기 {args.filter}</label><input type="range" min={0} max={80} value={Number(args.filter)} onChange={(e) => set({ filter: e.target.value })} className="w-full" /></div>
              <div><label className={ui.sub}>위치</label><select className={ui.input} value={args.pos} onChange={(e) => set({ pos: e.target.value })}><option>center</option><option>bottom</option></select></div>
              <div><label className={ui.sub}>크롭</label><select className={ui.input} value={args.crop} onChange={(e) => set({ crop: e.target.value })}><option>center</option><option>top</option><option>bottom</option></select></div>
              <div><label className={ui.sub}>포인트색</label><input className={ui.input} value={args.accent} onChange={(e) => set({ accent: e.target.value })} placeholder="#b23a34" /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
