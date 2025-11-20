'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';

interface CalendarSectionProps {
  year: number;
  month: number;
  day: number;
}

export default function CalendarSection({ year, month, day }: CalendarSectionProps) {
  // Google Fonts 로드
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  // 해당 월의 첫 날과 마지막 날 계산
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)

  // D-Day 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 제거
  const weddingDate = new Date(year, month - 1, day);
  weddingDate.setHours(0, 0, 0, 0);
  const daysUntilWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 달력 배열 생성
  const calendar: (number | null)[] = [];

  // 첫 주의 빈 칸 추가
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendar.push(null);
  }

  // 날짜 추가
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push(i);
  }

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <section className="py-16 px-6 relative" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl text-amber-900 mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Wedding Day
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 shadow-2xl border-2 border-amber-200/30"
        >
          {/* 년월 표시 */}
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl font-semibold text-amber-900 mb-2">
              {year}년 {monthNames[month - 1]}
            </p>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mx-auto mt-3" />
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center font-medium text-sm py-2 ${
                  index === 0 ? 'text-rose-500' : index === 6 ? 'text-blue-500' : 'text-amber-800/70'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {calendar.map((date, index) => {
              const dayOfWeek = index % 7;
              const isWeddingDay = date === day;
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.01 }}
                  className="aspect-square flex items-center justify-center relative"
                >
                  {date !== null && (
                    <>
                      <p
                        className={`
                          font-medium transition-all relative z-10
                          ${
                            isWeddingDay
                              ? 'text-lg md:text-xl text-rose-600 font-semibold'
                              : isSunday
                              ? 'text-rose-500'
                              : isSaturday
                              ? 'text-blue-500'
                              : 'text-amber-900/80'
                          }
                        `}
                      >
                        {date}
                      </p>
                      {/* 예식일에만 손으로 그린 동그라미 */}
                      {isWeddingDay && (
                        <motion.div
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="relative w-full h-full" style={{ transform: 'scale(1.2)' }}>
                            <Image
                              src="/icons/red_circle.png"
                              alt="Wedding Day"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 예식일 강조 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 shadow-md border border-rose-300/30">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-amber-900 font-medium">
                {year}년 {month}월 {day}일 일요일
              </p>
            </div>

            {/* D-Day 표시 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6"
            >
              {daysUntilWedding === 0 ? (
                <p className="text-xl font-semibold text-rose-500">
                  바로 오늘이에요. 💕
                </p>
              ) : daysUntilWedding > 0 ? (
                <p className="text-lg text-amber-900">
                  <span className="text-3xl font-bold text-pink-300 mx-1">
                    {daysUntilWedding}
                  </span>
                  일 남았어요.
                </p>
              ) : (
                <p className="text-lg text-amber-800/70">
                  소중한 추억이 되었습니다.
                </p>
              )}
            </motion.div>

            <p className="text-amber-800/70 text-sm mt-4 font-light">
              저희 두 사람의 소중한 순간에 함께 해주세요
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
