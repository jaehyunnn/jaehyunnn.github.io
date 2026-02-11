# Design Direction & Reference

## 디자인 컨셉

### 키워드
- **Minimal** — 불필요한 요소 배제, 콘텐츠 중심
- **Fancy** — 세련된 타이포그래피와 여백 활용
- **Liquid Glass** — 글래스모피즘 기반의 투명/반투명 UI

### 컬러 팔레트

#### 라이트 모드
- Background: `#FAFAFA`
- Surface (Glass): `rgba(255, 255, 255, 0.6)`
- Text Primary: `#1A1A1A`
- Text Secondary: `#6B7280`
- Accent: `#3B82F6`

#### 다크 모드
- Background: `#0A0A0A`
- Surface (Glass): `rgba(255, 255, 255, 0.08)`
- Text Primary: `#F5F5F5`
- Text Secondary: `#9CA3AF`
- Accent: `#60A5FA`

### 타이포그래피
- 한글: Pretendard (또는 시스템 폰트)
- 영문/코드: JetBrains Mono / Inter
- Heading 규모: 큰 차이를 두어 시각적 위계 강조

## 레이아웃

### 구조
- 싱글 페이지 스크롤 또는 섹션 기반 네비게이션
- 최대 너비: `1200px`, 중앙 정렬
- 섹션 간 충분한 여백 (80px~120px)

### 글래스 효과
```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;
```

## 애니메이션 가이드라인

### 원칙
- 의미 있는 마이크로인터랙션만 사용
- 과도한 애니메이션 지양
- 사용자 액션에 대한 즉각적 피드백

### 허용되는 애니메이션
- 스크롤 시 섹션 fade-in (Framer Motion)
- 호버 시 카드 미세 확대/그림자 변화
- 페이지 전환 시 부드러운 트랜지션
- 커서 근처 글래스 효과 반응 (선택적)

### 지양할 애니메이션
- 무한 반복 애니메이션
- 과도한 패럴랙스
- 로딩 지연을 유발하는 무거운 효과

## 반응형 브레이크포인트
- Mobile: `< 640px`
- Tablet: `640px ~ 1024px`
- Desktop: `> 1024px`

## 레퍼런스
- Apple 디자인 시스템의 글래스 효과
- Linear.app의 미니멀 다크 UI
- Vercel 대시보드의 깔끔한 레이아웃
