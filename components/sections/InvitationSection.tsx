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

  // NanumLetter 폰트 로드
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'NanumLetter';
        src: url('/fonts/NanumLetter.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
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
          <div className="text-amber-900/80 leading-loose text-center text-lg md:text-xl font-light" style={{ fontFamily: "'NanumLetter', sans-serif" }}>
            {invitationMessage.split('\n').map((line, index, array) => {
              // 마지막 줄 처리 - serif 폰트 적용
              if (index === array.length - 1 && line.includes('소중한 분들을 초대합니다')) {
                return (
                  <p key={index} className="text-amber-900 font-semibold mt-4" style={{ fontFamily: 'var(--font-serif)' }}>
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
                      <span key={i} className="font-semibold">{part}</span>
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
          <div className="text-center border-r border-amber-300/30 pr-2 md:pr-8">
            <div className="flex justify-center items-center gap-1 md:gap-3 mb-3 md:mb-5">
              <div className="w-6 md:w-12 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
              <p className="text-xs md:text-sm text-amber-800/70 tracking-[0.2em] md:tracking-[0.3em] font-light uppercase">Groom</p>
              <div className="w-6 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>
            <p className="text-amber-900/70 mb-2 md:mb-3 text-xs md:text-base">
              <span className="block md:inline">{groomFather} · {groomMother}</span>
              <span className="block md:inline text-amber-700/60 mx-0 md:mx-2 text-xs md:text-sm">의 장남</span>
            </p>
            <p className="text-xl md:text-3xl text-amber-900 font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{groomName}</p>
          </div>

          {/* 신부 측 */}
          <div className="text-center pl-2 md:pl-8">
            <div className="flex justify-center items-center gap-1 md:gap-3 mb-3 md:mb-5">
              <div className="w-6 md:w-12 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
              <p className="text-xs md:text-sm text-amber-800/70 tracking-[0.2em] md:tracking-[0.3em] font-light uppercase">Bride</p>
              <div className="w-6 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>
            <p className="text-amber-900/70 mb-2 md:mb-3 text-xs md:text-base">
              <span className="block md:inline">{brideFather} · {brideMother}</span>
              <span className="block md:inline text-amber-700/60 mx-0 md:mx-2 text-xs md:text-sm">의 장녀</span>
            </p>
            <p className="text-xl md:text-3xl text-amber-900 font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{brideName}</p>
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
