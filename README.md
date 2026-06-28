# BlogKit (blog_sumnail_maker)

네이버 블로그용 무료 썸네일/스킨 메이커 도구와 블로그 성장·SEO 가이드 콘텐츠를 함께 제공하는 Next.js 웹 서비스다.

- 썸네일 메이커: 브라우저에서 바로 네이버 블로그 썸네일과 투명 위젯을 제작하고 PNG/HTML로 내보낸다.
- 가이드 블로그: 블로그 키워드, 썸네일 전략, 수익화 등 성장 노하우를 정적 생성(SSG)으로 발행한다.

## 주요 기능

### 썸네일 / 스킨 메이커 (`components/SkinMakerTool.tsx`, `components/HomeTool.tsx`)
- 1920x450 캔버스 기반 편집
- 배경: 단색, 이미지 업로드, 오버레이 불투명도, 위치 조절
- 텍스트 레이어: 폰트(검은고딕, 주아, 도현, 프리텐다드 등), 크기, 색상, 굵기, 드래그 배치
- 이미지 요소: 업로드 후 드래그 이동, 모서리 리사이즈, 비율 유지
- 클릭형 링크 영역: 캔버스에 사각형을 그려 URL을 지정하고 네이버 블로그 위젯용 HTML(image map) 생성
- 프리셋 템플릿: 맛집 리뷰, 체험단, 재테크, 라이프스타일 등
- 내보내기: PNG 다운로드, 투명 위젯 슬라이스(170x450), 위젯 HTML 복사

### 가이드 블로그 (`app/blog`, `data/blogPosts.ts`)
- `data/blogPosts.ts` 단일 소스에서 모든 글을 정적 생성(`generateStaticParams`)
- 목차 자동 생성, 단계(원문자) 파싱, 이미지 캡션, 자동 링크
- Schema.org 메타데이터(Article, BreadcrumbList), OpenGraph / Twitter 카드
- 관련글, 이전/다음 내비게이션, 광고 슬롯

## 기술 스택
- Next.js 16.1.6 (App Router, SSG)
- React 19.2.3 / TypeScript 5
- Tailwind CSS 4
- lucide-react (아이콘)

## 시작하기

요구 사항: Node.js 20 이상 권장.

```bash
npm install
npm run dev      # 개발 서버, http://localhost:3000
```

빌드 및 프로덕션 실행:

```bash
npm run build
npm run start
```

## 프로젝트 구조

```
app/                 Next.js App Router
  page.tsx           홈(썸네일 메이커)
  layout.tsx         루트 레이아웃 (AdSense, Analytics, 구조화 데이터)
  blog/              블로그 목록 및 [slug] 상세
  skin-maker/        스킨 메이커 라우트
  guide/             가이드 페이지
  about/ contact/ privacy/ terms/
  sitemap.xml/ robots.ts opengraph-image.tsx
components/           UI 컴포넌트
  SkinMakerTool.tsx  스킨/위젯 에디터
  HomeTool.tsx       썸네일 메이커
  AdBanner.tsx SiteHeader.tsx SiteFooter.tsx ...
data/blogPosts.ts    블로그 글 데이터 (단일 소스)
lib/constants.ts     사이트 URL, AdSense/Analytics ID, 폰트 등 상수
lib/types.ts         타입 정의
public/              정적 자산(이미지 등)
next.config.ts       이미지 캐시 헤더, 리다이렉트, 슬러그 마이그레이션
vercel.json          Vercel 배포 설정
ads.txt              AdSense 인증
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

## 배포 및 설정
- 배포: Vercel (`vercel.json`)
- 사이트 URL, AdSense 클라이언트 ID, Google Analytics(Tag) ID 등은 `lib/constants.ts`에서 관리
- 이미지 캐시 헤더, 도메인/슬러그 리다이렉트는 `next.config.ts`에서 설정
- 광고/제휴: Google AdSense, 쿠팡 파트너스
