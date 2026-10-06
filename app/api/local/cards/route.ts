// 클립 게시물 카드: post-cards-data.json 편집. 렌더는 잡 큐(jobs)로 돌리고 jobId를 돌려준다.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { ROOT, CLIP_DIR, REMOTION_DIR, CARDS_SCRATCH, SCRATCH, guard, fail, safeResolve, postResolve, exists, readJson, writeJson, run, toRel } from '@/lib/local/server';
import { startJob } from '@/lib/local/jobs';

export const dynamic = 'force-dynamic';

type Inset = { imageUrl: string; label?: string; labelAt?: string; zoom?: number; position?: string };
type Card = { id: string; type: string; imageUrl: string | null; imageZoom?: number; imagePosition?: string; insets?: Inset[]; category?: string; title?: string; description?: string };
type CardsData = { sourceDir: string; businessName?: string; handle?: string; canvas: { width: number; height: number; fps: number }; cards: Card[] };

const dataPathFor = (post: string) =>
  post === SCRATCH ? path.join(ROOT, CARDS_SCRATCH) : path.join(postResolve(post), '클립', '게시물', 'post-cards-data.json');
const outDir = (d: CardsData) => path.join(postResolve(d.sourceDir), '클립', '게시물');
// 기존 id에 한글이 있어(02-tag-외관) 영숫자 대신 글자/숫자/_/- 허용. 경로 구분자와 .은 막힌다.
const pngPath = (d: CardsData, id: string) => {
  if (!/^[\p{L}\p{N}_-]+$/u.test(id)) throw new Error('bad card id: ' + id);
  return path.join(outDir(d), `${id}.png`);
};
const pngs = (d: CardsData) =>
  Object.fromEntries(d.cards.map((c) => { const p = pngPath(d, c.id); return [c.id, exists(p) ? toRel(p) : null]; }));

export async function GET(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const dataPath = dataPathFor(req.nextUrl.searchParams.get('post') || SCRATCH);
    if (!exists(dataPath)) return fail('post-cards-data.json 없음: ' + toRel(dataPath), 404);
    const data = readJson<CardsData>(dataPath);
    return NextResponse.json({ dataPath: toRel(dataPath), data, pngs: pngs(data) });
  } catch (e) { return fail(e); }
}

type Body = { post: string; dataPath: string; data: CardsData; action?: 'save' | 'render' | 'render-all'; ids?: string[]; pick?: { cardId: string; insetIndex?: number; media: string } };

async function renderCard(data: CardsData, card: Card) {
  fs.mkdirSync(outDir(data), { recursive: true });
  const props = path.join(os.tmpdir(), `post-card-props-${card.id}.json`);
  fs.writeFileSync(props, JSON.stringify(card));
  try { return await run('npx', ['remotion', 'still', 'src/index.ts', 'PostCard', pngPath(data, card.id), `--props=${props}`, '--frame=0'], path.join(ROOT, REMOTION_DIR)); }
  finally { fs.unlinkSync(props); }
}

export async function POST(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const { post, data, action = 'save', ids = [], pick } = (await req.json()) as Body;
    const abs = dataPathFor(post); // 클라이언트 dataPath는 GET이 같은 post로 돌려준 값이라 무시하고 다시 계산
    pngs(data); // 저장 전에 sourceDir·card.id 검증
    if (pick) {
      const src = safeResolve(pick.media);
      fs.copyFileSync(src, path.join(ROOT, REMOTION_DIR, 'public', 'post-cards-images', path.basename(src)));
      const card = data.cards.find((c) => c.id === pick.cardId);
      if (!card) throw new Error('card not found');
      const url = `post-cards-images/${path.basename(src).normalize('NFC')}`;
      if (pick.insetIndex == null) card.imageUrl = url;
      else (card.insets ??= [])[pick.insetIndex] = { ...(card.insets[pick.insetIndex] || {}), imageUrl: url };
    }
    if (exists(abs)) fs.copyFileSync(abs, abs + '.bak'); // 직전 1개만 보관
    writeJson(abs, data);
    if (toRel(abs) !== CARDS_SCRATCH) writeJson(path.join(ROOT, CARDS_SCRATCH), data); // 렌더/빌더 스크래치 동기
    let jobId: string | null = null;
    if (action === 'render-all') {
      jobId = startJob(`카드 전체 렌더 (${data.cards.length}장)`, post, () => run('node', ['scripts/render-post-cards.js', abs], path.join(ROOT, CLIP_DIR))).id;
    } else if (action === 'render') {
      const targets = data.cards.filter((c) => ids.includes(c.id) && c.imageUrl);
      if (!targets.length) throw new Error('렌더할 카드가 없어요(사진이 비었거나 바뀐 카드 없음)');
      jobId = startJob(`카드 렌더 ${targets.map((c) => c.id).join(', ')}`, post, async () => { let log = ''; for (const c of targets) log += await renderCard(data, c); return log; }).id;
    }
    return NextResponse.json({ data, pngs: pngs(data), jobId });
  } catch (e) { return fail(e); }
}
