# RSVP 기능 설정 가이드

## 📋 개요

청첩장에 참석 여부 전달 기능(RSVP)이 추가되었습니다. 하객들이 간편하게 참석 의사를 전달하면 Google Sheets에 자동으로 저장됩니다.

---

## 📊 구글 스프레드시트 연동

**⚠️ 중요: GitHub Pages 사용자는 Google Apps Script를 사용해야 합니다.**

GitHub Pages는 정적 사이트 호스팅만 지원하므로 API 라우트가 작동하지 않습니다.
Google Apps Script를 사용하여 클라이언트에서 직접 구글 시트에 저장할 수 있습니다.

### 1단계: 구글 스프레드시트 준비

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

### 2단계: Google Apps Script 설정

1. [Google Apps Script](https://script.google.com/) 접속
2. **새 프로젝트** 클릭
3. 프로젝트 이름 입력 (예: "청첩장 RSVP")
4. 프로젝트 루트의 `google-apps-script.js` 파일 내용을 전체 복사하여 붙여넣기
5. 코드 19번째 줄의 `YOUR_SHEET_ID_HERE`를 위에서 복사한 스프레드시트 ID로 교체
6. **저장** (Ctrl+S 또는 Cmd+S)

### 3단계: 웹 앱 배포

1. **배포 > 새 배포** 클릭
2. **유형 선택 > 웹 앱** 선택
3. 설정:
   - **다음 사용자로 실행**: 나
   - **액세스 권한**: **모든 사용자**
4. **배포** 클릭
5. 권한 승인 (본인 구글 계정 로그인 필요)
6. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfyc...`)

### 4단계: 프론트엔드 코드 업데이트

`components/RSVPModal.tsx` 파일에서 Google Apps Script URL을 변경하세요:

```typescript
// 132번째 줄 근처
const scriptUrl = 'YOUR_WEB_APP_URL_HERE'; // 복사한 웹 앱 URL로 교체
```

### 5단계: 테스트

1. 개발 서버 재시작: `npm run dev`
2. 참석 의사 전달 폼 작성 및 전송
3. 구글 스프레드시트에 데이터가 추가되는지 확인

**중요:** 코드를 수정한 후에는 Google Apps Script에서 **새 배포**를 생성해야 합니다.

---

## 🚀 Vercel/Netlify 배포 시 (선택사항)

Vercel이나 Netlify 등 서버리스 함수를 지원하는 플랫폼으로 배포하는 경우, Next.js API 라우트를 사용할 수 있습니다.

### 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 (예: "wedding-invitation")
3. **API 및 서비스 > 라이브러리** 에서 "Google Sheets API" 검색 후 활성화

### 2. 서비스 계정 생성

1. **API 및 서비스 > 사용자 인증 정보** 메뉴
2. **사용자 인증 정보 만들기 > 서비스 계정** 클릭
3. 서비스 계정 이름 입력 후 완료
4. 생성된 서비스 계정 클릭 > **키** 탭
5. **키 추가 > 새 키 만들기 > JSON** 선택하여 다운로드

### 3. 환경 변수 설정

다운로드한 JSON 파일의 내용을 `.env.local`에 추가:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id
```

### 4. 구글 스프레드시트 권한 부여

1. 스프레드시트 **공유** 버튼 클릭
2. 서비스 계정 이메일(`...@....iam.gserviceaccount.com`)을 **편집자** 권한으로 추가

### 5. 라이브러리 설치

```bash
npm install googleapis
```

### 6. API 라우트 활성화

`app/api/rsvp/route.ts` 파일의 주석 처리된 코드를 활성화하세요.

---

## 🔍 문제 해결

### 구글 시트에 저장이 안 돼요
- 서비스 계정 이메일이 스프레드시트에 편집자로 추가되었는지 확인
- Google Apps Script 웹 앱 URL이 올바른지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 코드를 수정했는데 변경사항이 반영되지 않아요
- Google Apps Script에서 **새 배포**를 생성해야 합니다
- 개발 서버를 재시작하세요: `npm run dev`

---

## 📦 배포 전 체크리스트

- [ ] Google Apps Script 웹 앱 URL이 프론트엔드 코드에 설정되어 있는지 확인
- [ ] 스프레드시트 ID가 Google Apps Script 코드에 설정되어 있는지 확인
- [ ] 실제 환경에서 RSVP 테스트

---

**문의사항이 있으시면 개발자에게 연락해주세요!** 🎉
