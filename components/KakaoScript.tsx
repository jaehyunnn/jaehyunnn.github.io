'use client';

import { useEffect } from 'react';

export default function KakaoScript() {
  useEffect(() => {
    const initKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // TODO: 카카오 개발자 센터에서 발급받은 JavaScript 키로 교체하세요
        const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || 'YOUR_KAKAO_JS_KEY';
        window.Kakao.init(KAKAO_JS_KEY);
        console.log('Kakao SDK 초기화 완료:', window.Kakao.isInitialized());
      }
    };

    // SDK 로드 대기
    if (window.Kakao) {
      initKakao();
    } else {
      const script = document.querySelector('script[src*="kakao"]');
      if (script) {
        script.addEventListener('load', initKakao);
      }
    }
  }, []);

  return null;
}
