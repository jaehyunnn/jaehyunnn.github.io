# 🚀 GitHub Pages 무료 배포 가이드

이 문서는 모바일 청첩장을 GitHub Pages를 이용해 무료로 배포하는 방법을 설명합니다.

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [GitHub 저장소 생성](#2-github-저장소-생성)
3. [코드 업로드](#3-코드-업로드)
4. [GitHub Pages 활성화](#4-github-pages-활성화)
5. [자동 배포 확인](#5-자동-배포-확인)
6. [배포 완료 및 확인](#6-배포-완료-및-확인)
7. [문제 해결](#7-문제-해결)

---

## 1. 사전 준비

### 1.1 GitHub 계정 생성
- [GitHub](https://github.com)에서 무료 계정 생성
- 이메일 인증 완료

### 1.2 Git 설치 확인
```bash
git --version
```

만약 설치되지 않았다면:
- Windows: [Git 다운로드](https://git-scm.com/download/win)
- Mac: `brew install git`
- Linux: `sudo apt-get install git`

### 1.3 청첩장 정보 입력
배포 전에 반드시 `app/page.tsx`의 `weddingData` 객체를 수정하세요!

---

## 2. GitHub 저장소 생성

### 2.1 새 저장소 생성

1. GitHub에 로그인
2. 우측 상단 `+` 버튼 → "New repository" 클릭
3. 저장소 정보 입력:
   ```
   Repository name: mobile_invitation
   Description: 모바일 청첩장 (선택사항)
   Public 선택 (Private도 가능하지만 GitHub Pages는 Public 권장)
   ✅ Add a README file 체크 해제 (이미 있음)
   ```
4. "Create repository" 클릭

### 2.2 저장소 URL 복사
생성 후 표시되는 URL을 복사하세요:
```
https://github.com/your-username/mobile_invitation.git
```

---

## 3. 코드 업로드

### 3.1 Git 초기 설정 (최초 1회만)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3.2 로컬 저장소에서 GitHub로 푸시

프로젝트 디렉토리에서 다음 명령어를 실행하세요:

```bash
# 프로젝트 디렉토리로 이동
cd /home/ibk/workspace/mobile_invitation

# Git 저장소 확인 (이미 초기화되어 있음)
git status

# 모든 파일 추가
git add .

# 커밋 생성
git commit -m "Initial commit: 모바일 청첩장 프로젝트"

# 원격 저장소 연결 (your-username을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/mobile_invitation.git

# 기본 브랜치 이름 확인 및 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 3.3 GitHub 인증

푸시 시 GitHub 로그인이 요구될 수 있습니다:
- **Personal Access Token** 사용 권장
- Settings → Developer settings → Personal access tokens → Generate new token
- 권한: `repo` 체크
- 생성된 토큰을 비밀번호 대신 입력

---

## 4. GitHub Pages 활성화

### 4.1 저장소 설정

1. GitHub 저장소 페이지로 이동
2. 상단 메뉴에서 **Settings** 클릭
3. 왼쪽 사이드바에서 **Pages** 클릭

### 4.2 Source 설정

**Source** 섹션에서:
```
Source: GitHub Actions 선택
```

> **중요**: "Deploy from a branch"가 아닌 **"GitHub Actions"**를 선택해야 합니다!

### 4.3 저장

설정이 자동으로 저장됩니다.

---

## 5. 자동 배포 확인

### 5.1 Actions 탭 확인

1. 저장소 상단 메뉴에서 **Actions** 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우가 실행 중인지 확인
3. 초록색 체크 표시가 나타날 때까지 대기 (약 2-5분)

### 5.2 배포 진행 상황

- 🟡 노란색 원: 빌드 진행 중
- ✅ 초록색 체크: 배포 성공
- ❌ 빨간색 X: 배포 실패 (아래 문제 해결 참조)

---

## 6. 배포 완료 및 확인

### 6.1 배포된 사이트 URL

배포가 완료되면 다음 URL로 접속 가능:
```
https://your-username.github.io/mobile_invitation/
```

예시:
- GitHub 사용자명이 `johndoe`라면
- URL: `https://johndoe.github.io/mobile_invitation/`

### 6.2 URL 확인 방법

1. **Settings** → **Pages**로 이동
2. 상단에 "Your site is live at ..." 메시지 확인
3. URL 클릭하여 청첩장 확인

### 6.3 모바일에서 테스트

- 스마트폰 브라우저로 URL 접속
- 모든 기능 정상 작동 확인
- 이미지 로딩 확인
- BGM 재생 확인 (첫 터치 후 재생)

---

## 7. 문제 해결

### 7.1 배포 실패 (빨간색 X)

**Actions 탭에서 에러 로그 확인:**

1. Actions 탭 → 실패한 워크플로우 클릭
2. 빨간색 X 표시된 단계 클릭
3. 에러 메시지 확인

**일반적인 해결 방법:**

#### 빌드 에러
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 수정 후 다시 푸시
git add .
git commit -m "Fix build errors"
git push
```

#### 권한 에러
1. Settings → Actions → General
2. "Workflow permissions" → "Read and write permissions" 선택
3. Save

### 7.2 페이지가 404 에러

**원인 1: basePath 설정 확인**
- `next.config.ts`의 `basePath`가 저장소 이름과 일치하는지 확인
- 저장소 이름: `mobile_invitation`
- basePath: `/mobile_invitation`

**원인 2: GitHub Pages 설정 확인**
- Settings → Pages → Source가 "GitHub Actions"인지 확인

**원인 3: 배포 대기 시간**
- 첫 배포는 최대 10분 소요 가능
- 잠시 기다린 후 다시 시도

### 7.3 이미지가 표시되지 않음

**확인 사항:**
1. `public/images/` 폴더에 이미지 파일 존재 확인
2. 파일명 대소문자 확인 (photo1.jpg vs Photo1.jpg)
3. 이미지 경로 확인: `/images/photo1.jpg`

**Next.js Image 컴포넌트 에러:**
- `next.config.ts`에 `images: { unoptimized: true }` 설정 확인

### 7.4 카카오톡 공유/지도가 작동하지 않음

**카카오 API 설정:**
1. [Kakao Developers](https://developers.kakao.com/) 로그인
2. 내 애플리케이션 → 앱 선택
3. 플랫폼 → Web 플랫폼 추가
4. 사이트 도메인 등록:
   ```
   https://your-username.github.io
   ```
5. JavaScript 키 복사
6. 코드에 키 적용:
   - `components/sections/ShareSection.tsx`
   - `components/sections/WeddingInfoSection.tsx`

### 7.5 스타일이 깨짐

**캐시 문제:**
```bash
# 브라우저 강력 새로고침
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**빌드 재시도:**
```bash
# .next 폴더 삭제 후 재빌드
rm -rf .next
npm run build
git add .
git commit -m "Rebuild"
git push
```

---

## 🔄 업데이트 배포하기

청첩장 내용을 수정한 후 재배포:

```bash
# 1. 수정 사항 확인
git status

# 2. 변경사항 추가
git add .

# 3. 커밋
git commit -m "청첩장 정보 업데이트"

# 4. 푸시 (자동으로 재배포됨)
git push
```

푸시 후 약 2-5분 뒤 변경사항이 반영됩니다.

---

## 📱 도메인 연결 (선택사항)

### 커스텀 도메인 사용

자신만의 도메인(예: `our-wedding.com`)을 연결하고 싶다면:

1. 도메인 구입 (가비아, 호스팅케이알 등)
2. DNS 설정:
   ```
   Type: CNAME
   Name: www (또는 @)
   Value: your-username.github.io
   ```
3. GitHub Settings → Pages → Custom domain에 도메인 입력
4. "Enforce HTTPS" 체크

자세한 내용은 [GitHub 공식 문서](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) 참조

---

## 💡 추가 팁

### 배포 전 체크리스트

- [ ] `app/page.tsx`의 모든 정보 입력 완료
- [ ] `public/images/` 폴더에 모든 이미지 추가
- [ ] `public/audio/bgm.mp3` 배경음악 추가
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] 카카오 API 키 설정 (선택)
- [ ] 모바일에서 로컬 테스트 완료

### 성능 최적화

- 이미지는 800KB 이하로 압축
- BGM 파일은 5MB 이하
- 불필요한 섹션 제거

### 보안

- `.env` 파일은 절대 커밋하지 마세요
- `.gitignore`에 민감한 정보 파일 추가
- 카카오 API 키는 프론트엔드에 노출되어도 괜찮습니다 (도메인 제한 설정됨)

---

## 🎉 배포 완료!

축하합니다! 청첩장이 무료로 배포되었습니다.

**공유 방법:**
1. 배포된 URL을 카카오톡으로 공유
2. QR 코드 생성하여 인쇄물에 첨부
3. SNS에 링크 게시

**문제가 있나요?**
- GitHub Issues에 질문 등록
- [Next.js 공식 문서](https://nextjs.org/docs) 참조
- [GitHub Pages 공식 문서](https://docs.github.com/pages) 참조

---

**즐거운 결혼 준비 되세요! 💒✨**
