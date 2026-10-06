// 블로그 썸네일: <post>/블로그/thumb.json 에 인자 저장 -> node src/thumb.js 실행 -> <slug>-썸네일.png
// GET ?preview=1&... : 같은 스크립트를 --html로 돌려 라이브 미리보기 HTML을 돌려준다(Playwright 없음, ~200ms).
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { ROOT, guard, fail, safeResolve, blogDir, exists, readJson, writeJson, run, toRel } from '@/lib/local/server';

export const dynamic = 'force-dynamic';

export type ThumbArgs = { preset: string; bg: string; main: string; sub: string; cat: string; filter: string; font: string; pos: string; crop: string; accent: string };
// accent 등은 thumb.js가 <style>에 그대로 넣는다 -> 링크로 직접 열어도 스크립트가 못 돌게 sandbox. 앱 iframe은 srcDoc라 영향 없음.
const HTML_HEADERS = { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': 'sandbox' };
const OPT = ['sub', 'cat', 'filter', 'preset', 'accent', 'font', 'pos', 'crop'] as const;

function paths(postRel: string) {
  const postAbs = safeResolve(postRel);
  const dir = blogDir(postAbs);
  const slug = path.basename(postAbs);
  if (!exists(path.join(dir, 'media'))) throw new Error('블로그/media 폴더가 없어요 (npm run prep 먼저)');
  // 발행완료 폴더는 날짜 접두어(260915뮤지컬점프)가 붙지만 파일은 뮤지컬점프-썸네일.png → 있는 파일을 우선, 없으면 접두어 뗀 이름.
  const out = fs.readdirSync(path.join(dir, 'media')).find((f) => /-썸네일\.png$/.test(f.normalize('NFC')))?.normalize('NFC') || `${slug.replace(/^\d{6}_?/, '')}-썸네일.png`;
  // src/thumb.js는 path.resolve('posts', slug)로 글을 찾는다 → 발행완료 글은 ../발행완료/... 로 넘긴다.
  return { slug: path.relative(path.join(ROOT, 'posts'), postAbs), json: path.join(dir, 'thumb.json'), png: path.join(dir, 'media', out), out, md: path.join(dir, 'post.md'), mediaDir: path.join(dir, 'media') };
}

// thumb.json이 없는 기존 글: post.md에서 추정한다. 썸네일 이미지의 alt = 제목 문구, 그 다음 이미지 = 배경 후보.
function guessArgs(md: string, postRel: string): Partial<ThumbArgs> | null {
  if (!exists(md)) return null;
  const imgs = [...fs.readFileSync(md, 'utf8').matchAll(/^!\[([^\]]*)\]\(([^)]+\.(?:jpe?g|png|webp))\)/gim)].map((m) => ({ alt: m[1], file: m[2] }));
  if (!imgs.length) return null;
  const thumb = imgs.find((i) => /썸네일/.test(i.file) || /썸네일$/.test(i.alt.trim()));
  const bg = imgs.find((i) => i !== thumb && !/썸네일/.test(i.file));
  return { main: (thumb?.alt || '').replace(/\s*썸네일\s*$/, '').trim(), bg: bg?.file || '', preset: /클립포함/.test(postRel) ? '카페' : '심플' };
}

const argv = (p: ReturnType<typeof paths>, a: ThumbArgs) => {
  const out = [path.join(ROOT, 'src', 'thumb.js'), p.slug, '--bg', a.bg, '--main', a.main, '--out', p.out];
  for (const k of OPT) if (a[k]) out.push(`--${k}`, a[k]);
  return out;
};

export async function GET(req: NextRequest) {
  const g = guard(req); if (g) return g;
  const q = req.nextUrl.searchParams;
  try {
    const post = q.get('post') || '';
    const p = paths(post);
    if (q.get('preview')) {
      const a = Object.fromEntries(['preset', 'bg', 'main', 'sub', 'cat', 'filter', 'font', 'pos', 'crop', 'accent'].map((k) => [k, q.get(k) || ''])) as ThumbArgs;
      if (!a.bg || !a.main) return new NextResponse('<p style="font:14px sans-serif;color:#999;padding:40px">배경 사진과 제목을 넣으면 미리보기가 떠요</p>', { headers: HTML_HEADERS });
      const bgUrl = `/api/local/fs?path=${encodeURIComponent(toRel(path.join(p.mediaDir, a.bg)))}`;
      const html = await run('node', [...argv(p, a), '--html', '--bg-url', bgUrl], ROOT, 20000);
      return new NextResponse(html, { headers: HTML_HEADERS });
    }
    const saved = exists(p.json);
    return NextResponse.json({ args: saved ? readJson<ThumbArgs>(p.json) : guessArgs(p.md, post), guessed: !saved, png: exists(p.png) ? toRel(p.png) : null, out: p.out });
  } catch (e) { return fail(e); }
}

export async function POST(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const body = (await req.json()) as { post: string; args?: ThumbArgs; dataUrl?: string };
    const p = paths(body.post);
    if (body.dataUrl) { // BlogKit(HomeTool)에서 만든 PNG를 글 폴더에 저장
      const m = body.dataUrl.match(/^data:image\/(png|jpeg);base64,(.+)$/);
      if (!m) throw new Error('bad dataUrl');
      fs.writeFileSync(p.png, Buffer.from(m[2], 'base64'));
      return NextResponse.json({ png: toRel(p.png) });
    }
    const a = body.args!;
    if (!a.bg || !a.main) throw new Error('배경 사진과 제목은 필수');
    writeJson(p.json, a);
    const log = await run('node', argv(p, a), ROOT);
    return NextResponse.json({ png: toRel(p.png), log });
  } catch (e) { return fail(e); }
}
