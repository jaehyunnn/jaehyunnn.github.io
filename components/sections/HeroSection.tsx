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
            : 'linear-gradient(135deg, #ffc0cb 0%, #ffe4e1 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="text-white/90 text-sm md:text-base tracking-widest mb-4 font-light">
            WEDDING INVITATION
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-4">
            {groomName} <span className="text-2xl md:text-3xl mx-2">&</span> {brideName}
          </h1>
          <div className="w-16 h-px bg-white/60 mx-auto mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-white/95"
        >
          <p className="text-lg md:text-xl mb-2 font-light">{weddingDate}</p>
          <p className="text-base md:text-lg font-light">{weddingTime}</p>
        </motion.div>

        {/* 장식 요소 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12"
        >
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-px bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-8 h-px bg-white/40" />
          </div>
        </motion.div>
      </div>

      {/* 스크롤 안내 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/80"
        >
          <p className="text-xs mb-2 tracking-wider">SCROLL</p>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
