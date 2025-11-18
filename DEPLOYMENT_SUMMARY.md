# 🎉 GitHub Pages 배포 준비 완료!

모바일 청첩장이 GitHub Pages 무료 배포를 위해 완벽하게 설정되었습니다.

## ✅ 완료된 작업

### 1. 프로젝트 설정
- ✅ Next.js 프로젝트 생성 및 구성
- ✅ 모든 컴포넌트 구현 완료
- ✅ TypeScript + Tailwind CSS 설정
- ✅ 프로젝트 위치: `/home/ibk/workspace/mobile_invitation`

### 2. GitHub Pages 배포 설정
- ✅ `next.config.ts` - Static Export 설정
- ✅ `.github/workflows/deploy.yml` - 자동 배포 워크플로우
- ✅ `public/.nojekyll` - GitHub Pages Jekyll 우회
- ✅ `basePath` 설정 - `/mobile_invitation`

### 3. Git 저장소
- ✅ Git 초기화 완료
- ✅ `.gitignore` 설정

### 4. 문서
- ✅ `README.md` - 프로젝트 소개
- ✅ `QUICK_START.md` - 5분 빠른 시작 가이드
- ✅ `GITHUB_PAGES_DEPLOY.md` - 상세 배포 가이드
- ✅ `SETUP_GUIDE.md` - 커스터마이징 가이드
- ✅ `PROJECT_STRUCTURE.md` - 프로젝트 구조 설명

---

## 🚀 다음 단계 (GitHub에 배포하기)

### Step 1: 청첩장 정보 입력
```bash
# app/page.tsx 파일을 열고 weddingData 객체 수정
nano app/page.tsx  # 또는 원하는 에디터 사용
```

### Step 2: GitHub 저장소 생성
1. https://github.com/new 접속
2. Repository name: `mobile_invitation`
3. Public 선택
4. Create repository

### Step 3: 코드 업로드
```bash
cd /home/ibk/workspace/mobile_invitation

# Git 설정 (최초 1회)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 커밋 및 푸시
git add .
git commit -m "Initial commit: 모바일 청첩장"
git remote add origin https://github.com/YOUR-USERNAME/mobile_invitation.git
git branch -M main
git push -u origin main
```

### Step 4: GitHub Pages 활성화
1. GitHub 저장소 → Settings → Pages
2. Source: **"GitHub Actions"** 선택
3. 2-5분 대기

### Step 5: 배포 완료!
**URL:** `https://YOUR-USERNAME.github.io/mobile_invitation/`

---

## 📁 프로젝트 구조

```
mobile_invitation/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 배포 설정
├── app/
│   ├── page.tsx               # 메인 페이지 (청첩장 데이터)
│   ├── layout.tsx             # 레이아웃 (메타데이터, 폰트)
│   └── globals.css            # 전역 스타일
├── components/
│   ├── BGMPlayer.tsx          # 배경음악 플레이어
│   └── sections/              # 섹션 컴포넌트
│       ├── HeroSection.tsx
│       ├── InvitationSection.tsx
│       ├── GallerySection.tsx
│       ├── WeddingInfoSection.tsx
│       ├── ContactSection.tsx
│       └── ShareSection.tsx
├── public/
│   ├── .nojekyll              # GitHub Pages 설정
│   ├── images/                # 이미지 파일 (추가 필요)
│   │   ├── hero-bg.jpg
│   │   ├── photo1-6.jpg
│   │   └── og-image.jpg
│   └── audio/                 # 배경음악 (추가 필요)
│       └── bgm.mp3
├── next.config.ts             # Next.js 설정 (Static Export)
├── package.json               # 의존성
├── QUICK_START.md            # 빠른 시작
├── GITHUB_PAGES_DEPLOY.md    # 배포 가이드
├── SETUP_GUIDE.md            # 설정 가이드
└── README.md                 # 프로젝트 소개
```

---

## ⚙️ 주요 설정 파일

### next.config.ts
```typescript
{
  output: 'export',  // 정적 사이트 생성
  basePath: '/mobile_invitation',  // GitHub Pages 경로
  images: { unoptimized: true }  // 이미지 최적화 비활성화
}
```

### .github/workflows/deploy.yml
- main 브랜치에 push 시 자동 배포
- Node.js 20 사용
- npm ci → build → deploy
- GitHub Pages에 자동 업로드

---

## 📝 배포 전 체크리스트

### 필수 작업
- [ ] `app/page.tsx`에서 신랑신부 이름 수정
- [ ] 결혼식 날짜/시간/장소 수정
- [ ] GitHub 저장소 생성
- [ ] 코드 푸시
- [ ] GitHub Pages 활성화

### 권장 작업
- [ ] `public/images/`에 사진 추가
- [ ] `public/audio/bgm.mp3` 배경음악 추가
- [ ] 카카오 API 키 설정 (선택)
- [ ] 로컬에서 빌드 테스트: `npm run build`

### 배포 후 확인
- [ ] URL 접속 확인
- [ ] 모바일에서 테스트
- [ ] 모든 섹션 정상 작동 확인
- [ ] 이미지 로딩 확인
- [ ] BGM 재생 확인

---

## 🔧 로컬 테스트

배포 전 로컬에서 테스트하세요:

```bash
# 개발 서버 (실시간 수정 반영)
npm run dev
# → http://localhost:3000

# 프로덕션 빌드 테스트
npm run build
# → out/ 폴더 생성 확인
```

---

## 🎨 커스터마이징

### 이미지 추가
```bash
# 1. 이미지를 public/images/ 복사
cp ~/photos/wedding.jpg public/images/hero-bg.jpg

# 2. Git 반영
git add public/images/
git commit -m "이미지 추가"
git push
```

### 정보 수정
```bash
# 1. app/page.tsx 수정
# 2. 반영
git add app/page.tsx
git commit -m "정보 업데이트"
git push
```

### 색상 변경
전체 프로젝트에서 `rose-` → 원하는 색상으로 일괄 변경

---

## 🆘 문제 해결

### 빌드 실패
```bash
# 로컬 테스트
npm run build

# 에러 수정 후
git add .
git commit -m "Fix build errors"
git push
```

### 404 에러
1. Settings → Pages → Source: "GitHub Actions" 확인
2. 10분 대기
3. Actions 탭에서 배포 성공 확인

### 권한 에러
Settings → Actions → General → "Read and write permissions"

---

## 📚 참고 문서

| 문서 | 용도 |
|------|------|
| [QUICK_START.md](QUICK_START.md) | 5분 안에 배포하기 |
| [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md) | 상세 배포 가이드 |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | 커스터마이징 방법 |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 프로젝트 구조 |
| [README.md](README.md) | 프로젝트 소개 |

---

## 💡 유용한 팁

### Personal Access Token 생성
GitHub 푸시 시 필요할 수 있습니다:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. `repo` 체크
5. 생성된 토큰을 비밀번호 대신 사용

### 배포 상태 확인
- GitHub Actions 탭에서 실시간 확인
- 성공: ✅ 초록색
- 실패: ❌ 빨간색
- 진행 중: 🟡 노란색

### 배포 속도
- 초기 배포: 3-10분
- 재배포: 2-5분
- 빌드 시간: 1-2분

---

## 🎊 배포 성공 시

배포가 완료되면:
1. URL을 카카오톡으로 공유
2. QR 코드 생성하여 인쇄물에 추가
3. SNS에 링크 게시

**완성된 청첩장 URL:**
```
https://YOUR-USERNAME.github.io/mobile_invitation/
```

---

## 📞 도움이 필요하신가요?

- **빠른 시작**: [QUICK_START.md](QUICK_START.md) 참조
- **상세 가이드**: [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md) 참조
- **GitHub Issues**: 문제 발생 시 이슈 등록

---

**모든 준비가 완료되었습니다! 🎉**

**다음 단계:** [QUICK_START.md](QUICK_START.md)를 열어 지금 바로 배포를 시작하세요!

즐거운 결혼 준비 되세요! 💒✨
