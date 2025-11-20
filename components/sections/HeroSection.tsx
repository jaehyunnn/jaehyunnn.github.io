'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue?: string;
  backgroundImage?: string;
}

export default function HeroSection({
  groomName,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  backgroundImage = '/images/hero-bg.jpg'
}: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 bg-cover bg-center">
        {/* 배경 이미지 - blur 효과 적용 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: backgroundImage.startsWith('http') || backgroundImage.startsWith('/images')
              ? `url(${backgroundImage})`
              : 'linear-gradient(135deg, #fdfcfb 0%, #f8f6f3 50%, #f5f3ef 100%)',
            filter: 'blur(3px)',
            transform: 'scale(1.1)' // blur로 인한 가장자리 잘림 방지
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-amber-900/10" />
      </div>

      {/* 콘텐츠 - 카드 없이 직접 배치 */}
      <div className="relative z-10 text-center px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p
            className="text-sm md:text-base tracking-[0.3em] mb-8 font-medium uppercase"
            style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)' }}
          >
            Wedding Invitation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-10"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-6"
            style={{
              fontFamily: 'var(--font-serif)',
              color: '#FFFEF9',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            {groomName} <span className="text-2xl md:text-3xl mx-3" style={{ color: '#FFB3D9' }}>&</span> {brideName}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <p
            className="text-base md:text-lg mb-2 font-medium"
            style={{ color: '#FFFEF9', textShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)' }}
          >
            {weddingDate}
          </p>
          <p
            className="text-sm md:text-base mb-2 font-medium"
            style={{ color: '#FFFEF9', textShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)' }}
          >
            {weddingTime}
          </p>
          {venue && (
            <p
              className="text-sm md:text-base font-medium"
              style={{ color: '#FFFEF9', textShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)' }}
            >
              {venue}
            </p>
          )}
        </motion.div>

        {/* 장식 요소 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12"
        >
          <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/60" />
            <div className="w-2 h-2 rounded-full bg-white/70 shadow-lg" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/60" />
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
          <p className="text-xs mb-2 tracking-[0.2em] font-light uppercase" style={{ color: '#FFFFFF', textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)' }}>Scroll</p>
          <ChevronDown className="w-6 h-6 text-white/90" />
        </motion.div>
      </motion.div>
    </section>
  );
}
