// Google Apps Script 코드
// 이 코드를 https://script.google.com/ 에 복사하여 사용하세요

// CORS를 지원하기 위한 doGet 함수 (GET 요청 사용)
function doGet(e) {
  try {
    // JSONP 지원을 위한 callback 파라미터 확인
    const callback = e.parameter.callback;

    // 데이터 파싱
    let data;
    if (e.parameter.data) {
      data = JSON.parse(decodeURIComponent(e.parameter.data));
    } else {
      throw new Error('데이터가 없습니다');
    }

    // 스프레드시트 ID (여기에 본인의 스프레드시트 ID 입력)
    const SHEET_ID = 'YOUR_SHEET_ID_HERE';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('RSVP');

    if (!sheet) {
      throw new Error('RSVP 시트를 찾을 수 없습니다');
    }

    // 데이터 추가
    const timestamp = new Date();
    const side = data.side === 'groom' ? '신랑 측' : '신부 측';
    const attendance =
      data.attendance === 'attending' ? '참석' :
      data.attendance === 'not-attending' ? '불참' : '미정';
    const meal =
      data.meal === 'meal' ? '식사 예정' :
      data.meal === 'gift' ? '답례품 수령' : '미정';

    sheet.appendRow([
      timestamp,
      side,
      data.name || '',
      attendance,
      data.guestCount || '',
      meal,
      data.message || ''
    ]);

    // 성공 응답
    const response = {
      success: true,
      message: 'RSVP가 성공적으로 저장되었습니다',
      timestamp: timestamp.toISOString()
    };

    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // JSONP 콜백이 있으면 JSONP 형식으로 반환
    if (callback) {
      return output.setContent(callback + '(' + JSON.stringify(response) + ')');
    } else {
      return output.setContent(JSON.stringify(response));
    }

  } catch (error) {
    // 에러 응답
    const errorResponse = {
      success: false,
      message: error.toString()
    };

    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // JSONP 콜백이 있으면 JSONP 형식으로 반환
    const callback = e && e.parameter ? e.parameter.callback : null;
    if (callback) {
      return output.setContent(callback + '(' + JSON.stringify(errorResponse) + ')');
    } else {
      return output.setContent(JSON.stringify(errorResponse));
    }
  }
}
