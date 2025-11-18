# ⚡ 빠른 시작 가이드

모바일 청첩장을 5분 안에 GitHub Pages로 무료 배포하기!

## 🎯 목표

이 가이드를 따라하면:
- ✅ 청첩장 정보 입력
- ✅ GitHub에 업로드
- ✅ 무료로 배포
- ✅ `https://your-username.github.io/mobile_invitation/` URL 획득

---

## 📝 Step 1: 청첩장 정보 입력 (2분)

### 1.1 프로젝트 열기
```bash
cd /home/ibk/workspace/mobile_invitation
```

### 1.2 정보 수정
`app/page.tsx` 파일을 열고 다음 정보만 수정하세요:

```typescript
// 필수 수정 항목
const weddingData = {
  groom: {
    name: '신랑이름',      // ⬅️ 수정
    phone: '010-0000-0000',  // ⬅️ 수정
  },
  bride: {
    name: '신부이름',      // ⬅️ 수정
    phone: '010-0000-0000',  // ⬅️ 수정
  },
  wedding: {
    date: '2025년 6월 14일 토요일',  // ⬅️ 수정
    time: '오후 2시 30분',          // ⬅️ 수정
    venue: '예식장 이름',           // ⬅️ 수정
    address: '예식장 주소',         // ⬅️ 수정
  },
};
```

**나머지는 나중에 수정해도 됩니다!**

---

## 🚀 Step 2: GitHub에 업로드 (2분)

### 2.1 GitHub 저장소 생성

1. [github.com](https://github.com) 로그인
2. 우측 상단 `+` → "New repository"
3. Repository name: `mobile_invitation`
4. Public 선택
5. "Create repository" 클릭

### 2.2 코드 업로드

터미널에서 실행:

```bash
# Git 사용자 설정 (최초 1회만)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 현재 상태 확인
git status

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: 모바일 청첩장"

# GitHub 연결 (your-username을 실제 사용자명으로!)
git remote add origin https://github.com/your-username/mobile_invitation.git

# 업로드
git branch -M main
git push -u origin main
```

> **Personal Access Token 필요 시:**
> 1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> 2. Generate new token → `repo` 체크 → Generate
> 3. 복사한 토큰을 비밀번호 대신 입력

---

## 🌐 Step 3: GitHub Pages 활성화 (1분)

### 3.1 설정

1. GitHub 저장소 페이지
2. **Settings** 탭
3. 왼쪽 **Pages** 메뉴
4. **Source**: **"GitHub Actions"** 선택 ⚠️ 중요!

### 3.2 배포 대기

1. **Actions** 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우 확인
3. 초록색 체크 표시 대기 (2-5분)

### 3.3 완료!

배포 완료 후:
- Settings → Pages에서 URL 확인
- `https://your-username.github.io/mobile_invitation/`

---

## ✅ 완료 체크리스트

배포 후 확인:
- [ ] URL 접속 성공
- [ ] 신랑신부 이름 정확히 표시
- [ ] 결혼식 날짜/시간 정확
- [ ] 모바일에서 정상 작동
- [ ] BGM 버튼 작동 (터치 후 재생)

---

## 🎨 이미지 추가 (선택사항)

나중에 추가해도 됩니다:

```bash
# 1. 이미지를 public/images/ 폴더에 복사
cp ~/Downloads/wedding-photo.jpg public/images/hero-bg.jpg

# 2. Git에 추가
git add public/images/
git commit -m "이미지 추가"
git push

# 3. 자동으로 재배포됨 (2-5분 소요)
```

---

## 🔄 정보 수정하기

청첩장 내용을 수정하려면:

```bash
# 1. app/page.tsx 파일 수정

# 2. Git에 반영
git add app/page.tsx
git commit -m "정보 업데이트"
git push

# 3. 자동 재배포 (2-5분)
```

---

## 🆘 문제 해결

### 404 에러가 나요
- Settings → Pages → Source가 "GitHub Actions"인지 확인
- 10분 정도 기다려보세요
- Actions 탭에서 배포 성공 확인

### 빌드 실패 (빨간색 X)
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 수정 후
git add .
git commit -m "Fix errors"
git push
```

### 권한 에러
- Settings → Actions → General
- "Workflow permissions" → "Read and write permissions"
- Save

---

## 📱 공유하기

배포 완료 후:
1. 카카오톡으로 URL 전송
2. QR 코드 생성: [qr-code-generator.com](https://www.qr-code-generator.com/)
3. 초대장 카드에 QR 인쇄

---

## 📚 더 자세한 가이드

- **전체 설정**: [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md)
- **커스터마이징**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **프로젝트 구조**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

**5분 만에 완성! 🎉**
