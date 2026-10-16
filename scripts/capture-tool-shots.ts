// npm run capture:shots -- [BASE_URL] [--measure-download | --export-examples | --verify-content]
import assert from 'node:assert/strict';
import { copyFileSync, readFileSync } from 'node:fs';
import { chromium, type Browser } from 'playwright';
import { shotSpecs } from './shot-specs.ts';

const args = process.argv.slice(2);
const BASE_URL = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3000';
const OUT_DIR = 'public/images/screenshots';
const MAX_W = 1200;

async function measureDownloads(browser: Browser) {
  const viewports = { desktop: { width: 1200, height: 900 }, mobile: { width: 390, height: 844 } };
  for (const [name, viewport] of Object.entries(viewports)) {
    for (const format of ['PNG', 'JPG']) {
      for (const scale of ['1× 표준', '2× 고화질']) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
        await page.locator(`#tool button:has-text("${format}")`).first().click();
        await page.locator(`#tool button:has-text("${scale}")`).click();
        const preview = await page.locator('[data-testid="thumb-preview"]').boundingBox();
        assert(preview);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          page.getByRole('button', { name: `${format} 썸네일 다운로드`, exact: true }).click(),
        ]);
        const filePath = await download.path();
        assert(filePath);
        const file = readFileSync(filePath);
        const mime = format === 'PNG' ? 'image/png' : 'image/jpeg';
        const size = await page.evaluate(async (dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const context = canvas.getContext('2d')!;
          context.drawImage(img, 0, 0, 32, 32);
          const pixels = context.getImageData(0, 0, 32, 32).data;
          const colors = new Set<string>();
          for (let i = 0; i < pixels.length; i += 4) colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
          return { width: img.naturalWidth, height: img.naturalHeight, colors: colors.size };
        }, `data:${mime};base64,${file.toString('base64')}`);
        const multiplier = scale.startsWith('1') ? 1 : 2;
        assert.equal(size.width, Math.round(preview.width) * multiplier);
        assert.equal(size.height, Math.round(preview.height) * multiplier);
        assert(size.colors > 8, 'Export appears blank');
        console.log(
          `${name} ${viewport.width}px  ${format} ${scale}  preview ${Math.round(preview.width)}x${Math.round(preview.height)}  ` +
            `file ${size.width}x${size.height}  ${file.length} bytes  ${size.colors} colors`,
        );
        await page.close();
      }
    }
  }
  const page = await browser.newPage({ viewport: viewports.desktop });
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
  const properties = ['width', 'height', 'aspect-ratio', 'box-shadow'];
  const before = await page.locator('[data-testid="thumb-preview"]').evaluate((element, names) =>
    names.map((name) => (element as HTMLElement).style.getPropertyValue(name)), properties);
  await page.evaluate(() => {
    window.html2canvas = async () => { throw new Error('Verification export failure'); };
  });
  const dialogPromise = page.waitForEvent('dialog');
  const clickPromise = page.getByRole('button', { name: 'PNG 썸네일 다운로드', exact: true }).click();
  const dialog = await dialogPromise;
  assert(dialog.message().includes('Verification export failure'));
  await dialog.dismiss();
  await clickPromise;
  await page.waitForFunction(() => !document.querySelector<HTMLButtonElement>('#tool button[aria-busy]')?.disabled);
  const after = await page.locator('[data-testid="thumb-preview"]').evaluate((element, names) =>
    names.map((name) => (element as HTMLElement).style.getPropertyValue(name)), properties);
  assert.deepEqual(after, before, 'Preview styles were not restored after a failed export');
  console.log('failed export: preview styles restored, download button enabled');
  await page.close();
}

async function verifyContent(browser: Browser) {
  for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    for (const slug of ['adsense-guide', 'blog-monetization-guide', 'naver-blog-thumbnail-size', 'how-to-make-blog-thumbnail', 'high-ctr-thumbnail', 'blog-title-formula-ctr', 'blog-real-experience']) {
      const response = await page.goto(`${BASE_URL}/blog/${slug}`, { waitUntil: 'networkidle' });
      assert.equal(response?.status(), 200);
      assert(await page.locator('article header time[datetime="2026-10-16"]').isVisible());
      if (slug !== 'blog-real-experience') assert(await page.locator('#article-sources').isVisible());
      await page.locator('article img').evaluateAll(async (images) => {
        await Promise.all(images.map((image) => {
          (image as HTMLImageElement).loading = 'eager';
          return (image as HTMLImageElement).decode();
        }));
      });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${slug}: page overflow`);
      if (slug === 'naver-blog-thumbnail-size') {
        assert.equal(await page.locator('article table tbody tr').count(), 2);
        await page.locator('article table').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `/private/tmp/blogkit-review-${viewport.width}.png` });
      }
      console.log(`content ${viewport.width}px /blog/${slug}: OK`);
    }
    await page.close();
  }
}

const browser = await chromium.launch();
try {
  if (args.includes('--measure-download')) await measureDownloads(browser);
  else if (args.includes('--verify-content')) await verifyContent(browser);
  else for (const spec of shotSpecs.filter((spec) => !args.includes('--export-examples') || ['thumb-custom-text', 'thumb-overlay-0', 'thumb-overlay-50'].includes(spec.id))) {
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
    if (args.includes('--export-examples')) {
      if (spec.id === 'thumb-custom-text') {
        assert.equal(await target.getByText('제목은', { exact: true }).evaluate((element) => getComputedStyle(element).fontWeight), '400');
      }
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'PNG 썸네일 다운로드', exact: true }).click(),
      ]);
      const filePath = await download.path();
      assert(filePath);
      const file = `${OUT_DIR}/tool-${spec.id}-export.png`;
      copyFileSync(filePath, file);
      console.log(file);
      await page.close();
      continue;
    }
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
