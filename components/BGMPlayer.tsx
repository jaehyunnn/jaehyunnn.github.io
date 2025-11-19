'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BGMPlayerProps {
  audioSrc?: string;
  autoPlay?: boolean;
}

export default function BGMPlayer({ audioSrc = '/audio/bgm.mp3', autoPlay = false }: BGMPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    if (autoPlay && !isPlaying) {
      // 즉시 자동재생 시도
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('자동재생이 차단되었습니다:', error);
        }
      };

      // 페이지 로드 시 즉시 재생 시도
      playAudio();
    }
  }, [autoPlay, volume, isPlaying]);

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('재생 오류:', error);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      >
        <div
          className="relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* 메인 컨트롤 버튼 - Enhanced Glassmorphism */}
          <motion.button
            onClick={togglePlay}
            className="glass-strong shadow-2xl rounded-full p-4 hover:glass transition-all duration-300 hover:shadow-[0_20px_50px_rgba(251,113,133,0.4)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
              className="absolute inset-0 rounded-full border-2 border-rose-300/50"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {/* 확장 컨트롤 - Glassmorphism */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 glass-strong shadow-xl rounded-full px-4 py-2 flex items-center gap-3"
              >
                {/* 음소거 버튼 */}
                <button
                  onClick={toggleMute}
                  className="hover:scale-110 transition-transform"
                  aria-label={isMuted ? '음소거 해제' : '음소거'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-gray-700" />
                  )}
                </button>

                {/* 볼륨 슬라이더 */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/40 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="볼륨 조절"
                />

                <Music className="w-4 h-4 text-rose-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #f43f5e;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #f43f5e;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
}
