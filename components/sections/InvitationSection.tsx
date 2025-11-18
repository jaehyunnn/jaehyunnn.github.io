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
    <section ref={ref} className="py-20 px-6 bg-white">
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
          <div className="w-12 h-px bg-rose-300 mx-auto" />
        </motion.div>

        {/* 초대 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <p className="text-gray-700 leading-relaxed text-center whitespace-pre-line text-sm md:text-base">
            {invitationMessage}
          </p>
        </motion.div>

        {/* 신랑신부 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          {/* 신랑 측 */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="w-8 h-px bg-rose-200" />
              <p className="text-sm text-gray-500 tracking-wider">GROOM</p>
              <div className="w-8 h-px bg-rose-200" />
            </div>
            <p className="text-gray-700 mb-2">
              <span className="text-sm">{groomFather}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-sm">{groomMother}</span>
              <span className="text-gray-400 mx-2">의 아들</span>
            </p>
            <p className="text-2xl font-serif text-gray-800">{groomName}</p>
          </div>

          {/* 구분선 */}
          <div className="flex justify-center items-center gap-3 py-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
          </div>

          {/* 신부 측 */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="w-8 h-px bg-rose-200" />
              <p className="text-sm text-gray-500 tracking-wider">BRIDE</p>
              <div className="w-8 h-px bg-rose-200" />
            </div>
            <p className="text-gray-700 mb-2">
              <span className="text-sm">{brideFather}</span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-sm">{brideMother}</span>
              <span className="text-gray-400 mx-2">의 딸</span>
            </p>
            <p className="text-2xl font-serif text-gray-800">{brideName}</p>
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
