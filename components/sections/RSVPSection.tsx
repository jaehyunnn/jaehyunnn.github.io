'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check } from 'lucide-react';
import { useState } from 'react';
import RSVPModal from '../RSVPModal';

interface RSVPSectionProps {
  groomName: string;
  brideName: string;
}

export default function RSVPSection({ groomName, brideName }: RSVPSectionProps) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      ref={ref}
      className="py-20 px-6 relative bg-gradient-to-b from-[#fbfaf8] to-[#f5f3ef]"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* 타이틀 */}
          <div className="mb-12">
            <div className="w-8 h-px bg-stone-300 mx-auto mb-6" />
            <h2 className="text-2xl font-medium text-amber-950 mb-3 tracking-wider">
              참석 여부 전달
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed tracking-wide">
              소중한 시간 내어 참석해 주신다면
              <br />
              큰 기쁨이 되겠습니다
            </p>
          </div>

          {/* 버튼 */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="backdrop-blur-sm bg-white/70 border border-stone-200/80 rounded-full px-8 py-4 flex items-center gap-3 mx-auto hover:bg-white/90 hover:border-stone-300 transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 flex items-center justify-center group-hover:bg-white transition-all duration-300 shadow-sm">
              <Check className="w-5 h-5 text-stone-500" strokeWidth={2} />
            </div>
            <span className="text-base font-medium text-stone-700 tracking-wide">
              참석 의사 전달하기
            </span>
          </motion.button>

          {/* 안내 문구 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-xs text-stone-400 tracking-wider"
          >
            참석여부를 간편하게 전달하실 수 있습니다
          </motion.p>
        </motion.div>
      </div>

      {/* RSVP 모달 */}
      <RSVPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groomName={groomName}
        brideName={brideName}
      />
    </section>
  );
}
