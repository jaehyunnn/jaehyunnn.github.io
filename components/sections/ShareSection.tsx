'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Share2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ShareSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime?: string;
  venue?: string;
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
  weddingTime,
  venue,
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

    // 절대 URL 생성
    const origin = window.location.origin;
    const absoluteImageUrl = thumbnailImage
      ? (thumbnailImage.startsWith('http') ? thumbnailImage : `${origin}${thumbnailImage}`)
      : `${origin}/images/hero-bg.jpg`;

    // description 생성
    const shareDescription = description || `${weddingDate} ${weddingTime} · ${venue}`;

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: `${groomName} ❤️ ${brideName}의 결혼식에 초대합니다.`,
        description: shareDescription,
        imageUrl: absoluteImageUrl,
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
          title: `${groomName} ❤️ ${brideName} 결혼식에 초대합니다.`,
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
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
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
          className="grid grid-cols-3 gap-2"
        >
          {/* 카카오톡 공유 */}
          <button
            onClick={shareKakao}
            className="flex flex-col items-center justify-center gap-1.5 glass-strong hover:glass text-amber-900 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-amber-200/30"
          >
            <Image src="/icons/kakao_talk.webp" alt="카카오톡" width={20} height={20} />
            <span className="text-xs font-medium">카톡 공유</span>
          </button>

          {/* 네이티브 공유 (모바일에서만 작동) */}
          <button
            onClick={shareNative}
            className="flex flex-col items-center justify-center gap-1.5 glass-strong hover:glass text-amber-900 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-amber-200/30"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">공유 하기</span>
          </button>

          {/* URL 복사 */}
          <button
            onClick={copyUrl}
            className="flex flex-col items-center justify-center gap-1.5 glass-strong hover:glass text-amber-900 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-amber-200/30"
          >
            {urlCopied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">복사 완료</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-xs font-medium">링크 복사</span>
              </>
            )}
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
