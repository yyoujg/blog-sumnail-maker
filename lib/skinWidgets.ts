// 네이버 위젯 한 칸의 제한. 스킨 배경 크기와는 별개다.
export const WIDGET_WIDTH = 170;
export const WIDGET_MAX_HEIGHT = 600;

interface WidgetLink {
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  label?: string;
  newWindow?: boolean;
  categoryNo?: string;
  categoryUrl?: string;
}

export function categoryUrl(blogId: string, categoryNo: string): string {
  return `https://blog.naver.com/PostList.naver?blogId=${encodeURIComponent(blogId.trim() || 'MY_BLOG_ID')}&categoryNo=${encodeURIComponent(categoryNo.trim() || '0')}`;
}

// 카테고리에서 복사한 네이버 PC·모바일 주소만 해석한다.
export function parseCategoryUrl(value: string): { blogId: string; categoryNo: string } | null {
  try {
    const url = new URL(value.trim().replace(/&amp;/g, '&'));
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.hostname !== 'blog.naver.com' && url.hostname !== 'm.blog.naver.com') return null;
    const categoryNo = url.searchParams.get('categoryNo');
    const path = url.pathname.split('/').filter(Boolean);
    const blogId = url.searchParams.get('blogId') || (path.length === 1 && !path[0].includes('.') ? path[0] : '');
    if (!blogId || !/^[A-Za-z0-9_-]+$/.test(blogId) || !categoryNo || !/^\d+$/.test(categoryNo)) return null;
    return { blogId, categoryNo };
  } catch {
    return null;
  }
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function linkHref(link: WidgetLink, blogId: string): string {
  if (link.newWindow) {
    const url = link.url.trim();
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return url;
    } catch { /* 미입력 주소는 교체할 자리로 표시 */ }
  } else {
    if (link.categoryUrl?.trim()) {
      const parsed = parseCategoryUrl(link.categoryUrl);
      return parsed ? categoryUrl(parsed.blogId, parsed.categoryNo) : '여기에 올바른 카테고리 주소 붙여넣기';
    }
    if (link.categoryNo?.trim()) return categoryUrl(blogId, link.categoryNo);
  }
  return '여기에 이동할 링크 주소 붙여넣기';
}

function tableCode(height: number): string {
  return `<table width="170" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td width="170" height="${height}"></td></tr></tbody></table>`;
}

// 메뉴 그림은 스킨에 포함된다. 위젯은 위쪽 공백과 투명한 클릭 영역만 만든다.
export function buildWidgets(rects: WidgetLink[], blogId: string) {
  const sorted = [...rects].sort((a, b) => a.x - b.x);
  const widgets: { label: string; code: string }[] = [];
  const rows = Math.ceil(Math.max(0, ...sorted.map((r) => r.y)) / WIDGET_MAX_HEIGHT);
  for (let row = 0; row < rows; row++) {
    sorted.forEach((r, i) => {
      const height = Math.max(0, Math.min(WIDGET_MAX_HEIGHT, Math.round(r.y) - row * WIDGET_MAX_HEIGHT));
      if (height > 0) widgets.push({
        label: `공백 위젯 ${i + 1}${rows > 1 ? ` (${row + 1}행)` : ''}`,
        code: tableCode(height),
      });
    });
  }
  sorted.forEach((r, i) => {
    const height = Math.max(5, Math.min(WIDGET_MAX_HEIGHT, Math.round(r.h)));
    const target = r.newWindow ? '_blank' : '_top';
    widgets.push({
      label: `메뉴 위젯 ${i + 1}${r.label ? ` · ${r.label}` : ''}`,
      code: `<a href="${escapeHtml(linkHref(r, blogId))}" target="${target}"${r.newWindow ? ' rel="noopener noreferrer"' : ''} aria-label="${escapeHtml(r.label || `메뉴 ${i + 1}`)}">${tableCode(height)}</a>`,
    });
  });
  return widgets;
}
