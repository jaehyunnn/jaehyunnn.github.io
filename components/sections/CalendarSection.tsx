'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';

interface CalendarSectionProps {
  year: number;
  month: number;
  day: number;
  date: string;
  time: string;
}

export default function CalendarSection({ year, month, day, date, time }: CalendarSectionProps) {
  // Google Fonts 로드
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&display=swap';
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

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <section className="py-20 px-6 relative bg-[#fbfaf8]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl text-amber-900/80 tracking-[0.2em] uppercase mb-10">
            Wedding Day
          </h2>
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-stone-400 text-xs mb-2 tracking-widest uppercase">Date</p>
              <p className="text-xl md:text-2xl text-amber-950 font-medium">{date}</p>
            </div>
            <div className="w-px h-4 bg-stone-300/50 hidden" />
            <div className="text-center">
              <p className="text-stone-400 text-xs mb-2 tracking-widest uppercase">Time</p>
              <p className="text-xl md:text-2xl text-amber-950 font-medium">{time}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/40 backdrop-blur-sm rounded-sm p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-200/50"
        >
          {/* 년월 표시 */}
          <div className="text-center mb-10">
            <p className="text-xl text-amber-900/90 font-medium tracking-widest uppercase border-b border-stone-200 inline-block pb-2 px-4">
              {monthNames[month - 1]}
            </p>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-[0.7rem] tracking-widest font-medium ${index === 0 ? 'text-rose-400' : 'text-stone-400'
                  }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-2">
            {calendar.map((date, index) => {
              const dayOfWeek = index % 7;
              const isWeddingDay = date === day;
              const isSunday = dayOfWeek === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.01 }}
                  className="aspect-square flex items-center justify-center relative"
                >
                  {date !== null && (
                    <>
                      <p
                        className={`
                          font-medium transition-all relative z-10 text-lg
                          ${isWeddingDay
                            ? 'text-white'
                            : isSunday
                              ? 'text-rose-400'
                              : 'text-stone-600'
                          }
                        `}
                      >
                        {date}
                      </p>
                      {/* 예식일 원형 배경 */}
                      {isWeddingDay && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-900/80 shadow-md" />
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* D-Day 표시 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 text-center border-t border-stone-200 pt-8"
          >
            {daysUntilWedding === 0 ? (
              <p className="text-lg text-amber-900/90">
                Today is the day
              </p>
            ) : daysUntilWedding > 0 ? (
              <p className="text-lg text-stone-600">
                예식이 <span className="text-amber-900 font-medium mx-1">{daysUntilWedding}</span>일 남았습니다
              </p>
            ) : (
              <p className="text-lg text-stone-500">
                소중한 추억이 되었습니다
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
