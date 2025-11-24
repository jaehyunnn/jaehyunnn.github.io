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
            className="glass backdrop-blur-xl bg-white/60 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full px-8 py-4 flex items-center gap-3 mx-auto hover:bg-white/70 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-medium text-stone-800 tracking-wide">
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
            카카오톡으로 간편하게 전달하실 수 있습니다
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
