import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const blogId = req.nextUrl.searchParams.get('blogId')?.trim();
  if (!blogId || !/^[a-z0-9_-]+$/i.test(blogId))
    return NextResponse.json({ error: 'invalid blogId' }, { status: 400 });

  try {
    const res = await fetch(
      `https://m.blog.naver.com/api/blogs/${blogId}/category-list`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://m.blog.naver.com' },
        next: { revalidate: 600 }, // 10분 캐시 - 네이버 IP 차단 위험 완화
      }
    );
    const data = await res.json();
    const list = data?.result?.mylogCategoryList ?? [];
    const categories = list
      .filter((c: any) => c.openYN && !c.categoryBlocked && c.categoryNo != null)
      .map((c: any) => ({
        no: String(c.categoryNo),
        name: String(c.categoryName ?? '').trim() || `카테고리 ${c.categoryNo}`,
        postCnt: c.postCnt ?? 0,
      }));
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
  }
}
