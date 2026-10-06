// npm run dev 실행 중일 때: npm run capture:shots [BASE_URL]
import { chromium } from 'playwright';
import { shotSpecs } from './shot-specs.ts';

const BASE_URL = process.argv[2] ?? 'http://localhost:3000';
const OUT_DIR = 'public/images/screenshots';
const MAX_W = 1200;

const browser = await chromium.launch();
try {
  for (const spec of shotSpecs) {
    // 새 context = 빈 localStorage. SkinMaker가 이전 편집 상태를 복원하지 않고 기본 템플릿으로 뜬다.
    const page = await browser.newPage({ viewport: spec.viewport, deviceScaleFactor: 1 });
    await page.goto(BASE_URL + spec.path, { waitUntil: 'networkidle' });
    for (const a of spec.actions) {
      const el = page.locator(a.selector).first();
      if (a.type === 'click') await el.click();
      else if (a.type === 'fill') await el.fill(a.value);
      else await el.setInputFiles(a.file);
    }
    const target = page.locator(spec.selector).first();
    await target.scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      // 헤더(sticky)·플로팅 버튼·Next dev 배지가 캡처 영역을 덮지 않게 한다
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const pos = getComputedStyle(el).position;
        if (pos === 'sticky') el.style.position = 'static';
        if (pos === 'fixed') el.style.visibility = 'hidden';
      });
      document.querySelector<HTMLElement>('nextjs-portal')?.style.setProperty('display', 'none');
      (document.activeElement as HTMLElement | null)?.blur();
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((img) => img.decode().catch(() => undefined)),
      );
    });
    const box = await target.boundingBox();
    if (!box || box.width < 50 || box.height < 50) throw new Error(`${spec.id}: 캡처 영역이 비었음 (${spec.selector})`);
    if (box.width > MAX_W) throw new Error(`${spec.id}: 폭 ${Math.round(box.width)}px > ${MAX_W}px, viewport를 줄일 것`);
    const file = `${OUT_DIR}/tool-${spec.id}.png`;
    await target.screenshot({ path: file, animations: 'disabled' });
    console.log(`${file}  ${Math.round(box.width)}x${Math.round(box.height)}`);
    await page.close();
  }
} finally {
  await browser.close();
}
