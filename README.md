# 🎉 모바일 청첩장 웹 애플리케이션

모바일 환경에 최적화된 디지털 청첩장 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📱 **모바일 최적화**: 반응형 디자인으로 모든 디바이스 지원
- 🎵 **배경음악(BGM)**: 자동 재생 및 컨트롤 기능
- 📸 **폴라로이드 갤러리**: 감성적인 사진 전시
- 🗺️ **지도 연동**: 카카오맵/네이버지도 길찾기
- 💌 **카카오톡 공유**: 간편한 SNS 공유
- 🎨 **스크롤 애니메이션**: 부드러운 인터랙션
- 📞 **연락처 기능**: 클릭 한 번으로 전화/문자
- 💳 **계좌번호 복사**: 편리한 축의금 전달

## 🚀 시작하기

### 1. 프로젝트 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 청첩장 커스터마이징

`app/page.tsx` 파일에서 `weddingData` 객체를 수정하세요:

```typescript
const weddingData = {
  groom: {
    name: '김신랑',           // 신랑 이름
    father: '김아버지',       // 신랑 아버지
    mother: '김어머니',       // 신랑 어머니
    phone: '010-1234-5678',  // 신랑 연락처
    accountBank: '국민은행',  // 계좌 은행
    accountNumber: '123-456-789012',
  },
  bride: {
    name: '이신부',
    // ... 동일한 형식
  },
  wedding: {
    date: '2025년 6월 14일 토요일',
    time: '오후 2시 30분',
    venue: '그랜드 컨벤션 웨딩홀',
    address: '서울특별시 강남구 테헤란로 123',
    latitude: 37.5665,      // 장소 위도
    longitude: 126.9780,    // 장소 경도
  },
};
```

### 4. 이미지 추가

`public/images/` 폴더에 다음 이미지를 추가하세요:

- `hero-bg.jpg` - 메인 배경 이미지
- `photo1.jpg` ~ `photo6.jpg` - 갤러리 사진들
- `og-image.jpg` - SNS 공유 썸네일

### 5. BGM 추가

`public/audio/` 폴더에 배경음악 파일을 추가하세요:

- `bgm.mp3` - 배경음악 (추천: 2-3분 길이의 잔잔한 음악)

### 6. 카카오 API 설정 (선택사항)

카카오톡 공유 및 지도 기능을 사용하려면:

1. [Kakao Developers](https://developers.kakao.com/)에서 앱 등록
2. JavaScript 키 발급
3. 다음 파일에서 `YOUR_KAKAO_APP_KEY`를 실제 키로 교체:
   - `components/sections/ShareSection.tsx` (33번째 줄)
   - `components/sections/WeddingInfoSection.tsx` (33번째 줄)

```typescript
// ShareSection.tsx
window.Kakao.init('YOUR_KAKAO_APP_KEY'); // 여기에 실제 키 입력

// WeddingInfoSection.tsx
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&autoload=false`;
```

## 📦 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 배포

이 프로젝트는 다음 플랫폼에 쉽게 배포할 수 있습니다:

#### GitHub Pages (무료, 추천) 🌟

무료로 배포하고 싶다면 GitHub Pages를 이용하세요!

**간단한 배포 방법:**
1. GitHub에 저장소 생성 (예: `mobile_invitation`)
2. 코드 푸시
3. Settings → Pages → Source를 "GitHub Actions"로 설정
4. 자동으로 배포됩니다!

**배포 URL:** `https://your-username.github.io/mobile_invitation/`

**상세한 가이드:** [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md) 참조

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Font**: Google Fonts (Noto Serif KR, Nanum Pen Script)

## 📱 지원 브라우저

- iOS Safari 14+
- Android Chrome 90+
- Samsung Internet 14+
- Chrome 90+
- Safari 14+

## 🎨 커스터마이징 가이드

### 색상 변경

전체적인 테마 색상을 변경하려면 각 컴포넌트 파일에서 `rose-` 계열 색상을 원하는 색상으로 바꾸세요:

```typescript
// 예: rose → blue
className="bg-rose-500" // → className="bg-blue-500"
className="text-rose-300" // → className="text-blue-300"
```

### 섹션 추가/제거

`app/page.tsx`에서 필요 없는 섹션을 주석 처리하거나 제거할 수 있습니다:

```typescript
{/* 갤러리 - 필요없으면 주석 처리 */}
{/* <GallerySection photos={weddingData.photos} /> */}
```

### 폰트 변경

`app/layout.tsx`에서 Google Fonts를 변경할 수 있습니다:

```typescript
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});
```

## 📝 라이선스

이 프로젝트는 개인적 용도로 자유롭게 사용 가능합니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해 주세요.

---

**즐거운 결혼 준비 되세요! 💒**
