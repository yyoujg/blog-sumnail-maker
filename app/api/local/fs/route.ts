import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { guard, fail, safeResolve, listPosts, listMedia, listFinanceSlugs, describePost, reviewItems, calendarRows } from '@/lib/local/server';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.json': 'application/json', '.html': 'text/html; charset=utf-8',
};

export async function GET(req: NextRequest) {
  const g = guard(req); if (g) return g;
  const q = req.nextUrl.searchParams;
  try {
    const op = q.get('op');
    if (op === 'posts') return NextResponse.json({ posts: listPosts() });
    if (op === 'post') return NextResponse.json({ post: describePost(safeResolve(q.get('post') || '')) });
    if (op === 'review') return NextResponse.json({ items: reviewItems(listPosts()) });
    if (op === 'calendar') return NextResponse.json({ rows: calendarRows(), now: Date.now() });
    if (op === 'media') return NextResponse.json({ media: listMedia(q.get('post') || '') });
    if (op === 'finance') return NextResponse.json({ slugs: listFinanceSlugs() });
    const rel = q.get('path');
    if (!rel) return fail('path required');
    const abs = safeResolve(rel);
    const type = MIME[path.extname(abs).toLowerCase()];
    if (!type || !fs.existsSync(abs)) return new NextResponse('Not found', { status: 404 });
    // html(debug/ 스크랩 등)은 링크로 직접 열어도 스크립트가 못 돌게. allow-same-origin은 금융 미리보기 iframe의 contentDocument 접근용.
    const csp: Record<string, string> = type.startsWith('text/html') ? { 'Content-Security-Policy': 'sandbox allow-same-origin' } : {};
    return new NextResponse(fs.readFileSync(abs), { headers: { 'Content-Type': type, 'Cache-Control': 'no-store', ...csp } });
  } catch (e) { return fail(e); }
}
