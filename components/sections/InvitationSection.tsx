'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface InvitationSectionProps {
  invitationMessage: string;
  groomFather: string;
  groomMother: string;
  groomName: string;
  brideFather: string;
  brideMother: string;
  brideName: string;
}

export default function InvitationSection({
  invitationMessage,
  groomFather,
  groomMother,
  groomName,
  brideFather,
  brideMother,
  brideName
}: InvitationSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <section ref={ref} className="py-20 px-6 relative">
      <div className="max-w-2xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
            초대합니다
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto" />
        </motion.div>

        {/* 초대 메시지 - Glassmorphism 카드 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 glass rounded-3xl p-8 md:p-10 shadow-xl"
        >
          <p className="text-gray-700 leading-relaxed text-center whitespace-pre-line text-sm md:text-base">
            {invitationMessage}
          </p>
        </motion.div>

        {/* 신랑신부 정보 - Glassmorphism 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-strong rounded-3xl p-8 md:p-10 shadow-xl space-y-8"
        >
          {/* 신랑 측 */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-rose-300" />
              <p className="text-sm text-gray-600 tracking-wider font-medium">GROOM</p>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-rose-300" />
            </div>
            <p className="text-gray-700 mb-2">
              <span className="text-sm">{groomFather}</span>
              <span className="mx-2 text-rose-300">·</span>
              <span className="text-sm">{groomMother}</span>
              <span className="text-gray-500 mx-2">의 아들</span>
            </p>
            <p className="text-2xl font-serif text-gray-800 font-semibold">{groomName}</p>
          </div>

          {/* 구분선 */}
          <div className="flex justify-center items-center gap-3 py-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-rose-400 shadow-lg" />
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
          </div>

          {/* 신부 측 */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-rose-300" />
              <p className="text-sm text-gray-600 tracking-wider font-medium">BRIDE</p>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-rose-300" />
            </div>
            <p className="text-gray-700 mb-2">
              <span className="text-sm">{brideFather}</span>
              <span className="mx-2 text-rose-300">·</span>
              <span className="text-sm">{brideMother}</span>
              <span className="text-gray-500 mx-2">의 딸</span>
            </p>
            <p className="text-2xl font-serif text-gray-800 font-semibold">{brideName}</p>
          </div>
        </motion.div>

        {/* 장식 요소 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <svg width="80" height="40" viewBox="0 0 80 40" className="text-rose-200">
            <path
              d="M 10,20 Q 20,10 30,20 T 50,20 T 70,20"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
