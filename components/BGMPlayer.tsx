'use client';

import { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BGMPlayerProps {
  audioSrc?: string;
  autoPlay?: boolean;
}

export default function BGMPlayer({ audioSrc = '/audio/bgm.mp3', autoPlay = false }: BGMPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 초기 볼륨 설정 (고정값)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3; // 30% 볼륨으로 고정
    console.log('[BGM] 초기 볼륨 설정: 30%');
  }, []);

  // 자동재생 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    if (!autoPlay) {
      console.log('[BGM] 자동재생 비활성화됨');
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      console.log('[BGM] Audio 요소를 찾을 수 없음');
      return;
    }

    const attemptAutoplay = async () => {
      console.log('[BGM] 자동재생 시도 중...');
      try {
        // 먼저 unmuted로 재생 시도
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
        console.log('[BGM] ✅ 자동재생 성공 (unmuted)');
      } catch (error) {
        console.log('[BGM] ⚠️ unmuted 자동재생 실패, muted로 재시도:', error);
        // 실패하면 muted로 재생 시도
        try {
          audio.muted = true;
          await audio.play();
          setIsPlaying(true);
          console.log('[BGM] ✅ 음소거 상태로 자동재생 성공');

          // muted 상태로 재생된 경우, 바로 unmute
          setTimeout(() => {
            audio.muted = false;
            console.log('[BGM] 음소거 해제됨');
          }, 100);
        } catch (mutedError) {
          console.log('[BGM] ❌ 자동재생 완전히 차단됨 (iOS일 가능성 높음):', mutedError);
          setIsPlaying(false);
          setAutoplayFailed(true);
        }
      }
    };

    // audio가 로드될 때까지 대기
    if (audio.readyState >= 2) {
      console.log('[BGM] Audio 준비됨, 즉시 자동재생 시도');
      attemptAutoplay();
    } else {
      console.log('[BGM] Audio 로딩 중, canplay 이벤트 대기');
      audio.addEventListener('canplay', attemptAutoplay, { once: true });
    }

    return () => {
      audio.removeEventListener('canplay', attemptAutoplay);
    };
  }, [autoPlay]);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[BGM] 버튼 클릭됨');

    // 자동재생 실패 상태 초기화
    if (autoplayFailed) {
      setAutoplayFailed(false);
    }

    const audio = audioRef.current;
    if (!audio) {
      console.log('[BGM] ❌ Audio 요소를 찾을 수 없음');
      return;
    }

    console.log('[BGM] 현재 상태 - isPlaying:', isPlaying, ', audio.paused:', audio.paused);

    try {
      if (isPlaying) {
        console.log('[BGM] 일시정지 시도...');
        audio.pause();
        console.log('[BGM] ✅ pause() 호출 완료');
      } else {
        console.log('[BGM] 재생 시도...');
        // 재생 시 음소거 해제
        audio.muted = false;
        await audio.play();
        console.log('[BGM] ✅ play() 호출 완료');
      }
    } catch (error) {
      console.error('[BGM] ❌ 재생/일시정지 오류:', error);
    }
  };

  // Audio 이벤트 핸들러 - 상태 동기화
  const handlePlay = () => {
    console.log('[BGM] 🎵 onPlay 이벤트 발생');
    setIsPlaying(true);
  };

  const handlePause = () => {
    console.log('[BGM] ⏸️ onPause 이벤트 발생');
    setIsPlaying(false);
  };

  const handleEnded = () => {
    console.log('[BGM] 🔚 onEnded 이벤트 발생');
    setIsPlaying(false);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      />

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      >
        {/* 메인 컨트롤 버튼 - Enhanced Glassmorphism */}
        <motion.button
          onClick={togglePlay}
          className="glass-strong shadow-2xl rounded-full p-4 hover:glass transition-all duration-300 hover:shadow-[0_20px_50px_rgba(251,113,133,0.4)] relative z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={autoplayFailed ? { scale: [1, 1.1, 1] } : {}}
          transition={autoplayFailed ? { duration: 1.5, repeat: Infinity } : {}}
          aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Pause className="w-6 h-6 text-rose-600" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="w-6 h-6 text-rose-600 ml-0.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* 재생 중 애니메이션 링 */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-rose-300/50 pointer-events-none"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* 자동재생 실패 시 알림 링 */}
        {autoplayFailed && !isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-400/60 pointer-events-none"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </>
  );
}
