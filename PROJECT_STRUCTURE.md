# 📁 프로젝트 구조

모바일 청첩장 웹 애플리케이션의 전체 파일 구조와 각 파일의 역할을 설명합니다.

```
jaehyunnn.github.io/
├── app/                          # Next.js App Router
│   ├── globals.css              # 전역 CSS 스타일
│   ├── layout.tsx               # 루트 레이아웃 (메타데이터, 폰트)
│   └── page.tsx                 # 메인 페이지 (청첩장 데이터 및 구성)
│
├── components/                   # React 컴포넌트
│   ├── BGMPlayer.tsx            # 배경음악 플레이어
│   └── sections/                # 페이지 섹션 컴포넌트
│       ├── HeroSection.tsx      # 메인 히어로 섹션 (신랑신부 이름)
│       ├── InvitationSection.tsx  # 초대 인사말
│       ├── GallerySection.tsx   # 폴라로이드 갤러리
│       ├── WeddingInfoSection.tsx # 예식 정보 및 지도
│       ├── ContactSection.tsx   # 연락처 및 계좌정보
│       └── ShareSection.tsx     # 카카오톡 공유
│
├── public/                       # 정적 파일
│   ├── images/                  # 이미지 파일
│   │   ├── hero-bg.jpg          # 메인 배경 이미지
│   │   ├── photo1.jpg ~ photo6.jpg  # 갤러리 사진
│   │   └── og-image.jpg         # SNS 공유 썸네일
│   └── audio/                   # 오디오 파일
│       └── bgm.mp3              # 배경음악
│
├── node_modules/                 # NPM 패키지 (자동 생성)
├── .next/                       # Next.js 빌드 파일 (자동 생성)
│
├── package.json                 # 프로젝트 의존성
├── tsconfig.json               # TypeScript 설정
├── next.config.ts              # Next.js 설정
├── tailwind.config.js          # Tailwind CSS 설정
├── postcss.config.mjs          # PostCSS 설정
│
├── README.md                    # 프로젝트 소개 및 사용법
├── SETUP_GUIDE.md              # 상세 설정 가이드
└── PROJECT_STRUCTURE.md         # 이 문서
```

---

## 📄 주요 파일 설명

### 1. 설정 파일

#### `package.json`
프로젝트의 메타데이터와 의존성 패키지 정의
```json
{
  "dependencies": {
    "next": "^16.0.3",           // Next.js 프레임워크
    "react": "^19.0.0",          // React 라이브러리
    "framer-motion": "^x.x.x",   // 애니메이션
    "lucide-react": "^x.x.x",    // 아이콘
    // ...
  }
}
```

#### `tsconfig.json`
TypeScript 컴파일러 옵션
- 경로 별칭: `@/` → 프로젝트 루트
- 엄격한 타입 체크 활성화

#### `next.config.ts`
Next.js 프레임워크 설정
- 이미지 최적화 도메인
- 환경변수 설정

#### `tailwind.config.js`
Tailwind CSS 커스터마이징
- 색상 팔레트
- 폰트 설정
- 브레이크포인트

---

### 2. 애플리케이션 파일

#### `app/layout.tsx`
전체 애플리케이션의 루트 레이아웃
```typescript
- 메타데이터 설정 (제목, OG 이미지)
- Google Fonts 로드
- 전역 CSS 적용
```

#### `app/page.tsx` ⭐ 가장 중요!
메인 청첩장 페이지
```typescript
- weddingData 객체: 모든 청첩장 정보 관리
- 각 섹션 컴포넌트 조합
- 데이터 props 전달
```

#### `app/globals.css`
전역 CSS 스타일
```css
- Tailwind CSS 임포트
- 커스텀 스크롤바
- 폰트 설정
- 스무스 스크롤
```

---

### 3. 컴포넌트

#### `components/BGMPlayer.tsx`
배경음악 재생 컴포넌트
```typescript
기능:
- 자동 재생 (사용자 인터랙션 후)
- 재생/일시정지 토글
- 볼륨 조절
- 음소거 버튼
- 애니메이션 효과

Props:
- audioSrc: 음악 파일 경로
- autoPlay: 자동 재생 여부
```

#### `components/sections/HeroSection.tsx`
메인 히어로 섹션
```typescript
기능:
- 신랑신부 이름 표시
- 결혼식 날짜/시간 표시
- 배경 이미지
- 페이드인 애니메이션
- 스크롤 안내

Props:
- groomName: 신랑 이름
- brideName: 신부 이름
- weddingDate: 결혼식 날짜
- weddingTime: 결혼식 시간
- backgroundImage: 배경 이미지 경로
```

#### `components/sections/InvitationSection.tsx`
초대 인사 섹션
```typescript
기능:
- 초대 메시지 표시
- 양가 부모님 정보
- 신랑신부 정보
- 스크롤 애니메이션

Props:
- invitationMessage: 초대 메시지
- groomFather/Mother: 신랑 부모님
- brideFather/Mother: 신부 부모님
- groomName/brideName: 신랑신부
```

#### `components/sections/GallerySection.tsx`
폴라로이드 갤러리
```typescript
기능:
- 폴라로이드 스타일 프레임
- 이미지 호버 효과
- 클릭 시 확대 모달
- 무작위 회전 효과
- 그리드 레이아웃

Props:
- photos: 사진 배열
  - src: 이미지 경로
  - caption: 사진 설명
  - rotation: 회전 각도
```

#### `components/sections/WeddingInfoSection.tsx`
예식 정보 및 지도
```typescript
기능:
- 날짜/시간/장소 정보
- 카카오맵 연동
- 네비게이션 링크 (카카오맵/네이버지도)
- 정보 카드 디자인

Props:
- date, time: 날짜/시간
- venue, address: 장소/주소
- venueDetail: 상세 정보
- latitude, longitude: 위도/경도
```

#### `components/sections/ContactSection.tsx`
연락처 및 계좌정보
```typescript
기능:
- 전화 걸기 (tel: 링크)
- 문자 보내기 (sms: 링크)
- 계좌번호 복사
- 신랑/신부 측 구분

Props:
- groom, bride: 신랑신부 정보
  - name: 이름
  - phone: 연락처
  - accountBank: 은행
  - accountNumber: 계좌번호
  - accountHolder: 예금주
- groomFather/Mother: 신랑 부모님
- brideFather/Mother: 신부 부모님
```

#### `components/sections/ShareSection.tsx`
SNS 공유 섹션
```typescript
기능:
- 카카오톡 공유 (SDK)
- URL 복사
- 네이티브 공유 (모바일)
- 공유 메시지 커스터마이징

Props:
- groomName, brideName: 신랑신부
- weddingDate: 결혼식 날짜
- thumbnailImage: 썸네일 이미지
- description: 공유 메시지
```

---

## 🔧 기술 스택 상세

### Core
- **Next.js 16**: React 프레임워크 (App Router)
- **React 19**: UI 라이브러리
- **TypeScript**: 타입 안정성

### Styling
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **PostCSS**: CSS 전처리

### Animation
- **Framer Motion**: React 애니메이션 라이브러리
- **react-intersection-observer**: 스크롤 애니메이션

### Icons
- **Lucide React**: 아이콘 세트

### Fonts
- **Google Fonts**:
  - Noto Serif KR: 세리프 한글 폰트
  - Nanum Pen Script: 손글씨 스타일
  - Geist Sans: 기본 산세리프

### External APIs
- **Kakao SDK**: 카카오톡 공유, 지도
- **Web APIs**:
  - Clipboard API: 복사 기능
  - Share API: 네이티브 공유

---

## 🎨 디자인 시스템

### 색상 팔레트
```css
Primary: rose-500 (#f43f5e)
Secondary: rose-300 (#fda4af)
Background: white (#ffffff)
Text: gray-800 (#1f2937)
Accent: rose-50 (#fff1f2)
```

### 타이포그래피
```css
제목: font-serif, Noto Serif KR
본문: font-sans, Geist Sans
손글씨: font-handwriting, Nanum Pen Script
```

### 브레이크포인트
```css
Mobile: < 640px
Tablet: 640px ~ 1024px
Desktop: > 1024px
```

---

## 🔄 데이터 흐름

```
app/page.tsx (데이터 정의)
    ↓
weddingData 객체
    ↓
Props 전달
    ↓
각 Section 컴포넌트
    ↓
화면 렌더링
```

---

## 📦 빌드 프로세스

```bash
npm run dev      # 개발 서버 (hot reload)
    ↓
.next/ 폴더 생성 (개발 빌드)
    ↓
http://localhost:3000

npm run build    # 프로덕션 빌드
    ↓
.next/ 폴더 생성 (최적화)
    ↓
npm run start    # 프로덕션 서버
```

---

## 🚀 배포 구조

### GitHub Pages (현재 설정)
```
GitHub Push
    ↓
GitHub Actions 자동 빌드
    ↓
GitHub Pages 배포
    ↓
https://jaehyunnn.github.io/
```

### Vercel (대안)
```
GitHub 연동
    ↓
자동 빌드
    ↓
CDN 배포
    ↓
https://your-domain.vercel.app
```

### 정적 파일 배포
```bash
npm run build
    ↓
out/ 폴더 생성 (정적 HTML)
    ↓
S3, Netlify 등에 업로드
```

---

## 📝 커스터마이징 체크리스트

필수 수정 파일:
- [ ] `app/page.tsx` - 청첩장 데이터
- [ ] `public/images/` - 이미지 파일
- [ ] `public/audio/` - 배경음악

선택 수정 파일:
- [ ] `app/layout.tsx` - 메타데이터
- [ ] `app/globals.css` - 전역 스타일
- [ ] 각 섹션 컴포넌트 - 디자인 커스터마이징

---

**이 문서가 도움이 되었기를 바랍니다!**
