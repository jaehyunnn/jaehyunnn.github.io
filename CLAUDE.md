# Portfolio + Blog (Notion CMS + GitHub Pages)

## 프로젝트 개요
Notion으로 관리하는 개발자 포트폴리오 + 블로그.
빌드 시 Notion API에서 데이터를 가져와 정적 HTML로 생성, GitHub Pages에 배포.

## 기술 스택
- Framework: Next.js 15 (App Router, React 19, **static export**)
- Language: TypeScript (strict mode)
- CMS: Notion API (@notionhq/client) — 빌드 시 fetch
- Notion→MD: notion-to-md v4 (이미지 다운로드 포함)
- MD→HTML: unified + remark + rehype 파이프라인
- Styling: Tailwind CSS v3 + CSS Variables
- Theme: next-themes (다크모드)
- Search: Fuse.js (클라이언트 fuzzy search)
- Comments: Giscus (GitHub Discussions)
- Animation: Framer Motion
- Code: rehype-pretty-code + shiki
- Deploy: GitHub Actions → GitHub Pages

## 핵심 아키텍처
```
Notion DB ──(빌드 시)──→ scripts/fetch-notion.ts
                            ├→ .notion-data/*.json (포스트, 프로젝트, About)
                            └→ public/notion-images/* (다운로드된 이미지)
                                    ↓
                          next build (output: 'export')
                                    ↓
                              out/ → GitHub Pages
```
- IMPORTANT: 서버 기능 없음. API Routes, 미들웨어, ISR, Server Actions 사용 금지
- IMPORTANT: `output: 'export'` — 반드시 정적 export만 사용
- IMPORTANT: `images: { unoptimized: true }` — next/image 최적화 비활성

## 명령어
- `npm run fetch` — Notion 데이터 fetch (scripts/fetch-notion.ts)
- `npm run dev` — 개발 서버 (fetch 후)
- `npm run build` — fetch + next build (정적 export → out/)
- `npm run lint` — ESLint
- `npx tsc --noEmit` — 타입 검사

## 프로젝트 구조
- `scripts/fetch-notion.ts` — Notion API → JSON + 이미지 다운로드
- `.notion-data/` — 빌드 시 생성되는 JSON 데이터 (gitignore)
- `public/notion-images/` — 다운로드된 Notion 이미지 (gitignore)
- `src/app/` — App Router 페이지 (정적 생성만)
- `src/components/` — 컴포넌트 (layout, home, blog, notion, ui)
- `src/lib/notion.ts` — .notion-data JSON 로더
- `src/lib/search.ts` — Fuse.js 설정

## 콘텐츠 참조
- 요구사항: @docs/PRD.md
- 디자인: @docs/DESIGN.md
- 구현 계획: @docs/PLAN.md
- Notion 설정 가이드: @docs/NOTION-SETUP.md

## 코딩 컨벤션
- 컴포넌트: PascalCase.tsx, default export
- 유틸/라이브러리: kebab-case.ts
- 'use client' 최소한으로 (검색, 다크모드 토글, Giscus)
- 서버 컴포넌트 우선 (정적 빌드에서도 동작)
- Tailwind 클래스만, 인라인 스타일 금지
- 다크모드 `dark:` 항상 함께 정의

## Next.js 15 필수 규칙
- IMPORTANT: params, searchParams는 반드시 await
  ```tsx
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
  }
  ```
- IMPORTANT: next.config.ts (.ts 확장자)
- IMPORTANT: useFormState → useActionState (사용할 일 거의 없음, 정적이므로)

## GitHub Pages 필수 규칙
- IMPORTANT: 동적 라우트는 반드시 generateStaticParams 구현
- IMPORTANT: basePath 설정 필요 (레포명이 서브패스)
- IMPORTANT: public/.nojekyll 파일 필수 (_next 폴더 접근용)
- IMPORTANT: fetch는 빌드 시에만, 런타임 서버 fetch 불가
- IMPORTANT: trailingSlash: true 권장 (GitHub Pages 호환)

## 주의사항
- 이미지는 Notion에서 다운로드 → public/notion-images/에 저장 (URL 만료 문제)
- 모든 페이지에 generateMetadata 포함
- 환경변수 없이도 빌드 가능하도록 fallback 처리
- .notion-data/와 public/notion-images/는 .gitignore에 추가