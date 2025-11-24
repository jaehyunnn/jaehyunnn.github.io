# RSVP 기능 문제 해결 가이드

## 해결된 문제들

### ✅ 1. 모바일 화면에서 입력 필드 커서가 화면 밖에 있는 문제

**증상:**
- 모바일(특히 iOS)에서 이름 입력 시 키보드가 올라오면 입력 필드가 가려짐
- 커서가 화면 밖에 위치하여 입력 내용을 볼 수 없음

**해결 방법:**
1. **자동 스크롤 기능 추가**: 입력 필드에 포커스가 갈 때 자동으로 해당 필드가 모달의 상단 1/3 지점에 오도록 스크롤
2. **모달 높이 조정**: 모바일에서 `max-h-[85vh]`로 설정하여 키보드 공간 확보
3. **iOS 스크롤 최적화**: `-webkit-overflow-scrolling: touch` 추가
4. **iOS resize 이벤트 처리**: 키보드로 인한 화면 resize 시에도 자동 스크롤
5. **긴 지연 시간**: iOS 키보드 애니메이션을 고려하여 300ms 지연 후 스크롤
6. **scrollIntoView 추가**: iOS 최적화를 위해 `scrollIntoView` 추가 호출

**변경된 코드:**
- [components/RSVPModal.tsx](components/RSVPModal.tsx:44-106) - 자동 스크롤 로직 (iOS 최적화)
- [components/RSVPModal.tsx](components/RSVPModal.tsx:231) - 모달 높이 조정
- [components/RSVPModal.tsx](components/RSVPModal.tsx:233-237) - 스크롤 컨테이너 최적화

---

### ✅ 2. GitHub Pages에서 API 라우트 405 에러

**증상:**
```
POST https://jaehyunnn.github.io/api/rsvp 405 (Method Not Allowed)
```

**원인:**
- GitHub Pages는 정적 사이트 호스팅만 지원
- Next.js API 라우트는 서버 사이드 코드이므로 GitHub Pages에서 작동하지 않음

**해결 방법:**
- **Google Apps Script 사용**: 클라이언트에서 직접 구글 시트에 저장
- GET 요청으로 CORS 문제 회피
- 저장 실패 시 사용자에게 에러 메시지 표시

**대안:**
- **Vercel/Netlify 배포**: 서버리스 함수를 지원하는 플랫폼 사용

---

### ✅ 3. Google Apps Script CORS 에러

**증상:**
```
Access to fetch at 'https://script.google.com/...' has been blocked by CORS policy
POST https://script.google.com/.../exec net::ERR_FAILED
```

**원인:**
- POST 요청 시 `Content-Type: application/json`이 CORS preflight 요청을 발생시킴
- Google Apps Script가 OPTIONS preflight 요청을 제대로 처리하지 못함

**해결 방법:**
1. **GET 요청으로 변경**: POST 대신 GET 요청을 사용하여 CORS 문제 회피
2. **데이터를 쿼리 파라미터로 전송**: JSON 데이터를 URLSearchParams로 인코딩
3. **Google Apps Script에서 GET 요청 처리**: `doGet(e)` 함수에서 `e.parameter.data` 파싱

**변경된 코드:**
```typescript
// components/RSVPModal.tsx
const params = new URLSearchParams({
  data: JSON.stringify(data),
});

const response = await fetch(`${scriptUrl}?${params.toString()}`, {
  method: 'GET',
  redirect: 'follow',
});
```

**Google Apps Script 코드:**
```javascript
function doGet(e) {
  const data = JSON.parse(decodeURIComponent(e.parameter.data));
  // 스프레드시트에 저장...
}
```

자세한 내용은 [google-apps-script.js](google-apps-script.js) 파일 참고

---

## 추가 개선 사항

### 1. 유효성 검사 개선

**변경 전:**
```typescript
const isValid = formData.side && formData.name && formData.attendance && formData.meal;
```

**문제점:** 불참/미정인 경우에도 식사 여부가 필수였음

**변경 후:**
```typescript
const isValid =
  formData.side &&
  formData.name &&
  formData.attendance &&
  (formData.attendance !== 'attending' || formData.meal);
```

### 2. 모바일 입력 경험 개선

- **inputMode="text"**: 적절한 키보드 표시
- **autoComplete="name"**: 이름 자동완성 지원
- **iOS 스크롤 최적화**: 부드러운 스크롤 경험
- **resize 이벤트 처리**: 키보드로 인한 화면 변화 대응

---

## 현재 작동 방식

### RSVP 제출 흐름

1. **사용자 입력**: 참석 정보 입력
2. **유효성 검사**: 필수 항목 확인
3. **데이터 저장**: Google Apps Script로 GET 요청
4. **성공 메시지**: "참석 의사가 전달되었습니다. 감사합니다!"
5. **모달 닫기**: 자동으로 닫힘

### 데이터 저장 (Google Apps Script)

- Google Sheets에 실시간으로 데이터 저장
- GET 요청으로 CORS 문제 회피
- 저장 실패 시 사용자에게 에러 알림

---

## 테스트 체크리스트

### 모바일 (iOS)
- [ ] 이름 입력 시 키보드가 올라와도 입력 필드가 보임
- [ ] 메시지 입력 시 자동 스크롤 작동
- [ ] 키보드로 인한 화면 resize 시에도 스크롤 유지
- [ ] 제출 후 성공 메시지 표시
- [ ] 구글 시트에 데이터 저장 확인

### 모바일 (Android)
- [ ] 이름 입력 시 키보드가 올라와도 입력 필드가 보임
- [ ] 메시지 입력 시 자동 스크롤 작동
- [ ] 제출 후 성공 메시지 표시
- [ ] 구글 시트에 데이터 저장 확인

### PC (Chrome/Safari)
- [ ] 모달이 중앙에 표시됨
- [ ] 클립보드 복사 버튼 작동
- [ ] 제출 후 성공 메시지 표시
- [ ] 구글 시트에 데이터 저장 확인

### 유효성 검사
- [ ] 필수 항목 미입력 시 전송 버튼 비활성화
- [ ] 참석 선택 시 식사 여부 필수
- [ ] 불참/미정 선택 시 식사 여부 선택 가능

---

## 알려진 제한사항

### GitHub Pages 제한
- ❌ 서버 사이드 API 라우트 미지원
- ✅ Google Apps Script를 통한 구글 시트 연동 가능

### 브라우저 제한
- **Safari (iOS)**: 키보드 애니메이션 고려한 긴 지연 시간 필요
- **Chrome (Android)**: 일부 버전에서 스크롤 동작이 약간 다를 수 있음

---

## 문의 및 지원

추가 문제가 발생하면 다음을 확인하세요:

1. **Google Apps Script 설정**
   - 웹 앱 URL이 올바르게 설정되었는지
   - 스프레드시트 ID가 올바른지

2. **브라우저 콘솔**
   - F12 개발자 도구에서 에러 메시지 확인
   - 네트워크 탭에서 요청 상태 확인

3. **모바일 디버깅**
   - Safari (iOS): 설정 > Safari > 고급 > 웹 속성
   - Chrome (Android): chrome://inspect

---

**마지막 업데이트:** 2025-11-24
