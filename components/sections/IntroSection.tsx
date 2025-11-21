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
  const [hasStarted, setHasStarted] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showNames, setShowNames] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 오디오 컨텍스트 초기화 및 자동 시작
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 오디오 컨텍스트 생성 시도
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('AudioContext creation failed', e);
    }

    // 자동 시작
    setHasStarted(true);
  }, []);

  // 타이핑 소리 재생 함수 (기계식 키보드 느낌)
  const playTypingSound = async () => {
    if (typeof window === 'undefined' || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const t = audioContext.currentTime;

      // 메인 톤 (타건음)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Triangle 파형으로 좀 더 "틱" 하는 소리 구현
      oscillator.type = 'triangle';

      // 피치 랜덤화 (자연스러움 추가)
      const randomDetune = Math.random() * 100 - 50; // ±50 cents
      oscillator.detune.value = randomDetune;

      // 주파수: 약간 낮은 톤으로 무게감 있게
      oscillator.frequency.setValueAtTime(300, t);
      oscillator.frequency.exponentialRampToValueAtTime(100, t + 0.05);

      // 볼륨 엔벨로프: 짧고 강하게
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.15, t + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      oscillator.start(t);
      oscillator.stop(t + 0.1);

      // 노이즈 (스위치 클릭음/찰칵거림) 추가
      const bufferSize = audioContext.sampleRate * 0.05; // 0.05초
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseGain = audioContext.createGain();

      // 하이패스 필터로 "틱" 소리 강조
      const filter = audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);

      noiseGain.gain.setValueAtTime(0.05, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      noiseSource.start(t);
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
    if (!hasStarted) return;

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

        // 이름 표시 후 3초 대기 후 페이드아웃 (자연스러운 종료)
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 1000); // 페이드아웃 애니메이션 후 완료
        }, 3500);
      }
    };

    // 초기 딜레이 후 타이핑 시작
    const initialDelay = setTimeout(typeText, 500);

    return () => clearTimeout(initialDelay);
  }, [hasStarted, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* 전체화면 배경 - 부드러운 웜톤 */}
      <div className="absolute inset-0 bg-[#fbfaf8]" />

      {/* Google Fonts 로드 (Noto Serif KR) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&display=swap');
      `}</style>

      {/* 시작 후: 타이핑 텍스트 */}
      <div className="relative z-10 text-center px-8 w-full h-full flex flex-col items-center justify-center">
        {/* 타이핑 효과 텍스트 */}
        <div className="leading-relaxed">
          {displayedText.split('\n').map((line, index) => {
            const lineLength = lines.slice(0, index).join('\n').length + (index > 0 ? index : 0);
            const isLineComplete = displayedText.length > lineLength + line.length;
            const visibleText = displayedText.slice(lineLength, lineLength + line.length + 1);

            // 타이핑이 완전히 끝났는지 확인 (커서 숨김용)
            const isAllTypingDone = displayedText.length === fullText.length;

            return (
              <div
                key={index}
                className="text-3xl md:text-4xl lg:text-5xl text-amber-950/90 mb-4"
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                }}
              >
                {visibleText}
                {!isLineComplete && index === displayedText.split('\n').length - 1 && !isAllTypingDone && (
                  <span className="animate-pulse text-amber-400/60 ml-1">|</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 이름 - 페이드인 효과 */}
        {showNames && (
          <div
            className="text-2xl md:text-3xl lg:text-4xl text-amber-900 mt-12 transition-opacity duration-1000"
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontWeight: 400,
              letterSpacing: '0.1em',
              animation: 'fadeIn 1.5s ease-in-out',
            }}
          >
            {groomName} <span className="text-amber-400/60 mx-2">|</span> {brideName}
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
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>

      {/* 장식 요소 - 로딩 인디케이터 */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-900/20 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-900/20 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-900/20 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div >
  );
}
