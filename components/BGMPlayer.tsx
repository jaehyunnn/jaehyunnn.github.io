'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Pause, Play, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BGMPlayerProps {
  audioSrc?: string;
  autoPlay?: boolean;
}

export interface BGMPlayerHandle {
  play: () => Promise<void>;
}

const BGMPlayer = forwardRef<BGMPlayerHandle, BGMPlayerProps>(({ audioSrc = '/audio/bgm.mp3', autoPlay = false }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 부모 컴포넌트에서 제어할 수 있도록 play 함수 노출
  useImperativeHandle(ref, () => ({
    play: async () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
        console.log('[BGM] 외부 요청으로 재생 성공');
      } catch (error) {
        console.error('[BGM] 외부 요청 재생 실패:', error);
      }
    }
  }));

  // 초기 볼륨 설정 (고정값)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3; // 30% 볼륨으로 고정
    console.log('[BGM] 초기 볼륨 설정: 30%');
  }, []);

  // 자동재생 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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

          // iOS 등에서 muted autoplay 후 사용자 인터랙션 시 음소거 해제 시도
          const unmuteOnInteraction = () => {
            if (audio.muted) {
              audio.muted = false;
              console.log('[BGM] 사용자 인터랙션으로 음소거 해제됨');
              // 이벤트 리스너 제거
              ['click', 'touchstart', 'scroll'].forEach(event =>
                document.removeEventListener(event, unmuteOnInteraction)
              );
            }
          };

          ['click', 'touchstart', 'scroll'].forEach(event =>
            document.addEventListener(event, unmuteOnInteraction, { once: true })
          );

        } catch (mutedError) {
          console.log('[BGM] ❌ 자동재생 완전히 차단됨 (iOS일 가능성 높음):', mutedError);
          setIsPlaying(false);
          setAutoplayFailed(true);
        }
      }
    };

    if (autoPlay) {
      if (audio.readyState >= 2) {
        attemptAutoplay();
      } else {
        audio.addEventListener('canplay', attemptAutoplay, { once: true });
      }
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

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* 맨 위로 가기 버튼 */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              className="glass backdrop-blur-xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              aria-label="맨 위로 가기"
            >
              <ChevronUp className="w-5 h-5 text-stone-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* BGM 플레이어 버튼 */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        >
          <motion.button
            onClick={togglePlay}
            className="glass backdrop-blur-xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(251,113,133,0.3)] relative z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
                  <Pause className="w-5 h-5 text-rose-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-5 h-5 text-rose-600 ml-0.5" />
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
      </div>
    </>
  );
});

BGMPlayer.displayName = 'BGMPlayer';

export default BGMPlayer;
