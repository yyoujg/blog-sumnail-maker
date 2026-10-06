// Remotion staticFile() 에셋. 클라이언트가 window.remotion_staticBase='/api/local/public'으로 잡으면
// staticFile('images/x.jpg') -> /api/local/public/images/x.jpg -> clip-pipeline/remotion/public/images/x.jpg
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { REMOTION_DIR, guard, safeResolve } from '@/lib/local/server';

export const dynamic = 'force-dynamic';
const MIME: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.mov': 'video/quicktime' };

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const g = guard(req); if (g) return g;
  const { path: parts } = await ctx.params;
  try {
    const abs = safeResolve(path.join(REMOTION_DIR, 'public', ...parts.map(decodeURIComponent)));
    const type = MIME[path.extname(abs).toLowerCase()];
    if (!type || !fs.existsSync(abs)) return new NextResponse('Not found', { status: 404 });
    return new NextResponse(fs.readFileSync(abs), { headers: { 'Content-Type': type, 'Cache-Control': 'no-store' } });
  } catch { return new NextResponse('Bad path', { status: 400 }); }
}
