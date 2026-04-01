# Project: BlogKit (blog_sumnail_maker)

## Stack
- Next.js 16 App Router (SSG) — TypeScript, Tailwind CSS
- Blog content: `data/blogPosts.ts` (single source of truth)
- Thumbnail tool: `app/page.tsx` + `components/SkinMakerTool.tsx`
- Shared header: `components/SiteHeader.tsx`
- Blog: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Ad slots: `components/AdBanner.tsx`

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
