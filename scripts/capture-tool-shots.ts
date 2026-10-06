// npm run dev 실행 중일 때: npm run capture:shots [BASE_URL] [--measure-download]
// --measure-download: 캡처 대신 썸네일 PNG를 1x/2x로 실제 다운로드해 픽셀 크기만 출력한다.
import { readFileSync } from 'node:fs';
import { chromium, type Browser } from 'playwright';
import { shotSpecs } from './shot-specs.ts';

const args = process.argv.slice(2);
const BASE_URL = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3000';
const OUT_DIR = 'public/images/screenshots';
const MAX_W = 1200;

async function measureDownloads(browser: Browser) {
  const viewports = { desktop: { width: 1200, height: 900 }, mobile: { width: 390, height: 844 } };
  for (const [name, viewport] of Object.entries(viewports)) {
    for (const scale of ['1× 표준', '2× 고화질']) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
      await page.locator(`#tool button:has-text("${scale}")`).click();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#tool button:has-text("PNG 다운로드")').click(),
      ]);
      const png = readFileSync(await download.path());
      const preview = await page.locator('[data-testid="thumb-preview"]').boundingBox();
      // PNG IHDR: 16~24바이트가 width/height (big-endian)
      console.log(
        `${name} ${viewport.width}px  ${scale}  preview ${Math.round(preview!.width)}x${Math.round(preview!.height)}  ` +
          `file ${png.readUInt32BE(16)}x${png.readUInt32BE(20)}  ${png.length} bytes`,
      );
      await page.close();
    }
  }
}

const browser = await chromium.launch();
try {
  if (args.includes('--measure-download')) await measureDownloads(browser);
  else for (const spec of shotSpecs) {
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
