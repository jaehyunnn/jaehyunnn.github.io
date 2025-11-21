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
            filter: 'blur(2px)',
            transform: 'scale(1.05)' // blur로 인한 가장자리 잘림 방지
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 콘텐츠 - 카드 없이 직접 배치 */}
      <div className="relative z-10 text-center px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p
            className="text-sm md:text-base tracking-[0.3em] mb-8 font-light uppercase text-white/90"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            Wedding Invitation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white"
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            {groomName} <span className="text-2xl md:text-3xl mx-2 text-white/80 font-light">|</span> {brideName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="space-y-3"
        >
          <p
            className="text-lg md:text-xl font-medium text-white"
            style={{ fontFamily: "'Noto Serif KR', serif", letterSpacing: '0.05em' }}
          >
            {weddingDate}
          </p>
          <div className="w-8 h-px bg-white/40 mx-auto my-4" />
          <p
            className="text-base md:text-lg font-light text-white/90"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {weddingTime}
          </p>
          {venue && (
            <p
              className="text-base md:text-lg font-light text-white/90"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {venue}
            </p>
          )}
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
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-[10px] tracking-[0.2em] font-light uppercase text-white/70">Scroll</p>
          <div className="w-px h-8 bg-gradient-to-b from-white/80 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
