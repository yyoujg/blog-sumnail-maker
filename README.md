# BlogKit (blog_sumnail_maker)

네이버 블로그 운영자를 위한 무료 썸네일·스킨 메이커 + SEO 가이드 블로그.

**서비스: https://www.blogsumnail.com**

## 왜 만들었나

`/about` 페이지에 명시된 동기: 네이버 블로그를 운영하면 포스팅마다 썸네일을 새로 만들어야 하는데, 포토샵·캔바는 기능이 과해서 오래 걸리고 스마트폰 앱은 화질이 아쉽다. 홈페이지형 블로그 스킨은 코딩 없이는 손대기 어렵고 보통 유료 서비스에 의존한다. 가입·설치 없이 브라우저에서 바로 끝내는 도구를 만들어, 글쓰기 시간을 디자인에 뺏기지 않게 하는 게 목표다.

콘텐츠 쪽은 검색 노출·제목·키워드·썸네일 문구·수익화 등 네이버 블로그 운영 가이드를 SSG로 발행하고, 같은 도메인에서 바로 실습할 수 있는 도구를 붙여둔 구조다(`components/HomeTool.tsx` 상단 인트로 문구 기준).

## 핵심 기능

### 썸네일 메이커 (`components/HomeTool.tsx` — 홈 `/`)
- 텍스트: 제목·서브타이틀·카테고리 태그, 정렬 3×3(`textAlign` × `textVAlign`), 오프셋 이동
- 배경: 단색 또는 이미지 업로드(`FileReader` → base64), 드래그로 위치 조절, 확대/축소, 90° 회전
- 프레임: `none / solid / double / corners / band` 5종, 오버레이 어둡게(%)
- 폰트 11종(`lib/constants.ts`의 `FONTS` — Black Han Sans, Jua, Pretendard, GmarketSans, 손글씨 계열 등)
- 스타일 프리셋 7종(아웃라인·감성·보더·골드·클래식·팝·미니멀) — 클릭 한 번으로 배경·폰트·프레임·텍스트 전부 교체
- 내보내기: `html2canvas`로 PNG/JPG, 1× 또는 2× 스케일

### 스킨메이커 (`components/SkinMakerTool.tsx` — `/skin-maker`)
- 1920×450 캔버스(가로/세로 직접 조절 가능), 배경 단색·이미지·오버레이·확대·회전
- 텍스트/이미지 요소를 캔버스에 자유 배치, 드래그 이동, 가로/세로 가운데 정렬
- **클릭형 링크 영역**: 캔버스에 드래그해서 사각형(width 186px 고정)을 그리면 네이버 위젯용 `<img usemap>` 이미지맵 코드를 자동 생성
  - 내 블로그 ID만 입력하면 `/api/naver-categories`를 통해 카테고리 목록을 불러와 내부링크를 자동 조립(blogId + categoryNo), 외부링크는 URL 직접 입력
  - **그리드 스냅**: 링크 5칸을 `WIDGET_W`(186px) × `WIDGET_GAP`(10px) 기준으로 캔버스 가운데에 정확히 재배치 — 배경에 그린 라벨 위치와 실제 클릭 영역을 일치시키기 위한 기능
  - 투명위젯 5개 + 버튼위젯 5개 코드를 개별/일괄로 복사·내보내기
- 4개 블로그 템플릿(맛집 리뷰·체험단·재테크·라이프스타일)
- `Ctrl/Cmd+Z` undo(최근 30단계), `localStorage` 자동저장/복원
- 내보내기: 스킨 PNG(캔버스 `<canvas>` 기반), 투명 위젯 PNG(186×최대 600px)

### 가이드 블로그 (`app/blog`, `data/blogPosts.ts`)
- `data/blogPosts.ts` 배열(현재 25개 글) 단일 소스에서 `generateStaticParams`로 정적 페이지 생성
- 글마다 목차, 관련글, Article/BreadcrumbList 구조화 데이터
- `/guide/blog-seo`, `/guide/thumbnail` 등 별도 가이드 페이지, `/skin-maker`에는 FAQPage 스키마

## 기술적으로 신경 쓴 부분

- **이미지 처리 없는 클라이언트 사이드 캔버스**: 썸네일은 `html2canvas`로 DOM을 캡처, 스킨은 `<canvas>` 2D 컨텍스트로 직접 그림. 둘 다 업로드 이미지가 서버로 전송되지 않고 브라우저 안에서만 처리된다(`/about` 명시).
- **미리보기-내보내기 좌표 일치**: `SkinMakerTool.tsx`의 배경 위치/스케일/회전 계산식이 CSS `background-position/size` 모델과 canvas `drawImage` 계산식에서 동일하게 재현되도록 맞춰져 있고, 라벨 위치는 `LABEL_Y_RATIO` 상수로 미리보기·export 공용 처리(코드 주석에 과거 불일치 버그 FIX 이력 존재).
- **고해상도 내보내기**: 스킨 PNG는 `exportScale = max(1, 3000 / cw)`로 캔버스를 확대해, 네이버가 스킨을 3000px로 늘려 표시해도 선명하게 유지(`downloadSkin` 함수).
- **네이버 이미지맵 버그 회피**: 버튼위젯의 `<map name="widget{n}">`을 위젯마다 고유하게 부여 — 동일 name을 재사용하면 브라우저가 첫 map만 인식해 2~5번째 위젯 클릭이 죽는 네이버 환경 특유의 버그를 코드 주석으로 남기고 회피.
- **네이버 카테고리 API 프록시**: 브라우저에서 네이버 API를 직접 호출하면 CORS로 막히므로 `/api/naver-categories`가 서버에서 대신 호출, `revalidate: 600`(10분 캐시)으로 네이버 IP 차단 위험을 완화(`route.ts` 주석).
- **이미지 최적화**: `next.config.ts`에서 `images.formats: ['image/avif', 'image/webp']` — 본문 사진 원본이 4032px라 전송량이 커서 AVIF 우선으로 webp 대비 20~30% 절감(코드 주석). `/images/:path*`에 `Cache-Control: public, max-age=31536000, immutable` 적용.
- **SEO/구조화 데이터**: `app/layout.tsx`에 WebSite/Blog/WebApplication×2/Organization JSON-LD, 블로그 글마다 Article+BreadcrumbList, `/skin-maker`에 FAQPage. `metadataBase`+`canonical`, OpenGraph/Twitter 메타, 동적 OG 이미지(`opengraph-image.tsx`), `sitemap.xml`/`robots.ts`.
- **리다이렉트 정리**: `next.config.ts`에 비-www → www 301, 통폐합된 구 블로그 슬러그 → 현재 슬러그 301 리다이렉트가 다수 등록되어 있음(콘텐츠 허브 통합 이력).
- **스크립트 지연 로딩**: `html2canvas`는 다운로드 기능이 있는 홈 페이지에서만 `afterInteractive`로 로드.

## 스택 (package.json 기준)

- Next.js 16.1.6 (App Router)
- React 19.2.3 / react-dom 19.2.3
- TypeScript 5
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- lucide-react 0.577.0 (아이콘)
- ESLint 9 (`eslint-config-next`)

의존성은 위 6개가 전부다 — 캔버스/이미지 처리는 라이브러리 없이 `html2canvas`(CDN 스크립트 태그)와 브라우저 `<canvas>` API로 직접 구현.

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

빌드/프로덕션:

```bash
npm run build
npm run start
```

검증:

```bash
npm run lint
npm run typecheck
```

## 프로젝트 구조

```
app/                 Next.js App Router
  page.tsx           홈(썸네일 메이커)
  layout.tsx          루트 레이아웃(AdSense, GA, 구조화 데이터)
  api/naver-categories/  네이버 블로그 카테고리 조회 프록시
  blog/               가이드 글 목록 및 [slug] 상세
  skin-maker/         스킨메이커 라우트
  guide/               별도 가이드 페이지(blog-seo, thumbnail)
  about/ contact/ privacy/ terms/
  sitemap.xml/ robots.ts opengraph-image.tsx
components/
  HomeTool.tsx        썸네일 메이커
  SkinMakerTool.tsx   스킨/위젯 에디터
  ControlPanel.tsx / ThumbnailPreview.tsx  썸네일 메이커 하위 컴포넌트
  AdBanner.tsx SiteHeader.tsx SiteFooter.tsx HomeSeoContent.tsx
data/blogPosts.ts     블로그 글 데이터(단일 소스, 25편)
lib/constants.ts       사이트 URL, AdSense/GA ID, 폰트 목록 등 상수
lib/types.ts           공용 타입
public/                정적 자산(폰트, 이미지, 위젯 PNG)
next.config.ts          이미지 포맷/캐시, 리다이렉트
vercel.json             Vercel 배포 설정(framework: nextjs)
ads.txt                 AdSense 인증
```

## 블로그 글 추가

`data/blogPosts.ts` 배열에 `BlogPost` 항목을 추가하면 빌드 시 정적 페이지가 자동 생성된다.

```ts
{
  slug: "my-post",          // URL: /blog/my-post
  title: "...",
  date: "2026-06-18",       // YYYY-MM-DD
  summary: "...",
  sections: [
    { heading: "...", content: "...", imageUrl: "...", imageCaption: "..." },
  ],
}
```

## TODO: 확인 필요

- 데모 스크린샷/GIF는 `public/images/tool/`에 캡처 이미지가 있으나 README에 직접 삽입할지는 미정
- Node.js 버전 요구사항은 `package.json`에 `engines` 필드가 없어 명시된 값 없음
