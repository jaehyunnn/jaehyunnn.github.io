'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Send, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  groomName: string;
  brideName: string;
}

interface RSVPData {
  side: 'groom' | 'bride' | '';
  name: string;
  attendance: 'attending' | 'not-attending' | 'undecided' | '';
  guestCount: number;
  meal: 'meal' | 'gift' | 'undecided' | '';
  message: string;
}

export default function RSVPModal({ isOpen, onClose, groomName, brideName }: RSVPModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RSVPData>({
    side: '',
    name: '',
    attendance: '',
    guestCount: 1,
    meal: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 단계 유효성 검사
  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.side;
      case 2:
        return !!formData.name;
      case 3:
        return !!formData.attendance;
      case 4:
        return formData.attendance !== 'attending' || formData.guestCount > 0;
      case 5:
        return formData.attendance !== 'attending' || !!formData.meal;
      case 6:
        return true; // 메시지는 선택사항
      default:
        return false;
    }
  };

  // 다음 단계로
  const handleNext = () => {
    if (!isStepValid()) return;

    // 불참/미정인 경우 동반인원, 식사 단계 건너뛰기
    if (step === 3 && formData.attendance !== 'attending') {
      setStep(6); // 메시지 단계로
    } else {
      setStep(step + 1);
    }
  };

  // 이전 단계로
  const handlePrev = () => {
    // 메시지 단계에서 뒤로가기 시 참석여부에 따라 분기
    if (step === 6 && formData.attendance !== 'attending') {
      setStep(3); // 참석여부 단계로
    } else {
      setStep(step - 1);
    }
  };

  // 폼 리셋
  const resetForm = () => {
    setFormData({
      side: '',
      name: '',
      attendance: '',
      guestCount: 1,
      meal: '',
      message: '',
    });
    setStep(1);
  };

  // 모달 닫기
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // RSVP 제출
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await saveToGoogleSheet(formData);
      alert('참석 의사가 전달되었습니다. 감사합니다!');
      handleClose();
    } catch (error) {
      console.error('RSVP 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 구글 시트 저장
  const saveToGoogleSheet = async (data: RSVPData) => {
    try {
      const scriptUrl =
        'https://script.google.com/macros/s/AKfycbx02D055EaD3aJgIo5JikIIwz9AjFoQ6-I_tKvdZM15vy8lGtC_C2g9gRuyyOAVeUCb/exec';

      const params = new URLSearchParams({
        data: JSON.stringify(data),
      });

      const response = await fetch(`${scriptUrl}?${params.toString()}`, {
        method: 'GET',
        redirect: 'follow',
      });

      const result = await response.json();
      console.log('RSVP 저장 성공:', result);
      return result;
    } catch (error) {
      console.error('RSVP 저장 실패:', error);
      throw error;
    }
  };

  // 진행 상황 표시
  const renderProgress = () => {
    const totalSteps = formData.attendance === 'attending' ? 6 : 4;
    const currentStep = step === 6 && formData.attendance !== 'attending' ? 4 : step;

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index + 1 <= currentStep
                ? 'bg-stone-400 w-8'
                : 'bg-white/60 border border-stone-200/50 w-6'
            }`}
          />
        ))}
      </div>
    );
  };

  // 각 단계별 콘텐츠
  const renderStep = () => {
    const slideVariants = {
      enter: { x: 50, opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 },
    };

    // 로딩 화면
    if (isSubmitting) {
      const loadingText = "전송중입니다...";
      const characters = loadingText.split('');

      return (
        <motion.div
          key="loading"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex flex-col items-center justify-center min-h-[60vh]"
        >
          <h2 className="text-2xl font-medium text-center mb-8">
            {characters.map((char, index) => (
              <motion.span
                key={index}
                animate={{
                  color: ['#d6d3d1', '#78716c', '#d6d3d1'],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
                className="inline-block"
                style={{
                  minWidth: char === ' ' ? '0.25em' : 'auto',
                }}
              >
                {char}
              </motion.span>
            ))}
          </h2>

          <p className="text-sm text-stone-400">잠시만 기다려주세요</p>
        </motion.div>
      );
    }

    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <h2 className="text-2xl font-medium text-stone-700 mb-3 text-center">
              어느 분의 지인이신가요?
            </h2>
            <p className="text-sm text-stone-500 mb-12">구분을 선택해주세요</p>

            <div className="w-full max-w-sm space-y-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, side: 'groom' });
                  setTimeout(handleNext, 300);
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.side === 'groom'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                신랑 측
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, side: 'bride' });
                  setTimeout(handleNext, 300);
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.side === 'bride'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                신부 측
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center pt-16 pb-8"
          >
            <h2 className="text-2xl font-medium text-stone-700 mb-3 text-center">
              성함을 알려주세요
            </h2>
            <p className="text-sm text-stone-500 mb-12">예식장에서 확인할 수 있도록 정확히 입력해주세요</p>

            <div className="w-full max-w-sm">
              <input
                type="text"
                inputMode="text"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
                className="w-full px-6 py-4 text-base rounded-2xl border border-white/60 focus:border-stone-300 focus:outline-none transition-all duration-300 bg-white/40 backdrop-blur-sm text-center text-stone-700 placeholder:text-stone-400"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <h2 className="text-2xl font-medium text-stone-700 mb-3 text-center">
              참석 여부를 알려주세요
            </h2>
            <p className="text-sm text-stone-500 mb-12">
              {groomName} ❤️ {brideName}의 결혼식에
            </p>

            <div className="w-full max-w-sm space-y-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, attendance: 'attending' });
                  setTimeout(() => setStep(4), 300); // 참석 -> 동반인원 단계로
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.attendance === 'attending'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                참석합니다
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, attendance: 'not-attending', guestCount: 0, meal: '' });
                  setTimeout(() => setStep(6), 300); // 불참 -> 메시지 단계로
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.attendance === 'not-attending'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                불참합니다
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, attendance: 'undecided', guestCount: 0, meal: '' });
                  setTimeout(() => setStep(6), 300); // 미정 -> 메시지 단계로
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.attendance === 'undecided'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                미정입니다
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <h2 className="text-2xl font-medium text-stone-700 mb-3 text-center">
              동반 인원을 알려주세요
            </h2>
            <p className="text-sm text-stone-500 mb-12">본인 포함 총 인원수를 선택해주세요</p>

            <div className="flex items-center gap-8">
              <button
                onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm border border-white/60 hover:bg-white/60 hover:border-stone-200 flex items-center justify-center transition-all duration-300"
              >
                <Minus className="w-5 h-5 text-stone-500" />
              </button>

              <div className="text-center">
                <div className="text-5xl font-light text-stone-700 mb-2">{formData.guestCount}</div>
                <div className="text-sm text-stone-500">명</div>
              </div>

              <button
                onClick={() => setFormData({ ...formData, guestCount: Math.min(10, formData.guestCount + 1) })}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm border border-white/60 hover:bg-white/60 hover:border-stone-200 flex items-center justify-center transition-all duration-300"
              >
                <Plus className="w-5 h-5 text-stone-500" />
              </button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <h2 className="text-2xl font-medium text-stone-700 mb-3 text-center">
              식사 여부를 선택해주세요
            </h2>
            <p className="text-sm text-stone-500 mb-12">예식 후 식사 준비를 위해 필요합니다</p>

            <div className="w-full max-w-sm space-y-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, meal: 'meal' });
                  setTimeout(handleNext, 300);
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.meal === 'meal'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                식사 예정입니다
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, meal: 'gift' });
                  setTimeout(handleNext, 300);
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.meal === 'gift'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                답례품만 수령합니다
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, meal: 'undecided' });
                  setTimeout(handleNext, 300);
                }}
                className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 text-base backdrop-blur-sm border ${
                  formData.meal === 'undecided'
                    ? 'bg-white/80 text-stone-700 border-stone-300 shadow-lg'
                    : 'bg-white/40 text-stone-600 border-white/60 hover:bg-white/60 hover:border-stone-200'
                }`}
              >
                미정입니다
              </button>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center pt-16 pb-8"
          >
            <h2 className="text-2xl font-medium text-stone-700 mb-3 text-center">
              축하 메시지를 남겨주세요
            </h2>
            <p className="text-sm text-stone-500 mb-12">선택사항입니다</p>

            <div className="w-full max-w-sm">
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="축하합니다! 행복하세요."
                rows={5}
                className="w-full px-5 py-4 text-base rounded-2xl border border-white/60 focus:border-stone-300 focus:outline-none transition-all duration-300 resize-none bg-white/40 backdrop-blur-sm text-stone-700 placeholder:text-stone-400"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* 모달 - 전체 화면 */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="rounded-3xl w-full max-w-lg mx-4 overflow-hidden flex flex-col pointer-events-auto backdrop-blur-xl border border-white/60"
              style={{
                fontFamily: "'Noto Serif KR', serif",
                maxHeight: '90vh',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5) inset'
              }}
            >
              {/* 헤더 */}
              <div className="px-6 py-5 border-b border-white/50 flex items-center justify-between">
                <h3 className="text-lg font-medium text-stone-700 tracking-wide">참석 의사 전달</h3>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-all duration-300 border border-white/60"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              {/* 진행 상황 */}
              <div className="px-6 pt-6">{renderProgress()}</div>

              {/* 콘텐츠 */}
              <div className="flex-1 px-6 pb-6 overflow-y-auto">
                <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
              </div>

              {/* 하단 버튼 */}
              {!isSubmitting && (
                <div className="px-6 py-4 border-t border-white/50 flex gap-3">
                  {step > 1 && (
                    <button
                      onClick={handlePrev}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-stone-600 hover:bg-white/60 hover:border-stone-200 transition-all duration-300 text-sm font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      이전
                    </button>
                  )}

                  {step < 6 ? (
                    isStepValid() ? (
                      <motion.button
                        onClick={handleNext}
                        animate={{
                          borderColor: ['#d6d3d1', '#78716c', '#d6d3d1'],
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm backdrop-blur-sm bg-white/70 text-stone-700 border-2 hover:bg-white/90 shadow-sm"
                      >
                        다음
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm backdrop-blur-sm bg-white/20 text-stone-400 cursor-not-allowed border border-white/40"
                      >
                        다음
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )
                  ) : (
                    <motion.button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      animate={{
                        borderColor: ['#d6d3d1', '#78716c', '#d6d3d1'],
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm backdrop-blur-sm bg-white/70 text-stone-700 border-2 hover:bg-white/90 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      전달하기
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
