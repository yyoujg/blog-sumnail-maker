# Project: BlogKit (blog_sumnail_maker)

## Stack
- Next.js 16 App Router (SSG) — TypeScript, Tailwind CSS
- Blog content: `data/blogPosts.ts` (single source of truth)
- Thumbnail tool: `app/page.tsx` + `components/HomeTool.tsx`
- Skin/widget tool: `components/SkinMakerTool.tsx`
- Shared header: `components/SiteHeader.tsx`
- Blog: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Ad slots: `components/AdBanner.tsx`
- Redirects / image config: `next.config.ts`
- Site URL, AdSense/GA IDs, fonts: `lib/constants.ts`

### Naver constraints (do not change without reason)
- Content area 966px · skin canvas 1920x450
- Transparent widget 170px x 5 columns, gap 10px, max height 600px
- Constants: `WIDGET_W`, `WIDGET_GAP`, `GRID_COUNT`

## Approach
- Read existing files before writing code.
- Prefer Edit over Write (diffs only, not full rewrites).
- Do not re-read a file already read in this session unless it may have changed.
- Keep solutions simple. No over-engineering.
- No sycophantic openers or closing summaries.
- Do not suggest unrequested changes (refactors, comments, extra features).
- If unsure about a file path or value: say so, never guess.
- User instructions always override this file.

## Efficiency
- One focused pass. Avoid write-delete-rewrite cycles.
- No redundant tool calls. Read each file once.
- Budget: 40 tool calls maximum per task.

## Commit style
- Korean subject line, imperative mood
- No `Co-Authored-By` tag — ever
- **Never `git commit -am`.** Always name files: `git add <files> && git commit -m "..."`
- Show the diff and wait for approval before committing
- One concern per commit (don't mix a logic fix with line-ending normalization)
- Author email is repo-local: `88040809+yyoujg@users.noreply.github.com`
  (a real address gets rejected by GitHub as GH007)
- `core.autocrlf` must be `input` — `true` on macOS makes whole files show as diffs
- `package-lock.json`: commit only when it genuinely syncs with `package.json`
  (e.g. the `name` field). Revert reordering noise from `npm install`.

## Verification
Run in order and report results.

1. `npm run build` passes
2. Target files actually exist (path and filename)
3. For behavior changes: a repro scenario plus edge cases (empty state, over-limit values)
4. After deploy: production check below

### Deploy check — always first
```bash
curl -sI https://www.blogsumnail.com/skin-maker | grep -i "^age"
```
A six-figure `age` means **the deploy never landed** (push missing or Vercel build failed).
Verifying content before this check verifies the old build.

### curl pitfalls
| Pitfall | Symptom | Correct approach |
|---|---|---|
| `grep -c` | Always 1 on minified HTML | `grep -o ... \| sort -u \| wc -l` |
| No `Accept` header | Falls back to source JPEG, inflates size | `-H "Accept: image/avif,image/webp,*/*"` |
| `w=3840` in `srcset` | Misread as served resolution | Check the `sizes` attribute |
| Client components | Strings absent from HTML body | Search `/_next/static/chunks/*.js` |
| Next 16 `quality` | Undeclared values return an 84-byte error | Use values listed in `images.qualities` |

## Images
- **ASCII filenames only.** Korean names break locally (macOS NFD vs NFC);
  `+` and spaces break in URLs.
- Location: `public/images/`. Tool screenshots: `public/images/tool/`.
- Verify a 200 on the production URL after placement.
- Captions must explain how the image supports that section's claim — not describe the screen.
  - Bad: "BlogKit 편집 화면입니다"
  - Good: "제목 줄바꿈과 서브카피 위치를 바꿔가며 결과를 바로 확인할 수 있습니다"
- Do not touch the existing 73 image placements or captions unless asked.

## Content rules (AdSense review in progress)
Rejected twice for "low value content". Violating these makes resubmission pointless.

- **Do not add more posts.** 82 posts triggered the rejection; consolidated to 24 hubs.
- **No unverifiable experience claims or metrics.** A fake blogger persona was removed once already.
- **Never write as if approved.** The site is pending review.
- No filler photos. Tool screenshots and GSC captures are the only real differentiator.
- Sponsored/체험단 photos may carry secondary-use limits — flag before using on ad pages.
