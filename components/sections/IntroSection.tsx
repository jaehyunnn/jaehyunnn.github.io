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
  const audioContextRef = useRef<AudioContext | null>(null);

  // 타이핑 소리 재생 함수
  const playTypingSound = () => {
    if (typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
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
  };

  // 표시할 텍스트 라인들
  const lines = [
    `${groomName} 과 ${brideName}`,
    `${weddingDate}에 결혼합니다!`,
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
        // 타이핑 완료 후 2초 대기 후 페이드아웃
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 1000); // 페이드아웃 애니메이션 후 완료
        }, 2000);
      }
    };

    // 초기 딜레이 후 타이핑 시작
    const initialDelay = setTimeout(typeText, 500);

    return () => clearTimeout(initialDelay);
  }, [fullText, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isComplete ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Glassmorphism 배경 - 그라데이션은 body에 있으므로 투명하게 */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* 타이핑 텍스트 - Glassmorphism 카드 */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        <div className="glass-strong rounded-3xl p-12 md:p-16 shadow-2xl">
          <pre
            className="font-brush text-4xl md:text-6xl text-gray-800 leading-relaxed whitespace-pre-wrap"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {displayedText}
            <span className="animate-pulse text-rose-400">|</span>
          </pre>
        </div>
      </div>

      {/* 장식 요소 - Glassmorphism */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-400 shadow-lg animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 rounded-full bg-rose-400 shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full bg-rose-400 shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
