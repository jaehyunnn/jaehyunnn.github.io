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
      // alert('카카오톡 공유를 위해서는 카카오 앱 키 설정이 필요합니다.');
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
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-gyeonggi), serif' }}>
            Share
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-4" />
          <p className="text-amber-800/70 text-sm font-light">
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
            className="w-full flex items-center justify-center gap-3 font-medium py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
          >
            {/* 카카오톡 공식 아이콘 */}
            <svg className="w-6 h-6" viewBox="0 0 208 191" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M104 0C46.5618 0 0 36.793 0 82.1312C0 107.546 16.4309 130.003 41.5247 143.503L32.8937 178.558C32.2672 181.059 32.9218 183.715 34.6346 185.674C36.3474 187.634 38.9061 188.618 41.5247 188.113L85.3737 179.786C91.4948 180.712 97.7181 181.162 104 181.162C161.438 181.162 208 144.369 208 99.031C208 53.6929 161.438 16.8998 104 16.8998V0Z" fill="#3C1E1E"/>
            </svg>
            카카오톡으로 공유하기
          </button>

          {/* URL 복사 */}
          <button
            onClick={copyUrl}
            className="w-full flex items-center justify-center gap-3 glass-strong hover:glass text-amber-900 font-medium py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-amber-200/30"
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
            className="w-full flex items-center justify-center gap-3 glass-strong hover:glass text-amber-900 font-medium py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-amber-200/30"
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
          <p className="text-sm text-amber-800/60 font-light">
            축하의 마음을 함께 나눠주세요
          </p>
        </motion.div>
      </div>
    </section>
  );
}
