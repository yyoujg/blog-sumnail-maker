import { NextRequest, NextResponse } from 'next/server';
import { guard } from '@/lib/local/server';
import { getJob, listJobs } from '@/lib/local/jobs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const g = guard(req); if (g) return g;
  const id = req.nextUrl.searchParams.get('id');
  if (id) { const j = getJob(id); return j ? NextResponse.json(j) : new NextResponse('no job', { status: 404 }); }
  return NextResponse.json({ jobs: listJobs() });
}
