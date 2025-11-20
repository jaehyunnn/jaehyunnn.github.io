# 🚀 jaehyunnn.github.io로 배포하기

기존에 생성해둔 `jaehyunnn.github.io` 저장소에 청첩장을 배포하는 가이드입니다.

## 📌 중요 사항

`username.github.io` 형태의 저장소는:
- ✅ **루트 경로**로 배포됩니다 (`https://jaehyunnn.github.io/`)
- ✅ **basePath 없이** 설정해야 합니다 (이미 수정 완료!)
- ✅ GitHub Pages **자동 활성화**됩니다

---

## 🚀 배포 방법

### Step 1: 기존 저장소 내용 확인

먼저 기존 `jaehyunnn.github.io` 저장소에 무엇이 있는지 확인하세요:

```bash
# 기존 저장소 클론 (다른 폴더에)
cd ~
git clone https://github.com/jaehyunnn/jaehyunnn.github.io.git temp-backup

# 내용 확인
ls -la temp-backup/
```

> **⚠️ 주의**: 기존 내용이 중요하다면 백업하세요!

---

### Step 2: 청첩장 코드를 저장소에 푸시

#### 옵션 A: 기존 내용 모두 교체 (청첩장만 배포)

```bash
cd /home/ibk/workspace/jaehyunnn.github.io

# Git 원격 저장소 확인
git remote -v

# 기존 origin이 있다면 제거
git remote remove origin

# jaehyunnn.github.io와 연결
git remote add origin https://github.com/jaehyunnn/jaehyunnn.github.io.git

# 강제 푸시 (기존 내용 덮어쓰기)
git push -f origin main
```

#### 옵션 B: 기존 내용 유지 (권장하지 않음)

기존 내용이 중요하다면 서브 디렉토리로 배포할 수 있지만,
이 경우 `https://jaehyunnn.github.io/wedding/` 같은 경로가 필요합니다.

**더 나은 방법**: 새 저장소 만들기 (아래 참조)

---

### Step 3: GitHub Pages 설정

1. https://github.com/jaehyunnn/jaehyunnn.github.io 접속
2. **Settings** 탭
3. 왼쪽 **Pages** 메뉴
4. **Source**: **"GitHub Actions"** 선택

---

### Step 4: 배포 확인

1. **Actions** 탭에서 배포 진행 확인
2. 초록색 체크 표시 확인 (2-5분 소요)
3. 완료 후 접속:
   ```
   https://jaehyunnn.github.io/
   ```

---

## 🎯 대안: 새 저장소 만들기 (추천)

기존 `jaehyunnn.github.io`를 유지하고 싶다면,
청첩장용 새 저장소를 만드는 것을 추천합니다:

### 방법 1: wedding 서브 경로 사용

```bash
# 1. GitHub에서 새 저장소 생성: wedding
# 2. next.config.ts 수정 필요:
basePath: '/wedding'

# 3. 푸시
git remote add origin https://github.com/jaehyunnn/wedding.git
git push -u origin main

# 배포 URL: https://jaehyunnn.github.io/wedding/
```

### 방법 2: 완전히 새 저장소

```bash
# 1. GitHub에서 새 저장소 생성: mobile-wedding
# 2. 푸시
git remote add origin https://github.com/jaehyunnn/mobile-wedding.git
git push -u origin main

# 배포 URL: https://jaehyunnn.github.io/mobile-wedding/
```

이 경우 `next.config.ts`에 basePath 추가 필요:
```typescript
basePath: '/mobile-wedding'  // 또는 '/wedding'
```

---

## 📝 현재 설정 상태

현재 프로젝트는 **루트 경로** 배포로 설정되어 있습니다:
- ✅ `basePath` 없음
- ✅ `output: 'export'` 설정됨
- ✅ GitHub Actions 워크플로우 준비 완료

**배포 URL**: `https://jaehyunnn.github.io/`

---

## 🔄 서브 경로로 변경하기

만약 `/wedding` 같은 서브 경로를 사용하고 싶다면:

### 1. next.config.ts 수정

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wedding',  // 서브 경로 추가
  images: {
    unoptimized: true,
  },
};
```

### 2. 저장소 이름 변경 또는 새 저장소 생성

- 저장소 이름: `wedding` (또는 원하는 이름)
- 배포 URL: `https://jaehyunnn.github.io/wedding/`

---

## 🆘 문제 해결

### 403 에러 또는 접근 불가

**원인**: GitHub Actions 권한 설정

**해결**:
1. Settings → Actions → General
2. **Workflow permissions**: "Read and write permissions" 선택
3. Save

### 기존 사이트가 계속 보임

**원인**: 캐시

**해결**:
```bash
# 브라우저 강력 새로고침
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 빌드 실패

**해결**:
```bash
# 로컬 테스트
npm run build

# 성공하면 다시 푸시
git add .
git commit -m "Fix build"
git push
```

---

## 💡 추천 방법

### 🌟 최선의 선택

1. **기존 jaehyunnn.github.io 유지**하고 싶다면:
   - 새 저장소 `wedding` 생성
   - URL: `https://jaehyunnn.github.io/wedding/`
   - basePath: `/wedding`

2. **청첩장만 배포**한다면:
   - 기존 `jaehyunnn.github.io` 사용
   - URL: `https://jaehyunnn.github.io/`
   - basePath: 없음 (현재 설정)

---

## 📋 배포 체크리스트

- [ ] 기존 저장소 내용 백업 (필요시)
- [ ] Git remote 설정
- [ ] 코드 푸시
- [ ] GitHub Pages Source: "GitHub Actions" 설정
- [ ] Actions 탭에서 배포 성공 확인
- [ ] URL 접속 테스트
- [ ] 모바일에서 확인

---

## 🎊 다음 단계

배포 완료 후:
1. `app/page.tsx`에서 청첩장 정보 수정
2. `public/images/`에 사진 추가
3. `public/audio/bgm.mp3` 추가
4. Git push로 자동 재배포

---

**현재 배포 URL**: `https://jaehyunnn.github.io/`

궁금한 점이 있으시면 말씀해 주세요! 🚀
