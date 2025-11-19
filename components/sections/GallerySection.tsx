'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  src: string;
  caption?: string;
  rotation?: number;
}

interface GallerySectionProps {
  photos: Photo[];
}

export default function GallerySection({ photos }: GallerySectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 무작위 회전 각도 생성 (지정되지 않은 경우)
  const getRotation = (index: number, photo: Photo) => {
    if (photo.rotation !== undefined) return photo.rotation;
    const rotations = [-3, -2, -1, 0, 1, 2, 3];
    return rotations[index % rotations.length];
  };

  // 이전/다음 사진으로 이동
  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex, photos.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  }, [selectedIndex, photos.length]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex, goToPrevious, goToNext]);

  // 터치 이벤트 핸들러
  const minSwipeDistance = 50; // 최소 스와이프 거리 (픽셀)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext(); // 왼쪽으로 스와이프 → 다음 사진
    } else if (isRightSwipe) {
      goToPrevious(); // 오른쪽으로 스와이프 → 이전 사진
    }
  };

  return (
    <>
      <section ref={ref} className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* 제목 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Our Story
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-4" />
            <p className="text-amber-800/70 text-sm font-light">우리의 소중한 순간들</p>
          </motion.div>

          {/* 글라스모피즘 그리드 */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.08, y: -8 }}
                className="cursor-pointer group"
                onClick={() => setSelectedIndex(index)}
              >
                {/* 글라스모피즘 플로팅 카드 */}
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl transition-all duration-500">
                  {/* 플로팅 효과를 위한 그라데이션 배경 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white/30 to-amber-100/40 backdrop-blur-md" />

                  {/* 은은한 테두리 효과 */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-200/20 ring-inset" />

                  {/* 사진 */}
                  <div className="relative w-full h-full">
                    {photo.src.startsWith('http') || photo.src.startsWith('/images') ? (
                      <Image
                        src={photo.src}
                        alt={photo.caption || `사진 ${index + 1}`}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50/50 to-amber-100/50">
                        <p className="text-amber-400/60 text-xs">사진 {index + 1}</p>
                      </div>
                    )}
                  </div>

                  {/* 호버 시 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  {/* 플로팅 섀도우 */}
                  <div className="absolute inset-0 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 rounded-2xl"
                       style={{
                         boxShadow: '0 8px 32px rgba(205, 186, 150, 0.15), 0 2px 8px rgba(120, 53, 15, 0.08)'
                       }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 이미지 확대 모달 */}
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-8 h-8" />
          </button>

          {/* 이전 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* 다음 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <motion.div
            key={selectedIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {photos[selectedIndex].src.startsWith('http') || photos[selectedIndex].src.startsWith('/images') ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={photos[selectedIndex].src}
                  alt={photos[selectedIndex].caption || '확대 이미지'}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <p className="text-gray-400">이미지 미리보기</p>
              </div>
            )}
            {photos[selectedIndex].caption && (
              <p className="text-white text-center mt-4 text-lg">
                {photos[selectedIndex].caption}
              </p>
            )}
            {/* 사진 카운터 */}
            <p className="text-white/70 text-center mt-2 text-sm">
              {selectedIndex + 1} / {photos.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
