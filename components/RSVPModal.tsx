'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Send, Copy } from 'lucide-react';
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
  const [formData, setFormData] = useState<RSVPData>({
    side: '',
    name: '',
    attendance: '',
    guestCount: 1,
    meal: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  // 필수 필드 검증
  const isValid = formData.side && formData.name && formData.attendance && formData.meal;

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
  };

  // 모달 닫기
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 카카오톡으로 전송
  const handleKakaoShare = async () => {
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // 구글 시트에 데이터 저장 (API 구현 필요)
      await saveToGoogleSheet(formData);

      // 카카오톡 공유 (Kakao SDK 필요)
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Share.sendDefault({
          objectType: 'text',
          text: formatRSVPMessage(formData),
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        });
      } else {
        // Kakao SDK가 없을 경우 클립보드로 복사
        handleCopyToClipboard();
      }

      // 전송 완료 후 모달 닫기
      setTimeout(() => {
        handleClose();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('RSVP 전송 실패:', error);
      setIsSubmitting(false);
    }
  };

  // 클립보드로 복사
  const handleCopyToClipboard = () => {
    const message = formatRSVPMessage(formData);
    navigator.clipboard.writeText(message);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
  };

  // 메시지 포맷팅
  const formatRSVPMessage = (data: RSVPData): string => {
    const sideText = data.side === 'groom' ? `신랑 측` : `신부 측`;
    const attendanceText =
      data.attendance === 'attending'
        ? '참석'
        : data.attendance === 'not-attending'
        ? '불참'
        : '미정';
    const mealText =
      data.meal === 'meal' ? '식사 예정' : data.meal === 'gift' ? '답례품 수령' : '미정';

    let message = `[결혼식 참석 의사]\n\n`;
    message += `👤 성함: ${data.name}\n`;
    message += `💐 구분: ${sideText}\n`;
    message += `✅ 참석 여부: ${attendanceText}\n`;
    if (data.attendance === 'attending') {
      message += `👥 동반 인원: ${data.guestCount}명 (본인 포함)\n`;
      message += `🍽️ 식사 여부: ${mealText}\n`;
    }
    if (data.message) {
      message += `\n💌 전하실 말씀:\n${data.message}`;
    }

    return message;
  };

  // 구글 시트 저장
  const saveToGoogleSheet = async (data: RSVPData) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('저장 실패');
      }

      const result = await response.json();
      console.log('RSVP 저장 성공:', result);
      return result;
    } catch (error) {
      console.error('RSVP 저장 실패:', error);
      throw error;
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

          {/* 모달 */}
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass backdrop-blur-2xl bg-white/95 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {/* 헤더 */}
              <div className="px-6 py-5 border-b border-stone-200/50 flex items-center justify-between">
                <h3 className="text-xl font-medium text-stone-800 tracking-wide">
                  참석 의사 전달
                </h3>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {/* 폼 */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                <div className="space-y-6">
                  {/* 구분 */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      구분 <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, side: 'groom' })}
                        className={`py-3 px-4 rounded-xl border-2 transition-all ${
                          formData.side === 'groom'
                            ? 'border-rose-400 bg-rose-50 text-rose-700'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        신랑 측
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, side: 'bride' })}
                        className={`py-3 px-4 rounded-xl border-2 transition-all ${
                          formData.side === 'bride'
                            ? 'border-rose-400 bg-rose-50 text-rose-700'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        신부 측
                      </button>
                    </div>
                  </div>

                  {/* 성함 */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      성함 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="이름을 입력해주세요"
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-400 focus:outline-none transition-colors bg-white/80"
                    />
                  </div>

                  {/* 참석 여부 */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      참석 여부 <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'attending', label: '참석' },
                        { value: 'not-attending', label: '불참' },
                        { value: 'undecided', label: '미정' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              attendance: option.value as RSVPData['attendance'],
                            })
                          }
                          className={`py-3 px-3 rounded-xl border-2 transition-all text-sm ${
                            formData.attendance === option.value
                              ? 'border-rose-400 bg-rose-50 text-rose-700'
                              : 'border-stone-200 hover:border-stone-300 text-stone-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 동반 인원 (참석일 경우만) */}
                  {formData.attendance === 'attending' && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        동반 인원 (본인 포함)
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              guestCount: Math.max(1, formData.guestCount - 1),
                            })
                          }
                          className="w-10 h-10 rounded-full border-2 border-stone-300 hover:border-rose-400 hover:bg-rose-50 flex items-center justify-center transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-2xl font-medium text-stone-800">
                            {formData.guestCount}
                          </span>
                          <span className="text-sm text-stone-500 ml-1">명</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, guestCount: formData.guestCount + 1 })
                          }
                          className="w-10 h-10 rounded-full border-2 border-stone-300 hover:border-rose-400 hover:bg-rose-50 flex items-center justify-center transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 식사 여부 */}
                  {formData.attendance === 'attending' && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        식사 여부 <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'meal', label: '식사 예정' },
                          { value: 'gift', label: '답례품' },
                          { value: 'undecided', label: '미정' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                meal: option.value as RSVPData['meal'],
                              })
                            }
                            className={`py-3 px-3 rounded-xl border-2 transition-all text-sm ${
                              formData.meal === option.value
                                ? 'border-rose-400 bg-rose-50 text-rose-700'
                                : 'border-stone-200 hover:border-stone-300 text-stone-600'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 전하실 말씀 */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      전하실 말씀 (선택)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="축하 메시지를 남겨주세요"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-rose-400 focus:outline-none transition-colors resize-none bg-white/80"
                    />
                  </div>
                </div>
              </div>

              {/* 푸터 */}
              <div className="px-6 py-4 border-t border-stone-200/50 space-y-3">
                {/* 카카오톡 전송 버튼 */}
                <button
                  onClick={handleKakaoShare}
                  disabled={!isValid || isSubmitting}
                  className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isValid && !isSubmitting
                      ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg hover:shadow-xl hover:from-rose-500 hover:to-rose-600'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? '전송 중...' : '카카오톡으로 전송하기'}
                </button>

                {/* 클립보드 복사 버튼 */}
                <button
                  onClick={handleCopyToClipboard}
                  disabled={!isValid}
                  className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border-2 border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  {showCopyMessage ? '복사되었습니다!' : '내용 복사하기'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}
