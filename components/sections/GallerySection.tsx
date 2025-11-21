import { motion, AnimatePresence } from 'framer-motion';
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

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function GallerySection({ photos }: GallerySectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // 3 ROW 기준: 그리드가 3열이므로 3 ROW = 9장, 4열이면 12장
  // 모바일(3열), 태블릿(3열), 데스크톱(4열)을 고려하여 12장을 기준으로 설정
  const initialDisplayCount = 12;
  const displayedPhotos = showAll ? photos : photos.slice(0, initialDisplayCount);
  const hasMorePhotos = photos.length > initialDisplayCount;

  const paginate = useCallback((newDirection: number) => {
    if (selectedIndex === null) return;
    setDirection(newDirection);
    let newIndex = selectedIndex + newDirection;
    if (newIndex < 0) newIndex = photos.length - 1;
    if (newIndex >= photos.length) newIndex = 0;
    setSelectedIndex(newIndex);
  }, [selectedIndex, photos.length]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex, paginate]);

  return (
    <>
      <section ref={ref} className="py-20 px-6 relative bg-[#fbfaf8]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        <div className="max-w-6xl mx-auto">
          {/* 제목 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl text-amber-900/80 tracking-[0.2em] uppercase mb-3">
              Gallery
            </h2>
            <div className="text-2xl md:text-4xl text-amber-950 font-medium mb-4">
              <span className="block md:hidden">우리의 순간</span>
              <span className="hidden md:block">우리의 소중한 순간들</span>
            </div>
          </motion.div>

          {/* 글라스모피즘 그리드 */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {displayedPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="cursor-pointer group"
                onClick={() => {
                  setDirection(0);
                  setSelectedIndex(index);
                }}
              >
                {/* 글라스모피즘 플로팅 카드 */}
                <div className="relative w-full aspect-square overflow-hidden rounded-sm transition-all duration-500 shadow-md hover:shadow-xl border border-stone-200/50 bg-white">
                  {/* 사진 */}
                  <div className="relative w-full h-full">
                    {photo.src.startsWith('http') || photo.src.startsWith('/images') ? (
                      <Image
                        src={photo.src}
                        alt={photo.caption || `사진 ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 25vw"
                        priority={index < 6}
                        quality={75}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <p className="text-stone-400 text-xs">사진 {index + 1}</p>
                      </div>
                    )}
                  </div>

                  {/* 호버 시 오버레이 */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 더보기/접기 버튼 */}
          {hasMorePhotos && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: displayedPhotos.length * 0.08 + 0.2 }}
              className="mt-12 text-center"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 rounded-sm text-stone-600 font-medium hover:bg-stone-100 transition-all duration-300 border border-stone-300 text-sm tracking-wider"
              >
                {showAll ? 'CLOSE' : `VIEW MORE (${photos.length - initialDisplayCount})`}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center touch-none"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50 p-2"
              aria-label="닫기"
            >
              <X className="w-8 h-8" />
            </button>

            {/* 이전 버튼 (PC용) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 bg-black/20 hover:bg-black/40 rounded-full p-3 hidden md:block"
              aria-label="이전 사진"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* 다음 버튼 (PC용) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 bg-black/20 hover:bg-black/40 rounded-full p-3 hidden md:block"
              aria-label="다음 사진"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div
              className="relative w-full h-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={selectedIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);

                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                    className="absolute w-full h-full flex items-center justify-center"
                  >
                    {photos[selectedIndex].src.startsWith('http') || photos[selectedIndex].src.startsWith('/images') ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={photos[selectedIndex].src}
                          alt={photos[selectedIndex].caption || '확대 이미지'}
                          fill
                          className="object-contain"
                          sizes="100vw"
                          priority
                          quality={90}
                          draggable={false}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-stone-100 flex items-center justify-center rounded-sm">
                        <p className="text-stone-400">이미지 미리보기</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 캡션 및 카운터 */}
              <div className="absolute bottom-8 left-0 right-0 text-center z-50 pointer-events-none">
                {photos[selectedIndex].caption && (
                  <p className="text-white/90 text-lg font-medium mb-2 drop-shadow-md">
                    {photos[selectedIndex].caption}
                  </p>
                )}
                <p className="text-white/60 text-sm tracking-widest font-light">
                  {selectedIndex + 1} / {photos.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
