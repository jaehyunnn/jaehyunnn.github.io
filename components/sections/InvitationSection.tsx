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
    <section ref={ref} className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-gyeonggi), serif' }}>
            초대합니다
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto" />
        </motion.div>

        {/* 초대 메시지 - 카드 없이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <p className="text-amber-900/80 leading-loose text-center whitespace-pre-line text-base md:text-lg font-light">
            {invitationMessage}
          </p>
        </motion.div>

        {/* 신랑신부 정보 - 카드 없이 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-12"
        >
          {/* 신랑 측 */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-5">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
              <p className="text-sm text-amber-800/70 tracking-[0.3em] font-light uppercase">Groom</p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>
            <p className="text-amber-900/70 mb-3 text-base">
              <span>{groomFather}</span>
              <span className="mx-2 text-amber-400">·</span>
              <span>{groomMother}</span>
              <span className="text-amber-700/60 mx-2 text-sm">의 아들</span>
            </p>
            <p className="text-3xl text-amber-900 font-medium" style={{ fontFamily: 'var(--font-gyeonggi), serif' }}>{groomName}</p>
          </div>

          {/* 구분선 */}
          <div className="flex justify-center items-center gap-4 py-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          </div>

          {/* 신부 측 */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-5">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
              <p className="text-sm text-amber-800/70 tracking-[0.3em] font-light uppercase">Bride</p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>
            <p className="text-amber-900/70 mb-3 text-base">
              <span>{brideFather}</span>
              <span className="mx-2 text-amber-400">·</span>
              <span>{brideMother}</span>
              <span className="text-amber-700/60 mx-2 text-sm">의 딸</span>
            </p>
            <p className="text-3xl text-amber-900 font-medium" style={{ fontFamily: 'var(--font-gyeonggi), serif' }}>{brideName}</p>
          </div>
        </motion.div>

        {/* 장식 요소 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-amber-400/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <div className="w-1 h-1 rounded-full bg-amber-400/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
