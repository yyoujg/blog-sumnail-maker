// 로컬 편집기(/local) 서버 공통. BLOG_AUTO_ROOT가 없으면(배포본) 모든 라우트가 404.
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { NextResponse } from 'next/server';

export const ROOT = process.env.BLOG_AUTO_ROOT ? path.resolve(process.env.BLOG_AUTO_ROOT) : '';
export const CLIP_DIR = 'clip-pipeline';
export const REMOTION_DIR = 'clip-pipeline/remotion';
export const SCENES_SCRATCH = 'clip-pipeline/scripts/scenes-data.json';
export const CARDS_SCRATCH = 'clip-pipeline/scripts/post-cards-data.json';
export const SCRATCH = 'scratch'; // post 셀렉트의 "작업중" 항목

// localhost 접속만 허용(DNS rebinding 차단). 쓰기 요청은 같은 출처 + JSON만(다른 웹페이지의 form/no-cors POST 차단).
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
export const guard = (req: Request) => {
  if (!ROOT || !fs.existsSync(ROOT)) return new NextResponse('Not found', { status: 404 });
  const host = req.headers.get('host') || '';
  const write = req.method !== 'GET' && req.method !== 'HEAD';
  const ok = LOCAL_HOST.test(host) && (!write || (req.headers.get('origin') === `http://${host}` && (req.headers.get('content-type') || '').startsWith('application/json')));
  return ok ? null : new NextResponse('Forbidden', { status: 403 });
};
export const fail = (e: unknown, status = 400) =>
  NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status });

export function safeResolve(rel: string) {
  const abs = path.resolve(ROOT, rel.normalize('NFC'));
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) throw new Error('path outside root');
  return abs;
}
// 편집 대상 글 폴더는 posts/ 또는 발행완료/ 아래만.
export function postResolve(rel: string) {
  const abs = safeResolve(rel);
  if (!/^(posts|발행완료)\/[^/]/.test(toRel(abs).normalize('NFC'))) throw new Error('post outside posts/ or 발행완료/');
  return abs;
}
export const toRel = (abs: string) => path.relative(ROOT, abs);
export const exists = (abs: string) => fs.existsSync(abs);
export const readJson = <T = unknown>(abs: string): T => JSON.parse(fs.readFileSync(abs, 'utf8'));
export const writeJson = (abs: string, data: unknown) => {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(data, null, 2) + '\n');
};

export function run(cmd: string, args: string[], cwd: string, timeoutMs = 15 * 60 * 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { cwd, timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 }, (err, stdout, stderr) => {
      const out = `${stdout}\n${stderr}`.trim();
      if (err) reject(new Error(out.split('\n').slice(-40).join('\n') || err.message));
      else resolve(out);
    });
  });
}

const MEDIA_EXT = /\.(jpe?g|png|webp|gif|mp4|mov)$/i;
export const isVideo = (name: string) => /\.(mp4|mov)$/i.test(name);

// posts/<slug>/블로그/ 가 있으면 거기, 아니면 posts/<slug>/ (구 레이아웃). src/thumb.js와 같은 규칙.
export const blogDir = (postAbs: string) =>
  exists(path.join(postAbs, '블로그')) ? path.join(postAbs, '블로그') : postAbs;

export function listMedia(postRel: string) {
  const dir = path.join(blogDir(safeResolve(postRel)), 'media');
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && MEDIA_EXT.test(d.name) && !d.name.startsWith('.'))
    .map((d) => ({ name: d.name.normalize('NFC'), rel: toRel(path.join(dir, d.name)), video: isVideo(d.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type Stage = 'prep' | 'post' | 'thumb' | 'published' | 'scenes' | 'video' | 'cards' | 'upload';
export const STAGES: Stage[] = ['prep', 'post', 'thumb', 'published', 'scenes', 'video', 'cards', 'upload'];
export const STAGE_LABEL: Record<Stage, string> = { prep: '파일 준비', post: '원고', thumb: '썸네일', published: '발행', scenes: '씬', video: '영상', cards: '카드', upload: '업로드 준비' };
export type PostEntry = {
  name: string; rel: string; isDraft: boolean; group: string; hasMedia: boolean; hasCards: boolean; hasScenes: boolean;
  stages: Record<Stage, boolean>; next: Stage | null; mtime: number; thumb: string | null; date: string | null;
};

const mtimeOf = (abs: string) => { try { return fs.statSync(abs).mtimeMs; } catch { return 0; } };
const hasFiles = (dir: string, re: RegExp) => exists(dir) && fs.readdirSync(dir).some((f) => re.test(f.normalize('NFC')));

// 폴더 마커로 단계 판정(플랜 "화면 구조" 표). 발행글이면서 클립 폴더가 없는 블로그전용·기록만 글은 발행에서 끝.
export function describePost(abs: string): PostEntry {
  const postsAbs = path.join(ROOT, 'posts');
  const isDraft = abs.startsWith(postsAbs + path.sep);
  const group = isDraft ? 'posts' : path.basename(path.dirname(abs));
  const dir = blogDir(abs);
  const media = path.join(dir, 'media');
  const clip = path.join(abs, '클립');
  const thumbFile = exists(media) ? fs.readdirSync(media).find((f) => /-썸네일\.png$/.test(f.normalize('NFC'))) : undefined;
  const stages: Record<Stage, boolean> = {
    prep: exists(media),
    post: exists(path.join(dir, 'post.md')),
    thumb: !!thumbFile,
    published: !isDraft,
    scenes: exists(path.join(clip, 'scenes-data.json')),
    video: exists(path.join(clip, 'shorts.mp4')),
    cards: hasFiles(path.join(clip, '게시물'), /\.png$/),
    upload: exists(path.join(clip, 'upload-meta.json')),
  };
  const clipPlanned = isDraft || group === '클립포함' || exists(clip);
  const order = clipPlanned ? STAGES : STAGES.slice(0, 4);
  const name = path.basename(abs).normalize('NFC');
  const m = name.match(/^(\d{6})/);
  return {
    name, rel: toRel(abs).normalize('NFC'), isDraft, group,
    hasMedia: stages.prep, hasCards: exists(path.join(clip, '게시물', 'post-cards-data.json')), hasScenes: stages.scenes,
    stages, next: order.find((st) => !stages[st]) ?? null,
    mtime: Math.max(mtimeOf(path.join(dir, 'post.md')), mtimeOf(media), mtimeOf(clip), mtimeOf(abs)),
    thumb: thumbFile ? toRel(path.join(media, thumbFile)) : null,
    date: m ? `20${m[1].slice(0, 2)}-${m[1].slice(2, 4)}-${m[1].slice(4, 6)}` : null,
  };
}

export function listPosts(): PostEntry[] {
  const GROUPS = ['기록만', '블로그전용', '클립포함'];
  const subdirs = (abs: string) =>
    exists(abs)
      ? fs.readdirSync(abs, { withFileTypes: true })
          .filter((d) => d.isDirectory() && !/^[._]/.test(d.name) && !/tmp$/.test(d.name))
          .map((d) => path.join(abs, d.name))
      : [];
  const postsAbs = path.join(ROOT, 'posts');
  const drafts = subdirs(postsAbs).filter((p) => !GROUPS.includes(path.basename(p)));
  const grouped = [postsAbs, path.join(ROOT, '발행완료')].flatMap((base) => GROUPS.flatMap((g) => subdirs(path.join(base, g))));
  // 초안은 수정시각, 발행글은 폴더 날짜 접두어 기준(이동 시 mtime이 바뀌어 섞이지 않게).
  const key = (p: PostEntry) => (p.date ? Date.parse(p.date) + 86_399_000 : p.mtime);
  return [...drafts, ...grouped].map(describePost).sort((a, b) => key(b) - key(a));
}

export type ReviewItem = { post: string; section: 'cards' | 'scenes' | 'thumb'; item: string; message: string };
// 검수 필요: imageUrl 없는 카드 / JSON보다 오래된 카드 PNG / 자막 24자 초과 / 원고는 있는데 썸네일 없음
export function reviewItems(posts: PostEntry[]): ReviewItem[] {
  const out: ReviewItem[] = [];
  // 지금 손대는 글만: 초안 + 최근 30일 발행글. 오래된 발행글의 자막 길이까지 다 잡으면 200건씩 쌓여 의미가 없다.
  const recent = Date.now() - 30 * 86400000;
  for (const p of posts.filter((x) => x.isDraft || (x.date && Date.parse(x.date) > recent))) {
    const abs = safeResolve(p.rel);
    if (p.isDraft && p.stages.post && !p.stages.thumb) out.push({ post: p.rel, section: 'thumb', item: '썸네일', message: '원고는 있는데 썸네일이 없어요' });
    const cardsJson = path.join(abs, '클립', '게시물', 'post-cards-data.json');
    if (exists(cardsJson)) {
      try {
        // render-post-cards.js가 PNG 렌더 뒤에 JSON 사본을 복사하므로 mtime 비교는 못 쓴다 → PNG 유무만.
        const d = readJson<{ cards: { id: string; imageUrl: string | null }[] }>(cardsJson);
        for (const c of d.cards) {
          if (!c.imageUrl) out.push({ post: p.rel, section: 'cards', item: c.id, message: '사진이 비어 있어요' });
          else if (!exists(path.join(abs, '클립', '게시물', `${c.id}.png`))) out.push({ post: p.rel, section: 'cards', item: c.id, message: '아직 렌더 안 됨' });
        }
      } catch { /* 깨진 JSON은 작업대에서 보임 */ }
    }
    const scenesJson = path.join(abs, '클립', 'scenes-data.json');
    if (exists(scenesJson)) {
      try {
        const d = readJson<{ scenes: { type?: string; text?: string; imageUrl?: string | null }[] }>(scenesJson);
        d.scenes.forEach((sc, i) => {
          if ((sc.type ?? 'caption') === 'caption' && (sc.text || '').length > 24) out.push({ post: p.rel, section: 'scenes', item: `#${i + 1}`, message: `자막 ${sc.text!.length}자, 한 줄 넘칠 수 있음` });
          if (!sc.imageUrl && sc.type !== 'infoCard') out.push({ post: p.rel, section: 'scenes', item: `#${i + 1}`, message: '사진이 비어 있어요' });
        });
      } catch { /* same */ }
    }
  }
  return out;
}

// 조회수30만주제.md "## 5. 캘린더" 표만 읽는다. ponytail: 표 형식이 바뀌면 빈 배열.
export function calendarRows(): { period: string; finance: string; food: string; note: string }[] {
  const md = path.join(ROOT, 'posts', '_기획', '조회수30만주제.md');
  if (!exists(md)) return [];
  const sec = fs.readFileSync(md, 'utf8').split(/^## /m).find((s) => s.startsWith('5. 캘린더'));
  if (!sec) return [];
  return sec.split('\n').filter((l) => /^\|/.test(l)).slice(2)
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .filter((c) => c.length >= 4).map(([period, finance, food, note]) => ({ period, finance, food, note }));
}

export const listFinanceSlugs = () => {
  const dir = path.join(ROOT, 'thumb', 'copy');
  if (!exists(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5).normalize('NFC')).sort();
};
