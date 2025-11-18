# 🚀 모바일 청첩장 설정 가이드

이 문서는 모바일 청첩장 웹 애플리케이션을 처음 사용하시는 분들을 위한 상세한 설정 가이드입니다.

## 📋 목차

1. [기본 정보 수정하기](#1-기본-정보-수정하기)
2. [이미지 준비 및 추가](#2-이미지-준비-및-추가)
3. [배경음악 추가](#3-배경음악-추가)
4. [카카오 API 설정](#4-카카오-api-설정)
5. [색상 테마 변경](#5-색상-테마-변경)
6. [문제 해결](#6-문제-해결)

---

## 1. 기본 정보 수정하기

### 1.1 청첩장 데이터 수정

`app/page.tsx` 파일을 열고 `weddingData` 객체를 수정합니다.

#### 신랑/신부 정보
```typescript
groom: {
  name: '홍길동',              // 신랑 이름 *필수
  father: '홍아버지',          // 아버지 성함
  mother: '홍어머니',          // 어머니 성함
  phone: '010-1234-5678',     // 연락처 *필수
  accountBank: '국민은행',     // 계좌 은행명 (선택)
  accountNumber: '123-456-789012',  // 계좌번호 (선택)
  accountHolder: '홍길동',     // 예금주 (선택)
},
```

#### 결혼식 정보
```typescript
wedding: {
  date: '2025년 6월 14일 토요일',    // 결혼식 날짜 *필수
  time: '오후 2시 30분',             // 결혼식 시간 *필수
  venue: '그랜드 컨벤션 웨딩홀',     // 예식장 이름 *필수
  venueDetail: '3층 그랜드볼룸',     // 홀 정보 (선택)
  address: '서울특별시 강남구 테헤란로 123',  // 주소 *필수
  latitude: 37.5665,                 // 위도 *필수 (지도)
  longitude: 126.9780,               // 경도 *필수 (지도)
},
```

**위도/경도 찾는 방법:**
1. [카카오맵](https://map.kakao.com/) 또는 [네이버지도](https://map.naver.com/)에서 예식장 검색
2. 해당 장소를 우클릭 → "좌표 복사" 선택
3. 복사한 좌표를 latitude(위도), longitude(경도)에 입력

#### 초대 메시지
```typescript
invitation: {
  message: `서로가 마주보며 다져온 사랑을
이제 함께 한 곳을 바라보며
걸어갈 수 있는 큰 사랑으로 키우고자 합니다.

저희 두 사람이 사랑의 이름으로 지켜나갈
첫 걸음에 여러분을 초대합니다.

오셔서 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
},
```

---

## 2. 이미지 준비 및 추가

### 2.1 필요한 이미지

프로젝트 루트의 `public/images/` 폴더에 다음 이미지를 추가하세요:

| 파일명 | 용도 | 권장 크기 | 비율 |
|--------|------|-----------|------|
| `hero-bg.jpg` | 메인 배경 | 1920x1080px | 16:9 |
| `photo1.jpg` ~ `photo6.jpg` | 갤러리 사진 | 800x800px | 1:1 |
| `og-image.jpg` | SNS 공유 썸네일 | 1200x630px | 1.91:1 |

### 2.2 이미지 최적화 팁

1. **파일 크기**: 각 이미지는 500KB 이하로 압축
2. **포맷**: JPEG 또는 WebP 권장
3. **해상도**: 모바일용이므로 과도하게 크지 않아도 됨
4. **무료 압축 도구**:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)

### 2.3 갤러리 사진 설정

`app/page.tsx`에서 사진 정보를 수정:

```typescript
photos: [
  {
    src: '/images/photo1.jpg',    // 이미지 경로
    caption: '첫 만남',            // 사진 설명 (선택)
    rotation: -2,                  // 회전 각도 (선택, -3 ~ 3)
  },
  // ... 추가 사진
],
```

**사진 추가/제거:**
- 사진을 추가하려면: 배열에 새 객체 추가
- 사진을 제거하려면: 해당 객체 삭제
- 최소 3장 ~ 최대 12장 권장

---

## 3. 배경음악 추가

### 3.1 음악 파일 준비

1. **파일 형식**: MP3 권장
2. **파일 크기**: 5MB 이하 권장
3. **길이**: 2-3분 정도가 적당
4. **음질**: 128kbps ~ 192kbps

### 3.2 음악 파일 추가

1. 음악 파일을 `public/audio/` 폴더에 복사
2. 파일명을 `bgm.mp3`로 변경하거나
3. `app/page.tsx`에서 경로 수정:

```typescript
<BGMPlayer audioSrc="/audio/your-music.mp3" autoPlay={true} />
```

### 3.3 저작권 주의사항

- 저작권이 있는 음악은 사용에 주의
- 무료 음원 사이트:
  - [YouTube Audio Library](https://www.youtube.com/audiolibrary)
  - [Free Music Archive](https://freemusicarchive.org/)
  - [Incompetech](https://incompetech.com/)

---

## 4. 카카오 API 설정

### 4.1 카카오 개발자 계정 생성

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. "내 애플리케이션" → "애플리케이션 추가하기"

### 4.2 앱 설정

1. 앱 이름: "모바일 청첩장" (원하는 이름)
2. 회사명: 개인 (선택사항)
3. 앱 생성 완료

### 4.3 JavaScript 키 발급

1. 생성한 앱 선택
2. "앱 키" 탭에서 "JavaScript 키" 복사
3. 예시: `abc123def456ghi789jkl012`

### 4.4 플랫폼 등록

1. "플랫폼" 탭 선택
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 등록:
   - 개발: `http://localhost:3000`
   - 배포: `https://your-domain.com`

### 4.5 코드에 API 키 적용

#### ShareSection.tsx (카카오톡 공유)
```typescript
// components/sections/ShareSection.tsx (33번째 줄 근처)
if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init('여기에_JavaScript_키_입력'); // <- 이 부분 수정
}
```

#### WeddingInfoSection.tsx (카카오맵)
```typescript
// components/sections/WeddingInfoSection.tsx (33번째 줄 근처)
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=여기에_JavaScript_키_입력&autoload=false`;
```

---

## 5. 색상 테마 변경

### 5.1 기본 테마 색상

현재 기본 테마는 **로즈핑크(rose)** 계열입니다.

### 5.2 다른 색상으로 변경

전체 프로젝트에서 `rose-` 를 원하는 색상으로 일괄 변경:

**Tailwind CSS 색상 옵션:**
- `blue` - 블루
- `green` - 그린
- `purple` - 퍼플
- `pink` - 핑크
- `amber` - 앰버(황금색)
- `teal` - 청록색
- `indigo` - 인디고

**변경 방법:**
1. VS Code에서 `Ctrl+Shift+F` (전체 검색)
2. `rose-` 검색
3. 원하는 색상으로 일괄 변경 (예: `blue-`)

### 5.3 예시

```typescript
// Before (로즈핑크)
className="bg-rose-500 text-rose-300"

// After (블루)
className="bg-blue-500 text-blue-300"
```

---

## 6. 문제 해결

### 6.1 개발 서버가 시작되지 않을 때

```bash
# 노드 모듈 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 삭제
rm -rf .next

# 다시 실행
npm run dev
```

### 6.2 이미지가 표시되지 않을 때

1. 파일 경로 확인: `public/images/photo1.jpg`
2. 파일명 대소문자 확인 (리눅스는 대소문자 구분)
3. 파일 확장자 확인 (.jpg, .jpeg, .png)

### 6.3 폰트가 적용되지 않을 때

1. 인터넷 연결 확인 (Google Fonts 사용)
2. 개발 서버 재시작
3. 브라우저 캐시 삭제 (Ctrl+Shift+R)

### 6.4 카카오맵이 표시되지 않을 때

1. 카카오 API 키 확인
2. 플랫폼 도메인 등록 확인
3. 위도/경도 값 확인 (숫자 형식)
4. 브라우저 콘솔에서 에러 메시지 확인

### 6.5 모바일에서 BGM이 재생되지 않을 때

**원인**: 대부분의 모바일 브라우저는 자동재생을 차단합니다.

**해결 방법**:
- 사용자가 화면을 한 번 터치하면 재생됩니다
- 이는 정상 동작이며, 브라우저 정책입니다

---

## 💡 추가 팁

### 반응형 테스트

개발자 도구(F12)를 열고 모바일 화면으로 테스트:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Galaxy S20 (360px)

### 성능 최적화

1. 이미지는 최대한 압축
2. BGM 파일은 5MB 이하
3. 불필요한 섹션은 제거

### 배포 전 체크리스트

- [ ] 모든 개인정보 정확히 입력
- [ ] 모든 이미지 파일 추가
- [ ] 카카오 API 키 설정
- [ ] 모바일에서 테스트
- [ ] 공유 기능 테스트
- [ ] 전화/문자 기능 테스트

---

**문제가 해결되지 않으면 GitHub Issues에 문의해 주세요!**
