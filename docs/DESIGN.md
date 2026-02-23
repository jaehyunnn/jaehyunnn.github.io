# 디자인 가이드

## 무드 & 톤
미니멀 + 모던 + 약간의 개성. "깔끔하지만 기억에 남는" 느낌.

## 레퍼런스
- https://brittanychiang.com — 구조, 네비게이션
- https://leerob.io — 블로그 레이아웃
- https://www.joshwcomeau.com — 인터랙티브 MDX
- (추가 레퍼런스 URL을 여기에)

## 컬러 팔레트

### Light Mode
- Background: #FAFAFA
- Surface: #FFFFFF
- Text Primary: #1A1A1A
- Text Secondary: #6B7280
- Primary: #2563EB
- Accent: #F59E0B
- Border: #E5E7EB
- Code BG: #F3F4F6

### Dark Mode
- Background: #0A0A0A
- Surface: #1A1A1A
- Text Primary: #E5E5E5
- Text Secondary: #9CA3AF
- Primary: #60A5FA
- Accent: #FBBF24
- Border: #2D2D2D
- Code BG: #1E1E1E

## 타이포그래피
- 한글: Pretendard (Variable)
- 영문 제목: Outfit / Sora / Clash Display 중 택 1
- 코드: JetBrains Mono

## 레이아웃
- 최대 너비: 768px (블로그 본문), 1280px (홈)
- 기본 여백: 1.5rem (모바일), 2rem (데스크톱)
- 섹션 간격: 4~6rem

## Notion 블록 렌더링 스타일

### 코드 블록
- 라운드 코너, 파일명 표시, 복사 버튼
- rehype-pretty-code + shiki 테마 (one-dark-pro / github-light)

### Callout
- 좌측 이모지 + 배경색 (타입별: info=blue, warning=yellow, error=red)
- border-left 4px accent

### 이미지
- rounded-lg, shadow, 캡션 지원
- Notion에서 다운로드된 로컬 이미지 사용

### Bookmark
- 링크 카드 형태 (favicon + 제목 + 설명)

## 인터랙션
- 페이지 진입: staggered fade-in (Framer Motion)
- 카드 hover: translateY(-2px) + shadow 확대
- 다크모드 전환: transition 0.3s
- 검색: 입력 시 실시간 필터 (부드러운 리스트 전환)