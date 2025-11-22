'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface IntroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  onComplete: () => void;
  onInteract?: () => void;
  mainPhoto?: string;
}

export default function IntroSection({
  groomName,
  brideName,
  weddingDate,
  onComplete,
  onInteract,
  mainPhoto
}: IntroSectionProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleComplete = () => {
    if (onInteract) onInteract(); // BGM 재생
    setIsVisible(false);
    setTimeout(onComplete, 1200); // Wait for exit animation
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) { // 최소 스크롤 임계값
        handleComplete();
      }
    };

    const handleTouch = () => {
      handleComplete();
    };

    // 이벤트 리스너 등록
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isVisible ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className={`fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-between bg-[#fbfaf8] overflow-hidden cursor-pointer ${!isVisible ? 'pointer-events-none' : ''}`}
      onClick={handleComplete}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap');
      `}</style>

      {/* Top Spacer */}
      <div className="h-[5dvh]" />

      <div className="w-full max-w-md md:max-w-2xl mx-auto px-6 relative flex-1 flex flex-col items-center">

        {/* Title - Large & Overlay */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-20 relative w-full"
        >
          <h1 className="text-[17vw] md:text-[140px] text-amber-950 leading-[0.9] tracking-tight whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif" }}>
            <span className="block">{groomName.toUpperCase()}</span>
            <span className="block">& {brideName.toUpperCase()}</span>
          </h1>
        </motion.div>

        {/* Main Photo - Overlapped by Title */}
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-[70%] md:w-[50%] aspect-[3/4] max-h-[55vh] -mt-[6vw] md:-mt-[50px] z-10 mx-auto"
        >
          <div className="absolute inset-0 bg-stone-200" />
          {mainPhoto && (
            <Image
              src={mainPhoto}
              alt="Wedding Couple"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              priority
            />
          )}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center w-full z-10 mt-auto pb-12"
        >
          <p className="text-xs tracking-[0.3em] text-stone-500 mb-6 uppercase">
            Wedding Invitation
          </p>

          <div className="w-full max-w-[200px] mx-auto text-[10px] md:text-xs text-stone-600 leading-relaxed font-light tracking-wider mb-8">
            <p>WE JOYFULLY INVITE YOU</p>
            <p>TO SHARE IN OUR CELEBRATION</p>
            <p>OF LOVE AND COMMITMENT</p>
          </div>

          <div className="w-full h-px bg-stone-300 mb-6" />

          {/* 스크롤 유도 UI */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-[10px] text-stone-400 tracking-[0.3em] uppercase">
              Scroll to Start
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-stone-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
