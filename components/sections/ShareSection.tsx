'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Share2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShareSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  thumbnailImage?: string;
  description?: string;
}

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function ShareSection({
  groomName,
  brideName,
  weddingDate,
  thumbnailImage,
  description
}: ShareSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [urlCopied, setUrlCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // 카카오 SDK 로드
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // 실제 사용시 YOUR_KAKAO_APP_KEY를 카카오 앱 키로 교체하세요
        window.Kakao.init('3cd74c7f5d1d79108ec506779a38c9db');
        // console.log('카카오 SDK 로드 완료. 실제 사용을 위해서는 카카오 앱 키가 필요합니다.');
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const shareKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오톡 공유를 위해서는 카카오 앱 키 설정이 필요합니다.');
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: `${groomName} ❤️ ${brideName} 결혼합니다`,
        description: description || `${weddingDate}에 저희 두 사람이 결혼합니다.\n참석하셔서 축복해 주시면 감사하겠습니다.`,
        imageUrl: thumbnailImage || 'https://via.placeholder.com/800x600?text=Wedding+Invitation',
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
      buttons: [
        {
          title: '청첩장 보러가기',
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
      ],
    });
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      alert('URL 복사에 실패했습니다.');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${groomName} ❤️ ${brideName} 결혼합니다`,
          text: description || `${weddingDate}에 저희 두 사람이 결혼합니다.`,
          url: currentUrl,
        });
      } catch (err) {
        console.log('공유 취소됨');
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <section ref={ref} className="py-20 px-6 relative">
      <div className="max-w-2xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
            Share
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-4" />
          <p className="text-gray-600 text-sm">
            소중한 분들과 함께 이 기쁨을 나누고 싶습니다
          </p>
        </motion.div>

        {/* 공유 버튼들 - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {/* 카카오톡 공유 */}
          <button
            onClick={shareKakao}
            className="w-full flex items-center justify-center gap-3 glass-strong hover:glass text-yellow-700 font-semibold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-.602l.387-.376 1.558 1.903a.472.472 0 0 0 .733-.596l-1.564-1.77zm-2.342 1.878h-1.378V9.297a.472.472 0 0 0-.943 0v4.114c0 .261.21.472.471.472h1.85a.472.472 0 1 0 0-.943zm-5.806-1.61l.001-2.345a.472.472 0 1 0-.943 0v2.345a.471.471 0 0 0 0 .222V13.5a.472.472 0 1 0 .943 0v-.602l1.957 1.895a.472.472 0 1 0 .656-.678l-2.614-2.533zm-2.987 1.61H5.5V9.297a.472.472 0 0 0-.943 0v4.114c0 .261.21.472.471.472h1.85a.472.472 0 1 0 0-.943z"/>
            </svg>
            카카오톡으로 공유하기
          </button>

          {/* URL 복사 */}
          <button
            onClick={copyUrl}
            className="w-full flex items-center justify-center gap-3 glass-strong hover:glass text-blue-700 font-semibold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {urlCopied ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                링크가 복사되었습니다
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                링크 복사하기
              </>
            )}
          </button>

          {/* 네이티브 공유 (모바일에서만 작동) */}
          <button
            onClick={shareNative}
            className="w-full flex items-center justify-center gap-3 glass-strong hover:glass text-rose-600 font-semibold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            공유하기
          </button>
        </motion.div>

        {/* 안내 문구 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            축하의 마음을 함께 나눠주세요
          </p>
        </motion.div>
      </div>
    </section>
  );
}
