# Notion 데이터베이스 설정 가이드

> Phase 2 시작 전에 이 가이드를 따라 Notion을 설정하세요.

---

## 1단계: Notion Integration 생성

1. https://www.notion.so/profile/integrations 접속
2. **"+ New integration"** 클릭
3. 설정:
   - Name: `My Portfolio Blog` (자유)
   - Associated workspace: 본인 워크스페이스 선택
   - Capabilities: **Read content** 만 체크 (쓰기 불필요)
4. **Submit** → **Internal Integration Secret** 복사
5. `.env.local`에 저장:
   ```
   NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxx
   ```

---

## 2단계: Blog 데이터베이스 생성

Notion에서 새 페이지 → **"Database - Full page"** 선택

### 속성(Properties) 추가

| 속성 이름 | 타입 | 비고 |
|-----------|------|------|
| Title | Title | (기본) 포스트 제목 |
| Slug | Rich text | URL 슬러그 (예: `hello-world`) |
| Description | Rich text | 블로그 목록에 표시되는 요약 |
| Tags | Multi-select | 태그 (Next.js, React 등 미리 추가) |
| Published | Checkbox | ✅ 체크 = 공개 |
| Date | Date | 작성일 |
| UpdatedAt | Date | 수정일 (선택) |
| Thumbnail | Files & media | 대표 이미지 (선택) |

### 샘플 포스트 추가

1. 데이터베이스에 새 항목 추가
2. Title: `Hello World`
3. Slug: `hello-world`
4. Description: `첫 번째 블로그 포스트입니다.`
5. Tags: `Blog`
6. Published: ✅
7. Date: 오늘
8. 페이지 열어서 본문 작성:
   ```
   ## 소개
   안녕하세요! 이것은 첫 번째 테스트 포스트입니다.

   ## 코드 예시
   (코드 블록 추가)

   ## 마무리
   읽어주셔서 감사합니다.
   ```

### DB ID 확인

1. 브라우저에서 해당 데이터베이스 페이지 열기
2. URL 확인: `https://notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...`
3. `?v=` 앞의 32자리가 **Database ID**
4. `.env.local`에 저장:
   ```
   NOTION_BLOG_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Integration 연결

⚠️ **이 단계를 빼먹으면 API에서 데이터를 못 가져옵니다!**

1. 데이터베이스 페이지 우측 상단 `···` 메뉴 클릭
2. **"Connections"** → **"Connect to"** → 아까 만든 Integration 선택
3. **"Confirm"**

---

## 3단계: Projects 데이터베이스 생성

새 페이지 → Database 생성

| 속성 이름 | 타입 | 비고 |
|-----------|------|------|
| Name | Title | 프로젝트 이름 |
| Description | Rich text | 한 줄 설명 |
| TechStack | Multi-select | 사용 기술 |
| GitHub | URL | 레포 링크 |
| Demo | URL | 데모 링크 |
| Thumbnail | Files & media | 썸네일 |
| Featured | Checkbox | 홈에 표시 여부 |
| Order | Number | 표시 순서 |

- DB ID 확인 → `.env.local`에 `NOTION_PROJECTS_DB_ID=...`
- Integration 연결 (Connect to)

---

## 4단계: About 페이지 생성

새 Notion 페이지 생성 (데이터베이스가 아닌 일반 페이지)

본문에 작성:
```
## 소개
(자기소개 3~5문장)

## 기술 스택
### Expert
- React, TypeScript, Next.js

### Proficient
- Node.js, PostgreSQL

### Familiar
- Python, Docker

## 경력
### 회사명 (YYYY ~ 현재)
- 프론트엔드 개발자
- 주요 업무 ...
```

- Page ID 확인 (URL에서 32자리)
- `.env.local`에 `NOTION_ABOUT_PAGE_ID=...`
- Integration 연결

---

## 5단계: 환경변수 최종 확인

`.env.local` 파일:
```bash
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxx
NOTION_BLOG_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_PROJECTS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ABOUT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx

BASE_PATH=/repo-name
NEXT_PUBLIC_SITE_URL=https://username.github.io/repo-name
```

---

## 6단계: 연동 테스트

```bash
npm run fetch
```

성공하면:
```
✅ Fetched 3 posts
✅ Fetched 4 projects
✅ Fetched about page
✅ Downloaded 5 images
✅ Generated search index
```

에러가 나면:
- `Could not find database` → Integration 연결 확인 (3단계의 Connect to)
- `Unauthorized` → NOTION_TOKEN 확인
- `Could not find page` → Page ID 확인 + Integration 연결

---

## 포스트 관리 워크플로우

### 새 글 작성
1. Blog DB에 새 항목 추가
2. Slug, Description, Tags, Date 입력
3. 본문 작성
4. Published ✅ 체크
5. GitHub Actions 실행 (수동 또는 자동 6시간 간격)

### 글 수정
1. Notion에서 해당 페이지 수정
2. 재빌드 트리거

### 글 비공개/삭제
1. Published 체크 해제 (또는 페이지 삭제)
2. 재빌드 → 사이트에서 사라짐

### 태그 관리
- Tags 속성의 Multi-select 옵션을 Notion에서 직접 관리
- 옵션 추가/이름변경/삭제 가능

### About 수정
- About 페이지 직접 편집 → 재빌드

> 💡 **팁**: Notion에서 글 작성 후 바로 확인하고 싶으면
> GitHub → Actions → "Run workflow" 버튼으로 수동 빌드하세요.
