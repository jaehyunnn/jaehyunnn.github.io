'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

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

  // Google Fonts 로드 (Noto Serif KR)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <section ref={ref} className="py-24 px-6 relative bg-[#fbfaf8]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
      <div className="max-w-3xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl text-amber-900/80 tracking-[0.2em] uppercase mb-3">
            Invitation
          </h2>
          <div className="text-2xl md:text-4xl text-amber-950 font-medium mb-6">
            <span className="block md:hidden">소중한 초대</span>
            <span className="hidden md:block">소중한 분들을 초대합니다</span>
          </div>
        </motion.div>

        {/* 초대 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="text-stone-600 leading-loose text-center text-base md:text-lg font-light">
            {invitationMessage.split('\n').map((line, index, array) => {
              // 마지막 줄 처리
              if (index === array.length - 1 && line.includes('소중한 분들을 초대합니다')) {
                return (
                  <p key={index} className="text-amber-900 font-medium mt-6">
                    {line}
                  </p>
                );
              }

              // 빈 줄 처리
              if (line.trim() === '') {
                return <p key={index} className="h-4">&nbsp;</p>;
              }

              // 특정 단어 볼드 처리
              const boldWords = ['우연', '필연', '함께'];
              const parts = line.split(new RegExp(`(${boldWords.map(w => `'${w}'`).join('|')})`));

              return (
                <p key={index} className="mb-2">
                  {parts.map((part, i) =>
                    boldWords.some(word => part === `'${word}'`) ? (
                      <span key={i} className="font-medium text-stone-800">{part}</span>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </div>
        </motion.div>

        {/* 신랑신부 정보 - 좌우 배치 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 gap-4 md:gap-8"
        >
          {/* 신랑 측 */}
          <div className="text-center border-r border-stone-200 pr-2 md:pr-8">
            <div className="flex justify-center items-center gap-1 md:gap-3 mb-4">
              <p className="text-xs md:text-sm text-stone-400 tracking-[0.2em] font-medium uppercase">Groom</p>
            </div>
            <p className="text-stone-500 mb-3 text-sm md:text-base">
              <span className="block md:inline">{groomFather} · {groomMother}</span>
              <span className="block md:inline text-stone-400 mx-0 md:mx-2 text-xs md:text-sm">의 장남</span>
            </p>
            <p className="text-xl md:text-2xl text-amber-950 font-medium">{groomName}</p>
          </div>

          {/* 신부 측 */}
          <div className="text-center pl-2 md:pl-8">
            <div className="flex justify-center items-center gap-1 md:gap-3 mb-4">
              <p className="text-xs md:text-sm text-stone-400 tracking-[0.2em] font-medium uppercase">Bride</p>
            </div>
            <p className="text-stone-500 mb-3 text-sm md:text-base">
              <span className="block md:inline">{brideFather} · {brideMother}</span>
              <span className="block md:inline text-stone-400 mx-0 md:mx-2 text-xs md:text-sm">의 장녀</span>
            </p>
            <p className="text-xl md:text-2xl text-amber-950 font-medium">{brideName}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
