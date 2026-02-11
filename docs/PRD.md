# 📋 포트폴리오 + 블로그 (Notion + GitHub Pages)

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | (입력) |
| **한 줄 설명** | Notion으로 관리하는 개발자 포트폴리오 + 블로그 |
| **기술 스택** | Next.js 15 + Notion API + Tailwind CSS |
| **배포** | GitHub Pages (정적 export) |
| **관리** | Notion 데이터베이스에서 직접 관리 |

---

## 기술 스택

```
Framework:      Next.js 15 (App Router, React 19, static export)
Language:       TypeScript (strict)
Styling:        Tailwind CSS v3 + CSS Variables
CMS:            Notion API (@notionhq/client)
Notion→HTML:    notion-to-md + remark/rehype 파이프라인
Comments:       Giscus (GitHub Discussions)
Search:         Fuse.js (클라이언트 fuzzy search)
Animation:      Framer Motion
Code Highlight: rehype-pretty-code + shiki
Build/Deploy:   GitHub Actions → GitHub Pages
```

### GitHub Pages 제약사항

| 불가능 | 대안 |
|--------|------|
| API Routes | 불필요 (정적 빌드) |
| 미들웨어 | 불필요 |
| ISR/SSR | 정적 생성 + GitHub Actions 재빌드 |
| Server Actions | 불필요 |
| next/image 최적화 | `unoptimized: true` 설정 |
| 동적 라우팅 (런타임) | `generateStaticParams`로 빌드 시 생성 |

---

## Notion 데이터베이스 설계

### 📝 Blog 데이터베이스

Notion에 아래 속성(Property)을 가진 데이터베이스를 생성합니다:

| 속성 이름 | 타입 | 용도 | 필수 |
|-----------|------|------|------|
| Title | Title | 포스트 제목 | ✅ |
| Slug | Rich Text | URL 슬러그 (예: `hello-world`) | ✅ |
| Description | Rich Text | 요약 설명 | ✅ |
| Tags | Multi-select | 태그/카테고리 | ✅ |
| Published | Checkbox | 공개 여부 (체크 = 공개) | ✅ |
| Date | Date | 작성일 | ✅ |
| UpdatedAt | Date | 수정일 | |
| Thumbnail | Files & media | 대표 이미지 | |
| Order | Number | 정렬 순서 (선택) | |

> **포스트 본문**은 Notion 페이지의 콘텐츠로 작성합니다.
> Notion의 모든 블록(h1~h3, 코드, 이미지, 콜아웃 등)을 지원합니다.

### 📄 About 데이터베이스 (또는 단일 페이지)

| 속성 이름 | 타입 | 용도 |
|-----------|------|------|
| Section | Select | intro / skills / experience |
| Content | 페이지 본문 | 각 섹션 내용 |
| Order | Number | 표시 순서 |

또는 단일 Notion 페이지로 About 전체를 관리할 수도 있습니다.

### 🔨 Projects 데이터베이스

| 속성 이름 | 타입 | 용도 |
|-----------|------|------|
| Name | Title | 프로젝트 이름 |
| Description | Rich Text | 한 줄 설명 |
| TechStack | Multi-select | 사용 기술 |
| GitHub | URL | 레포 링크 |
| Demo | URL | 데모 링크 |
| Thumbnail | Files & media | 썸네일 |
| Featured | Checkbox | 홈에 표시 여부 |
| Order | Number | 표시 순서 |

---

## Notion에서의 관리자 워크플로우

### 새 포스트 작성
1. Notion Blog DB에서 "New" 클릭
2. Title, Slug, Description, Tags, Date 입력
3. 페이지 본문에 마크다운처럼 글 작성
4. Published 체크
5. GitHub Actions 실행 (수동 또는 자동) → 사이트 반영

### 포스트 수정
1. Notion에서 해당 페이지 열어서 편집
2. GitHub Actions 재빌드 트리거

### 포스트 삭제/비공개
1. Published 체크 해제 (또는 페이지 삭제)
2. 재빌드 시 사이트에서 사라짐

### 카테고리/태그 관리
- Tags 속성의 Multi-select 옵션을 Notion에서 직접 추가/수정/삭제

### About 편집
- About 페이지/DB를 Notion에서 직접 수정

---

## 사이트맵

```
/                        → 홈 (히어로 + About + 프로젝트)
/blog                    → 블로그 목록 (검색 + 태그)
/blog/[slug]             → 포스트 상세 (렌더링 + 댓글)
/blog/tags/[tag]         → 태그별 목록
```

> 관리자 페이지 없음 — Notion이 관리자 UI

---

## 기능 명세

### 1. 🏠 홈 페이지 (`/`)

- **Hero**: 이름, 직함, 소개, CTA
- **About**: Notion About 페이지에서 빌드 시 fetch → 렌더링
- **Projects**: Notion Projects DB에서 Featured=true인 항목 → 카드
- **Contact**: 소셜 링크 (정적 데이터 또는 Notion)

### 2. 📝 블로그 목록 (`/blog`)

- Notion Blog DB에서 Published=true 포스트 → 최신순
- 카드: 제목, 날짜, 설명, 태그, 읽기시간
- 🔍 Fuse.js 검색 (빌드 시 검색 인덱스 JSON 생성)
- 🏷️ 태그 필터 (검색과 동시 적용)

### 3. 📄 블로그 상세 (`/blog/[slug]`)

- Notion 블록 → HTML 변환 (빌드 시)
- 코드 하이라이팅 (rehype-pretty-code)
- 커스텀 렌더링: callout, bookmark, toggle, table 등
- TOC (h2/h3 기반)
- Giscus 댓글
- 이전글/다음글

### 4. 🌙 다크모드

- `prefers-color-scheme` + 수동 토글 + localStorage
- 깜빡임 방지 (head inline script)
- Giscus 테마 연동

### 5. Notion 이미지 처리 ⚠️

Notion API의 이미지 URL은 **1시간 후 만료**됩니다.
빌드 스크립트에서 이미지를 다운로드하여 로컬에 저장합니다.

```
[빌드 시]
Notion 이미지 URL → 다운로드 → public/notion-images/[hash].jpg
HTML 내 src 교체 → /notion-images/[hash].jpg
```

---

## 프로젝트 파일 구조

```
jay_page/
├── CLAUDE.md
├── next.config.ts                # output: 'export', basePath 설정
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # ⭐ GitHub Actions (빌드 + 배포)
│
├── scripts/
│   └── fetch-notion.ts           # ⭐ Notion API → JSON + 이미지 다운로드
│
├── .notion-data/                  # ⭐ 빌드 시 생성 (gitignore)
│   ├── posts.json                # 포스트 메타 + 본문 HTML
│   ├── about.json                # About 데이터
│   ├── projects.json             # 프로젝트 데이터
│   └── search-index.json         # Fuse.js 검색 인덱스
│
├── public/
│   ├── notion-images/            # ⭐ 다운로드된 Notion 이미지 (gitignore)
│   ├── images/                   # 정적 이미지 (프로필 등)
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # 홈
│   │   ├── blog/
│   │   │   ├── page.tsx          # 목록
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # 상세
│   │   │   └── tags/
│   │   │       └── [tag]/
│   │   │           └── page.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── Contact.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── SearchBar.tsx     # Fuse.js
│   │   │   ├── TagFilter.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── Giscus.tsx
│   │   │   └── PostNavigation.tsx
│   │   ├── notion/               # ⭐ Notion 블록 렌더러
│   │   │   ├── NotionRenderer.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── Callout.tsx
│   │   │   ├── BookmarkBlock.tsx
│   │   │   └── ImageBlock.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── ThemeToggle.tsx
│   │
│   ├── lib/
│   │   ├── notion.ts             # ⭐ Notion 데이터 로더 (빌드 시 JSON 읽기)
│   │   ├── search.ts             # Fuse.js 설정
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── notion.ts             # Notion 블록/페이지 타입
│   │   └── index.ts
│   │
│   └── styles/
│       └── globals.css
│
└── docs/
    ├── PRD.md
    ├── DESIGN.md
    ├── PLAN.md
    └── NOTION-SETUP.md           # ⭐ Notion 데이터베이스 설정 가이드
```

---

## GitHub Actions 워크플로우

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'   # 6시간마다 자동 빌드 (Notion 변경 반영)
  workflow_dispatch:          # 수동 트리거 버튼

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Fetch Notion Data
        run: npx tsx scripts/fetch-notion.ts
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_BLOG_DB_ID: ${{ secrets.NOTION_BLOG_DB_ID }}
          NOTION_PROJECTS_DB_ID: ${{ secrets.NOTION_PROJECTS_DB_ID }}
          NOTION_ABOUT_PAGE_ID: ${{ secrets.NOTION_ABOUT_PAGE_ID }}

      - name: Build
        run: npm run build
        env:
          BASE_PATH: /${{ github.event.repository.name }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### 배포 트리거 3가지

| 트리거 | 언제 |
|--------|------|
| `push` | 코드 수정 후 push |
| `schedule` | 6시간마다 자동 (Notion 글 반영) |
| `workflow_dispatch` | GitHub Actions 탭에서 수동 "Run workflow" 클릭 |

> Notion에서 글을 작성 → GitHub Actions 탭에서 수동 빌드
> 또는 6시간 기다리면 자동 반영

---

## 빌드 스크립트 (`scripts/fetch-notion.ts`)

빌드 전에 실행되어 Notion 데이터를 로컬 JSON으로 변환합니다:

```
1. Notion Blog DB 쿼리 → Published=true 필터
2. 각 포스트의 블록(본문) 가져오기
3. notion-to-md로 마크다운 변환 → remark/rehype로 HTML 변환
4. 이미지 URL 다운로드 → public/notion-images/ 저장
5. HTML 내 이미지 src를 로컬 경로로 교체
6. posts.json, search-index.json 생성
7. Projects DB → projects.json
8. About 페이지 → about.json
```

---

## 환경변수

### 로컬 (`.env.local`)
```bash
NOTION_TOKEN=ntn_xxxxxxxxxxxx       # Notion Integration 토큰
NOTION_BLOG_DB_ID=xxxxxxxx          # Blog 데이터베이스 ID
NOTION_PROJECTS_DB_ID=xxxxxxxx      # Projects 데이터베이스 ID
NOTION_ABOUT_PAGE_ID=xxxxxxxx       # About 페이지 ID

# Giscus
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx

# GitHub Pages
BASE_PATH=/repo-name                # github.io/repo-name
NEXT_PUBLIC_SITE_URL=https://username.github.io/repo-name
```

### GitHub Secrets (Actions에서 사용)
```
NOTION_TOKEN
NOTION_BLOG_DB_ID
NOTION_PROJECTS_DB_ID
NOTION_ABOUT_PAGE_ID
```

---

## 구현 계획

### Phase 1: 프로젝트 셋업 (Day 1)
- [ ] Next.js 15 + TS + Tailwind
- [ ] `next.config.ts`: `output: 'export'`, `basePath`, `images: { unoptimized: true }`
- [ ] 다크모드 (next-themes)
- [ ] Header + Footer
- [ ] 폰트 설정

### Phase 2: Notion 연동 스크립트 (Day 2) ⭐
- [ ] Notion Integration 생성 + DB 공유
- [ ] `scripts/fetch-notion.ts` 작성
- [ ] 이미지 다운로드 로직
- [ ] posts.json, projects.json, about.json 생성
- [ ] search-index.json 생성

### Phase 3: 홈페이지 (Day 3)
- [ ] Hero + About (about.json에서 읽기)
- [ ] Projects (projects.json에서 읽기)
- [ ] Contact
- [ ] 반응형 + 애니메이션

### Phase 4: 블로그 (Day 4~5)
- [ ] 블로그 목록 (posts.json → PostCard)
- [ ] 블로그 상세 (HTML 렌더링)
- [ ] Notion 블록 커스텀 렌더러 (코드, 콜아웃 등)
- [ ] TOC + 이전/다음글
- [ ] `generateStaticParams`로 모든 슬러그 사전 생성

### Phase 5: 검색 + 태그 + 댓글 (Day 6)
- [ ] Fuse.js 검색 (search-index.json 로드)
- [ ] 태그 필터 + 태그별 페이지
- [ ] Giscus 댓글

### Phase 6: GitHub Actions + 배포 (Day 7)
- [ ] `.github/workflows/deploy.yml`
- [ ] GitHub Secrets 설정
- [ ] SEO: sitemap, robots.txt, OG 메타
- [ ] 배포 + 테스트

---

## 핵심 패키지

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@notionhq/client": "^2.x",
    "notion-to-md": "^3.x",
    "next-themes": "latest",
    "fuse.js": "^7.x",
    "framer-motion": "^11.x",
    "lucide-react": "latest",
    "rehype-pretty-code": "latest",
    "rehype-stringify": "latest",
    "remark-parse": "latest",
    "remark-rehype": "latest",
    "shiki": "latest",
    "unified": "latest"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "tsx": "latest",
    "@types/react": "^19.x",
    "eslint": "^9.x",
    "eslint-config-next": "latest"
  }
}
```

---

## MVP 제외 (향후)

| 기능 | 우선순위 | 비고 |
|------|----------|------|
| RSS 피드 | P2 | 빌드 시 생성 가능 |
| 방문자 통계 | P2 | Umami (별도 호스팅) |
| 다국어 | P3 | |
| Notion Webhook → 자동 빌드 | P2 | Make.com/Zapier 연동 |
| 포스트 시리즈 | P2 | Notion relation 속성 |