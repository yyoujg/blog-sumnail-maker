// 클립 영상 씬: scenes-data.json 편집. 미리보기는 브라우저 Player가 맡고, 여기선 저장·검증·영상 렌더(잡 큐)만.
// Root.tsx가 scripts/scenes-data.json을 정적 import하므로 저장할 때 스크래치에도 같이 쓴다.
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { ROOT, CLIP_DIR, REMOTION_DIR, SCENES_SCRATCH, SCRATCH, guard, fail, safeResolve, postResolve, exists, readJson, writeJson, run, toRel, isVideo } from '@/lib/local/server';
import { startJob } from '@/lib/local/jobs';

export const dynamic = 'force-dynamic';

type Scene = { type?: string; text?: string; imageUrl?: string | null; mediaType?: string; durationInFrames: number; [k: string]: unknown };
type ScenesData = { fps: number; width: number; height: number; businessName?: string; scenes: Scene[] };

const dataPathFor = (post: string) =>
  post === SCRATCH ? path.join(ROOT, SCENES_SCRATCH) : path.join(postResolve(post), '클립', 'scenes-data.json');

export async function GET(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const dataPath = dataPathFor(req.nextUrl.searchParams.get('post') || SCRATCH);
    if (!exists(dataPath)) return fail('scenes-data.json 없음: ' + toRel(dataPath), 404);
    const shorts = path.join(path.dirname(dataPath), 'shorts.mp4');
    return NextResponse.json({ dataPath: toRel(dataPath), data: readJson<ScenesData>(dataPath), video: exists(shorts) ? toRel(shorts) : null });
  } catch (e) { return fail(e); }
}

type Body = { post: string; dataPath: string; data: ScenesData; action?: 'save' | 'video' | 'validate'; pick?: { sceneIndex: number; insetIndex?: number; media: string } };

export async function POST(req: NextRequest) {
  const g = guard(req); if (g) return g;
  try {
    const { post, data, action = 'save', pick } = (await req.json()) as Body;
    const abs = dataPathFor(post); // 클라이언트 dataPath는 GET이 같은 post로 돌려준 값이라 무시하고 다시 계산
    if (pick) {
      const src = safeResolve(pick.media);
      const sub = isVideo(src) ? 'videos' : 'images';
      fs.copyFileSync(src, path.join(ROOT, REMOTION_DIR, 'public', sub, path.basename(src)));
      const scene = data.scenes[pick.sceneIndex];
      const url = `${sub}/${path.basename(src).normalize('NFC')}`;
      if (pick.insetIndex != null) { const insets = (scene.insets as { imageUrl: string }[] | undefined) ?? []; insets[pick.insetIndex] = { ...(insets[pick.insetIndex] || {}), imageUrl: url }; scene.insets = insets; }
      else { scene.imageUrl = url; if (isVideo(src)) scene.mediaType = 'video'; else delete scene.mediaType; }
    }
    if (exists(abs)) fs.copyFileSync(abs, abs + '.bak');
    writeJson(abs, data);
    // Root.tsx가 scripts/scenes-data.json을 정적 import하므로 영상 렌더 때만 스크래치를 덮어쓴다(저장·검증은 원본 파일만).
    if (action === 'video' && toRel(abs) !== SCENES_SCRATCH) writeJson(path.join(ROOT, SCENES_SCRATCH), data);
    let jobId: string | null = null, log = '';
    if (action === 'validate') {
      log = await run('node', ['scripts/validate-scenes.js', abs], path.join(ROOT, CLIP_DIR), 120000).catch((e: Error) => e.message);
    } else if (action === 'video') {
      const clipDir = path.dirname(abs);
      jobId = startJob('영상 렌더 (render + ffmpeg)', post, async () => {
        const out = path.join(ROOT, REMOTION_DIR, 'out');
        let l = await run('npm', ['run', 'render'], path.join(ROOT, CLIP_DIR));
        l += await run('ffmpeg', ['-y', '-i', 'preview.mp4', '-c:v', 'libx264', '-crf', '22', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'shorts.mp4'], out);
        if (toRel(abs) !== SCENES_SCRATCH) fs.copyFileSync(path.join(out, 'shorts.mp4'), path.join(clipDir, 'shorts.mp4'));
        return l;
      }).id;
    }
    return NextResponse.json({ data, jobId, log });
  } catch (e) { return fail(e); }
}
