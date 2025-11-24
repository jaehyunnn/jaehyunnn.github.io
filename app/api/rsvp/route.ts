import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { side, name, attendance, guestCount, meal, message } = body;

    // TODO: 구글 스프레드시트 API 연동
    // 현재는 로깅만 수행
    console.log('RSVP 데이터:', {
      side,
      name,
      attendance,
      guestCount,
      meal,
      message,
      timestamp: new Date().toISOString(),
    });

    // 구글 시트 연동 예시 코드 (googleapis 라이브러리 필요)
    const { google } = require('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'RSVP!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            side === 'groom' ? '신랑 측' : '신부 측',
            name,
            attendance === 'attending' ? '참석' : attendance === 'not-attending' ? '불참' : '미정',
            guestCount || '',
            meal === 'meal' ? '식사 예정' : meal === 'gift' ? '답례품 수령' : '미정',
            message || '',
          ],
        ],
      },
    });


    return NextResponse.json({ success: true, message: 'RSVP 저장 완료' });
  } catch (error) {
    console.error('RSVP 저장 실패:', error);
    return NextResponse.json(
      { success: false, message: 'RSVP 저장 실패' },
      { status: 500 }
    );
  }
}
