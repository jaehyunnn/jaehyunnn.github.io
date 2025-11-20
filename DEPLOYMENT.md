# GitHub Pages 배포 가이드

이 문서는 `jaehyunnn.github.io` 저장소를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📌 저장소 정보

- **저장소**: `jaehyunnn/jaehyunnn.github.io`
- **배포 URL**: `https://jaehyunnn.github.io/`
- **프로젝트 경로**: `/home/ibk/workspace/jaehyunnn.github.io`

## 폰트 문제 해결 완료 ✅

### 최종 해결책

1. **Pretendard 폰트**: CSS @font-face 방식으로 전환
   - Next.js `localFont` API 제거 (GitHub Pages static export와 호환성 문제)
   - 폰트 파일 위치: `/public/fonts/Pretendard-*.woff2`
   - CSS에서 `/fonts/` 경로로 직접 참조
   - 빌드 시 자동으로 `/out/fonts/`에 복사됨

2. **경기천년바탕 폰트**: CDN 사용
   - jsdelivr CDN (`fonts-archive`)
   - woff2와 woff fallback 제공
   - `font-display: swap` 적용

## 배포 방법

### 1. 빌드 및 배포

```bash
cd /home/ibk/workspace/jaehyunnn.github.io

# 빌드
npm run build

# 로컬에서 테스트 (선택사항)
npm run start
```

### 2. GitHub Pages 설정

**저장소 설정에서:**
1. Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` (또는 `master`)
4. Folder: `/ (root)` 또는 `/out` (static export 사용 시)

### 3. GitHub Actions를 사용한 자동 배포 (권장)

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 폰트 로딩 검증

배포 후 다음 사항 확인:

### 1. 브라우저 개발자 도구 (F12)
- **Network 탭**: 폰트 파일이 200 OK로 로드되는지 확인
- **Console 탭**: 폰트 관련 에러 메시지 확인

### 2. 폰트 로딩 확인 경로
- Pretendard: `/_next/static/media/` 경로에서 로드
- 경기천년바탕: `cdn.jsdelivr.net`에서 로드

### 3. 문제 해결
폰트가 로드되지 않는다면:

```bash
# 캐시 클리어 후 재빌드
rm -rf .next
npm run build
```

## 주요 설정 파일

### next.config.ts
```typescript
output: 'export', // 정적 export
images: {
  unoptimized: true, // GitHub Pages용
}
```

### app/layout.tsx
```typescript
// Pretendard는 CSS @font-face로 로드 (localFont 미사용)
// 오직 Google Fonts만 Next.js API 사용
const nanumPen = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
});
```

### app/globals.css
```css
/* Pretendard: 로컬 폰트 @font-face로 로드 */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* Medium (500), SemiBold (600), Bold (700) 동일 방식으로 정의 */

/* 경기천년바탕: CDN 사용 */
@font-face {
  font-family: 'GyeonggiCheonnyeonBatang';
  src: url('https://cdn.jsdelivr.net/gh/fonts-archive/GyeonggiCheonnyeonBatang/GyeonggiCheonnyeonBatang-Bold.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/gh/fonts-archive/GyeonggiCheonnyeonBatang/GyeonggiCheonnyeonBatang-Bold.woff') format('woff');
  font-display: swap;
}

:root {
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-serif: 'GyeonggiCheonnyeonBatang', serif;
}
```

## 트러블슈팅

### 폰트가 깨져 보이는 경우
1. 브라우저 캐시 클리어 (Ctrl + Shift + R)
2. CDN 상태 확인: https://www.jsdelivr.com/

### 빌드 에러
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 참고사항
- GitHub Pages는 정적 호스팅이므로 ISR, SSR 기능 사용 불가
- 폰트 파일 총 용량: ~3MB (Pretendard) + CDN (경기천년바탕)
- 첫 로딩 후 브라우저 캐시에 저장됨
