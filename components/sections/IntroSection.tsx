'use client';

import { useEffect, useState, useRef } from 'react';

interface IntroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  onComplete: () => void;
}

export default function IntroSection({
  groomName,
  brideName,
  weddingDate,
  onComplete,
}: IntroSectionProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showNames, setShowNames] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // 오디오 컨텍스트 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        // AudioContext resume을 시도하여 자동재생 준비
        await audioContextRef.current.resume();
        setAudioInitialized(true);
      } catch (error) {
        console.log('오디오 초기화 실패:', error);
      }
    };

    initAudio();
  }, []);

  // 타이핑 소리 재생 함수
  const playTypingSound = async () => {
    if (typeof window === 'undefined' || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;

      // AudioContext가 suspended 상태면 resume
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 타이핑 소리 설정 (부드러운 클릭 소리)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('타이핑 소리 재생 실패:', error);
    }
  };

  // 표시할 텍스트 라인들 (이름 제외)
  const lines = [
    `You are cordially invited`,
    `to the wedding of`,
  ];

  const fullText = lines.join('\n');

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 80; // 타이핑 속도 (ms)
    const lineDelay = 300; // 줄 바꿈 후 딜레이 (ms)

    const typeText = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));

        // 줄바꿈이 아닌 경우에만 타이핑 소리 재생
        if (fullText[currentIndex] !== '\n') {
          playTypingSound();
        }

        currentIndex++;

        // 줄바꿈 문자를 만났을 때
        if (fullText[currentIndex - 1] === '\n') {
          setTimeout(typeText, lineDelay);
        } else {
          setTimeout(typeText, typingSpeed);
        }
      } else {
        // 타이핑 완료 후 이름 표시
        setTimeout(() => {
          setShowNames(true);
        }, 500);

        // 이름 표시 후 2초 대기 후 페이드아웃
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 1000); // 페이드아웃 애니메이션 후 완료
        }, 3000);
      }
    };

    // 초기 딜레이 후 타이핑 시작
    const initialDelay = setTimeout(typeText, 500);

    return () => clearTimeout(initialDelay);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isComplete ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 전체화면 배경 - 궁전 테마 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdfcfb] via-[#f8f6f3] to-[#f5f3ef]" />

      {/* Google Fonts 로드 */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      `}</style>

      {/* 타이핑 텍스트 - 전체화면 중앙 */}
      <div className="relative z-10 text-center px-8 w-full h-full flex flex-col items-center justify-center">
        {/* 타이핑 효과 텍스트 */}
        <div className="leading-relaxed">
          {displayedText.split('\n').map((line, index) => {
            const lineLength = lines.slice(0, index).join('\n').length + (index > 0 ? index : 0);
            const isLineComplete = displayedText.length > lineLength + line.length;
            const visibleText = displayedText.slice(lineLength, lineLength + line.length + 1);

            return (
              <div
                key={index}
                className="text-5xl md:text-7xl lg:text-8xl text-amber-900"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  textShadow: '3px 3px 6px rgba(205, 186, 150, 0.3)',
                }}
              >
                {visibleText}
                {!isLineComplete && index === displayedText.split('\n').length - 1 && (
                  <span className="animate-pulse text-amber-600">|</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 이름 - 페이드인 효과 */}
        {showNames && (
          <div
            className="text-3xl md:text-4xl lg:text-5xl text-amber-900 mt-12 transition-opacity duration-1000"
            style={{
              fontFamily: "'Great Vibes', cursive",
              textShadow: '3px 3px 6px rgba(205, 186, 150, 0.3)',
              animation: 'fadeIn 1.5s ease-in-out',
            }}
          >
            {groomName} & {brideName}
          </div>
        )}
      </div>

      {/* 페이드인 애니메이션 정의 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* 장식 요소 - 궁전 테마 */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500/60 shadow-lg animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 rounded-full bg-amber-500/60 shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full bg-amber-500/60 shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
