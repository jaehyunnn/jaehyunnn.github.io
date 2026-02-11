# 구현 계획 (Notion CMS + GitHub Pages)

> Claude Code에서 Phase별로 하나씩 요청하세요.
> 각 Phase 완료 후 git commit → /compact → 다음 Phase.

---

## Phase 1: 프로젝트 셋업

**목표: Next.js 15 정적 export + 다크모드 + 기본 레이아웃**

- [ ] `npx create-next-app@latest` (Next.js 15, App Router, TS, Tailwind, src/, ESLint)
- [ ] next.config.ts 설정:
  ```ts
  const nextConfig: NextConfig = {
    output: 'export',
    basePath: process.env.BASE_PATH || '',
    images: { unoptimized: true },
    trailingSlash: true,
  };
  ```
- [ ] `public/.nojekyll` 빈 파일 생성 (GitHub Pages 필수)
- [ ] tailwind.config.ts — 커스텀 색상(CSS 변수), `darkMode: 'class'`
- [ ] globals.css — 라이트/다크 CSS 변수 팔레트
- [ ] next-themes ThemeProvider (깜빡임 방지 포함)
- [ ] Header (네비 + 다크모드 토글) + Footer
- [ ] 폰트 설정 (Pretendard + 영문 디스플레이 + JetBrains Mono)
- [ ] .gitignore에 추가: `.notion-data/`, `public/notion-images/`, `out/`
- [ ] `git commit -m "chore: initial setup with Next.js 15 static export"`

**검증:** `npm run dev` → 헤더/푸터 렌더, 다크모드 토글, `npm run build` → `out/` 폴더 생성

---

## Phase 2: Notion 연동 스크립트 ⭐

**목표: Notion DB → 로컬 JSON + 이미지 다운로드**

**사전 준비:** @docs/NOTION-SETUP.md 따라 Notion Integration + DB 생성

- [ ] 패키지 설치: `@notionhq/client`, `notion-to-md`, `unified`, `remark-parse`, `remark-rehype`, `rehype-stringify`, `rehype-pretty-code`, `shiki`
- [ ] `scripts/fetch-notion.ts` 작성:
  - Notion Blog DB 쿼리 (Published=true, Date 내림차순)
  - 각 포스트 블록 → notion-to-md → 마크다운
  - 마크다운 → unified 파이프라인 → HTML (코드 하이라이팅 포함)
  - Notion 이미지 URL → 다운로드 → `public/notion-images/[hash].ext`
  - HTML 내 이미지 src를 로컬 경로로 교체
  - 읽기시간 계산 (한글: 500자/분)
  - 결과 → `.notion-data/posts.json`
  - TOC 추출 (h2/h3) → 각 포스트에 포함
- [ ] Projects DB → `.notion-data/projects.json`
- [ ] About 페이지 → `.notion-data/about.json`
- [ ] 검색 인덱스 → `.notion-data/search-index.json` (title, description, plainText)
- [ ] `src/lib/notion.ts` — JSON 파일 로더 (빌드 시 import)
  ```ts
  import postsData from '../../.notion-data/posts.json';
  export function getAllPosts() { ... }
  export function getPostBySlug(slug: string) { ... }
  export function getAllTags() { ... }
  ```
- [ ] package.json 스크립트:
  ```json
  "fetch": "tsx scripts/fetch-notion.ts",
  "prebuild": "npm run fetch",
  "dev": "npm run fetch && next dev --turbo"
  ```
- [ ] `git commit -m "feat: add Notion fetch script"`

**검증:**
```bash
# .env.local에 NOTION_TOKEN, NOTION_BLOG_DB_ID 설정 후
npm run fetch
# .notion-data/posts.json 생성 확인
# public/notion-images/ 이미지 다운로드 확인
```

---

## Phase 3: 홈페이지

**목표: 랜딩 페이지 (Notion 데이터 기반)**

- [ ] Hero 섹션 (정적 데이터: 이름, 직함, CTA)
- [ ] About 섹션 (`.notion-data/about.json`에서 읽기)
- [ ] Projects 섹션 (`.notion-data/projects.json` → Featured 필터 → ProjectCard)
- [ ] Contact 섹션 (소셜 링크)
- [ ] 반응형 (375px, 768px, 1280px)
- [ ] Framer Motion 진입 애니메이션
- [ ] `git commit -m "feat: add homepage"`

**검증:** 반응형 + 다크모드 가독성 + `npm run build` 성공

---

## Phase 4: 블로그 목록 + 상세

**목표: Notion 포스트 렌더링**

- [ ] `/blog/page.tsx` — 포스트 목록
  - `.notion-data/posts.json` 로드
  - PostCard 컴포넌트 (제목, 날짜, 설명, 태그, 읽기시간)
- [ ] `/blog/[slug]/page.tsx` — 포스트 상세
  - IMPORTANT: `params` → `await params` (Next.js 15)
  - `generateStaticParams` 필수 (정적 export)
  - HTML 본문 렌더 (`dangerouslySetInnerHTML` 또는 커스텀 렌더러)
  - 코드 블록 스타일링 + 복사 버튼
  - 커스텀 블록: Callout, Bookmark 등
  - generateMetadata (제목, 설명, OG)
- [ ] TOC 컴포넌트 (사이드바 또는 접이식)
- [ ] 이전글/다음글 네비게이션
- [ ] `/blog/tags/[tag]/page.tsx` + `generateStaticParams`
- [ ] `git commit -m "feat: add blog pages"`

**검증:**
```
npm run build 에러 없음
/blog → 포스트 목록 표시
/blog/hello-world → 포스트 렌더링 + 코드 하이라이팅
/blog/tags/nextjs → 태그 필터 동작
```

---

## Phase 5: 검색 + 댓글

**목표: 클라이언트 검색 + Giscus 댓글**

- [ ] SearchBar ('use client', Fuse.js, debounce 300ms)
  - `.notion-data/search-index.json` 로드
- [ ] TagFilter ('use client', 검색과 동시 적용)
- [ ] 빈 결과 UI
- [ ] Giscus 컴포넌트 ('use client', 다크모드 연동)
- [ ] `git commit -m "feat: add search and comments"`

**검증:** 검색 실시간 필터 + 태그 필터 + Giscus 댓글 로드 + 다크모드 테마 연동

---

## Phase 6: SEO + GitHub Actions 배포 ⭐

**목표: 프로덕션 배포**

- [ ] sitemap.ts (`export const dynamic = 'force-static'`)
- [ ] robots.ts
- [ ] 기본 OG 이미지 (public/og-default.png)
- [ ] 모든 페이지 generateMetadata 확인
- [ ] `.github/workflows/deploy.yml` 작성:
  ```yaml
  on:
    push: { branches: [main] }
    schedule: [{ cron: '0 */6 * * *' }]  # 6시간마다
    workflow_dispatch: {}                   # 수동 트리거
  # → Notion fetch → next build → deploy to GitHub Pages
  ```
- [ ] GitHub repo Settings → Pages → Source: GitHub Actions
- [ ] GitHub repo Secrets 설정:
  - `NOTION_TOKEN`
  - `NOTION_BLOG_DB_ID`
  - `NOTION_PROJECTS_DB_ID`
  - `NOTION_ABOUT_PAGE_ID`
- [ ] 배포 테스트
- [ ] (선택) 커스텀 도메인 연결
- [ ] `git tag v1.0.0`

**검증:**
```
GitHub Actions 성공
https://username.github.io/repo-name 접속
모든 페이지 + 이미지 정상 표시
Lighthouse 90+
```

---

## 배포 후 콘텐츠 관리 워크플로우

```
1. Notion에서 새 포스트 작성 (Published 체크)
2. GitHub → Actions 탭 → "Run workflow" 클릭
   또는 6시간 대기 (자동 빌드)
3. 빌드 완료 → 사이트에 반영
```

---

## Claude Code 실행 가이드

```bash
# 프로젝트 시작
cd my-portfolio
claude

# Phase별 진행
> docs/PRD.md와 docs/PLAN.md를 읽고 Phase 1 계획을 세워줘.
> (확인 후) Phase 1 실행해줘.
> git commit 하고 /compact.

# Notion 연동 테스트 (Phase 2)
> .env.local에 NOTION_TOKEN과 DB ID를 설정했어. Phase 2 진행해줘.
> npm run fetch 실행해서 데이터 확인해줘.

# 배포 (Phase 6)
> GitHub Actions 워크플로우 파일을 만들어줘.
> README에 환경변수 설정 방법 추가해줘.
```