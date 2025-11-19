'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  backgroundImage?: string;
}

export default function HeroSection({
  groomName,
  brideName,
  weddingDate,
  weddingTime,
  backgroundImage = '/images/hero-bg.jpg'
}: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage.startsWith('http') || backgroundImage.startsWith('/images')
            ? `url(${backgroundImage})`
            : 'linear-gradient(135deg, #fdfcfb 0%, #f8f6f3 50%, #f5f3ef 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-amber-900/10" />
      </div>

      {/* 콘텐츠 - 카드 없이 직접 배치 */}
      <div className="relative z-10 text-center px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="text-amber-800/80 text-sm md:text-base tracking-[0.3em] mb-8 font-light uppercase">
            Wedding Invitation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-amber-900 font-serif mb-6" style={{ fontFamily: 'var(--font-gyeonggi), serif' }}>
            {groomName} <span className="text-3xl md:text-4xl mx-3 text-amber-600">&</span> {brideName}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-amber-900/90"
        >
          <p className="text-xl md:text-2xl mb-3 font-light">{weddingDate}</p>
          <p className="text-lg md:text-xl font-light">{weddingTime}</p>
        </motion.div>

        {/* 장식 요소 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12"
        >
          <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60 shadow-lg" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </motion.div>
      </div>

      {/* 스크롤 안내 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <p className="text-xs mb-2 tracking-[0.2em] text-amber-800/70 font-light uppercase">Scroll</p>
          <ChevronDown className="w-6 h-6 text-amber-600/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
