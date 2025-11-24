# RSVP 기능 설정 가이드

## 📋 개요

청첩장에 참석 여부 전달 기능(RSVP)이 추가되었습니다. 하객들이 카카오톡으로 간편하게 참석 의사를 전달할 수 있습니다.

---

## 🔧 1단계: 카카오 개발자 설정

### 1.1 카카오 개발자 계정 생성 및 앱 등록

1. [카카오 개발자 센터](https://developers.kakao.com/) 접속
2. 로그인 후 **내 애플리케이션** 클릭
3. **애플리케이션 추가하기** 클릭
4. 앱 이름 입력 (예: "재현♥가인 청첩장") 후 저장

### 1.2 JavaScript 키 발급

1. 생성한 앱 선택
2. **앱 키** 섹션에서 **JavaScript 키** 복사
3. 프로젝트 루트에 `.env.local` 파일 생성

```bash
# .env.local
NEXT_PUBLIC_KAKAO_JS_KEY=your_javascript_key_here
```

### 1.3 플랫폼 도메인 등록

1. 앱 설정 > **플랫폼** 메뉴 클릭
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 추가:
   - 개발 환경: `http://localhost:3000`
   - 배포 환경: `https://yourdomain.com` (실제 도메인으로 교체)

---

## 📊 2단계: 구글 스프레드시트 연동 (선택사항)

**⚠️ 중요: GitHub Pages 사용자는 이 기능을 사용할 수 없습니다.**

GitHub Pages는 정적 사이트 호스팅만 지원하므로 API 라우트가 작동하지 않습니다.
현재 구현은 구글 시트 저장이 실패해도 카카오톡 공유는 정상적으로 작동하도록 되어 있습니다.

구글 시트 연동이 필요한 경우, 다음 중 하나를 선택하세요:
- **Vercel, Netlify 등 서버리스 함수를 지원하는 플랫폼으로 배포**
- **Google Apps Script Web App 사용** (아래 참고)

### GitHub Pages에서 구글 시트 연동하기

Google Apps Script를 사용하여 클라이언트에서 직접 구글 시트에 저장할 수 있습니다:

#### 1. 구글 스프레드시트 준비

1. [Google Sheets](https://sheets.google.com/)에서 새 시트 생성
2. 첫 번째 시트 이름을 **"RSVP"**로 변경
3. 첫 번째 행에 다음 헤더 입력:
   ```
   타임스탬프 | 구분 | 성함 | 참석여부 | 동반인원 | 식사여부 | 메시지
   ```
4. 스프레드시트 URL에서 ID 복사:
   ```
   https://docs.google.com/spreadsheets/d/[이 부분이 ID]/edit
   ```

#### 2. Google Apps Script 설정

1. [Google Apps Script](https://script.google.com/) 접속
2. **새 프로젝트** 클릭
3. 프로젝트 이름 입력 (예: "청첩장 RSVP")
4. 프로젝트 루트의 `google-apps-script.js` 파일 내용을 전체 복사하여 붙여넣기
5. 코드 19번째 줄의 `YOUR_SHEET_ID_HERE`를 위에서 복사한 스프레드시트 ID로 교체
6. **저장** (Ctrl+S 또는 Cmd+S)

#### 3. 웹 앱 배포

1. **배포 > 새 배포** 클릭
2. **유형 선택 > 웹 앱** 선택
3. 설정:
   - **다음 사용자로 실행**: 나
   - **액세스 권한**: **모든 사용자**
4. **배포** 클릭
5. 권한 승인 (본인 구글 계정 로그인 필요)
6. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfyc...`)

#### 4. 프론트엔드 코드 업데이트

`components/RSVPModal.tsx` 파일에서 Google Apps Script URL을 변경하세요:

```typescript
// 175번째 줄 근처
const scriptUrl = 'YOUR_WEB_APP_URL_HERE'; // 복사한 웹 앱 URL로 교체
```

#### 5. 테스트

1. 개발 서버 재시작: `npm run dev`
2. 참석 의사 전달 폼 작성 및 전송
3. 구글 스프레드시트에 데이터가 추가되는지 확인

**중요:** 코드를 수정한 후에는 Google Apps Script에서 **새 배포**를 생성해야 합니다.

---

### Vercel/Netlify 배포 시 구글 시트 연동

RSVP 데이터를 구글 시트에 자동 저장하려면 다음 단계를 진행하세요.

### 2.1 Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 (예: "wedding-invitation")
3. **API 및 서비스 > 라이브러리** 에서 "Google Sheets API" 검색 후 활성화

### 2.2 서비스 계정 생성

1. **API 및 서비스 > 사용자 인증 정보** 메뉴
2. **사용자 인증 정보 만들기 > 서비스 계정** 클릭
3. 서비스 계정 이름 입력 후 완료
4. 생성된 서비스 계정 클릭 > **키** 탭
5. **키 추가 > 새 키 만들기 > JSON** 선택하여 다운로드

### 2.3 환경 변수 설정

다운로드한 JSON 파일의 내용을 `.env.local`에 추가:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id
```

### 2.4 구글 스프레드시트 생성 및 권한 부여

1. [Google Sheets](https://sheets.google.com/) 에서 새 시트 생성
2. 시트 이름을 "RSVP"로 설정
3. 첫 번째 행에 헤더 추가:
   ```
   타임스탬프 | 구분 | 성함 | 참석여부 | 동반인원 | 식사여부 | 메시지
   ```
4. **공유** 버튼 클릭
5. 서비스 계정 이메일(`...@....iam.gserviceaccount.com`)을 **편집자** 권한으로 추가
6. URL에서 스프레드시트 ID 복사:
   ```
   https://docs.google.com/spreadsheets/d/[이 부분이 ID]/edit
   ```

### 2.5 Google Sheets API 라이브러리 설치

```bash
npm install googleapis
```

### 2.6 API 라우트 수정

[app/api/rsvp/route.ts](app/api/rsvp/route.ts) 파일의 주석 처리된 코드를 활성화하세요.

---

## 🚀 3단계: 실행 및 테스트

### 개발 서버 실행

```bash
npm run dev
```

### 테스트 절차

1. `http://localhost:3000` 접속
2. "참석 의사 전달하기" 버튼 클릭
3. 폼 작성 후 "카카오톡으로 전송하기" 클릭
4. 카카오톡 앱이 실행되면 테스트 성공!
5. (선택) 구글 시트에 데이터가 저장되는지 확인

---

## 📱 카카오톡 공유 메시지 커스터마이징

기본적으로 텍스트 형식으로 전송됩니다. 커스텀 템플릿을 사용하려면:

### 카스텀 템플릿 생성

1. 카카오 개발자 센터 > 내 애플리케이션 > **메시지 템플릿** 메뉴
2. **템플릿 추가** 클릭
3. 템플릿 유형: **Feed** 선택
4. 템플릿 디자인 (예시):

```json
{
  "object_type": "feed",
  "content": {
    "title": "#{name}님의 참석 의사",
    "description": "구분: #{side}\n참석: #{attendance}\n인원: #{guestCount}명\n식사: #{meal}",
    "image_url": "https://yourdomain.com/images/share-bg.png",
    "link": {
      "web_url": "https://yourdomain.com",
      "mobile_web_url": "https://yourdomain.com"
    }
  }
}
```

5. 템플릿 ID 복사 후 [components/RSVPModal.tsx](components/RSVPModal.tsx)의 `handleKakaoShare` 함수 수정:

```typescript
window.Kakao.Share.sendCustom({
  templateId: YOUR_TEMPLATE_ID,
  templateArgs: {
    name: formData.name,
    side: formData.side === 'groom' ? '신랑 측' : '신부 측',
    attendance: /* ... */,
    guestCount: formData.guestCount,
    meal: /* ... */,
  },
});
```

---

## 🔍 문제 해결

### 카카오톡이 실행되지 않아요
- 플랫폼 도메인이 올바르게 등록되었는지 확인
- JavaScript 키가 `.env.local`에 정확히 입력되었는지 확인
- 개발 서버 재시작 (`npm run dev`)

### 구글 시트에 저장이 안 돼요
- 서비스 계정 이메일이 스프레드시트에 편집자로 추가되었는지 확인
- 환경 변수가 올바르게 설정되었는지 확인
- `googleapis` 패키지가 설치되었는지 확인

### PC에서 접속하면 어떻게 되나요?
- 현재는 클립보드 복사 기능으로 대체됩니다
- QR 코드 기능이 필요하면 별도로 구현 가능합니다

---

## 📦 배포 전 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] Vercel/Netlify 등 배포 플랫폼의 환경 변수 설정
- [ ] 배포된 도메인을 카카오 개발자 센터에 플랫폼으로 추가
- [ ] 실제 환경에서 RSVP 테스트

---

## 💡 추가 기능 아이디어

- 참석 인원 통계 대시보드
- 문자 메시지 전송 fallback
- QR 코드 생성 (PC 사용자용)
- 관리자 페이지 (RSVP 목록 조회)

---

**문의사항이 있으시면 개발자에게 연락해주세요!** 🎉
