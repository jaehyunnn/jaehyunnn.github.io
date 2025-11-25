'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyHeaderProps {
  groomName: string;
  brideName: string;
}

export default function StickyHeader({ groomName, brideName }: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hero 섹션 높이(100vh) 이후에 표시
      const heroHeight = window.innerHeight;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/50"
          style={{
            fontFamily: "'Noto Serif KR', serif",
          }}
        >
          <div className="flex items-center justify-center py-2.5">
            <span className="text-xs tracking-[0.2em] text-stone-500 font-medium">
              {groomName}
              <span className="mx-2 text-stone-300">|</span>
              {brideName}
            </span>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
