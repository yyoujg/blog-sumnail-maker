// 금융 썸네일: thumb/copy/<slug>.json 편집 -> node thumb/render-thumb.mjs <slug> -> thumb/out/ 3장
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { ROOT, guard, fail, exists, readJson, writeJson, run } from '@/lib/local/server';

export const dynamic = 'force-dynamic';

const NAMES = ['01_키워드형', '02_후킹형', '03_질문형'];
const copyPath = (slug: string) => {
  if (!/^[^/\\]+$/.test(slug)) throw new Error('bad slug');
  return path.join(ROOT, 'thumb', 'copy', `${slug.normalize('NFC')}.json`);
};
const outs = (slug: string) =>
  NAMES.map((n) => `thumb/out/thumb_${slug}_${n}.png`).filter((rel) => exists(path.join(ROOT, rel)));

export async function GET(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const slug = req.nextUrl.searchParams.get('slug') || '';
    const p = copyPath(slug);
    return NextResponse.json({ copy: exists(p) ? readJson(p) : null, outs: outs(slug) });
  } catch (e) { return fail(e); }
}

export async function POST(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const { slug, copy } = (await req.json()) as { slug: string; copy: unknown };
    writeJson(copyPath(slug), copy);
    const log = await run('node', [path.join(ROOT, 'thumb', 'render-thumb.mjs'), slug], ROOT);
    return NextResponse.json({ outs: outs(slug), log });
  } catch (e) { return fail(e); }
}
