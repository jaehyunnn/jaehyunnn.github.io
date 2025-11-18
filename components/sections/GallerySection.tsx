'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { X } from 'lucide-react';
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

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // 무작위 회전 각도 생성 (지정되지 않은 경우)
  const getRotation = (index: number, photo: Photo) => {
    if (photo.rotation !== undefined) return photo.rotation;
    const rotations = [-3, -2, -1, 0, 1, 2, 3];
    return rotations[index % rotations.length];
  };

  return (
    <>
      <section ref={ref} className="py-20 px-6 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-6xl mx-auto">
          {/* 제목 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
              Our Story
            </h2>
            <div className="w-12 h-px bg-rose-300 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">우리의 소중한 순간들</p>
          </motion.div>

          {/* 폴라로이드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                className="cursor-pointer"
                style={{ rotate: `${getRotation(index, photo)}deg` }}
                onClick={() => setSelectedPhoto(photo)}
              >
                {/* 폴라로이드 프레임 */}
                <div className="bg-white p-4 pb-12 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    {photo.src.startsWith('http') || photo.src.startsWith('/images') ? (
                      <Image
                        src={photo.src}
                        alt={photo.caption || `사진 ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                        <p className="text-gray-400 text-sm">사진 {index + 1}</p>
                      </div>
                    )}
                  </div>
                  {photo.caption && (
                    <p className="text-center mt-4 text-gray-700 font-handwriting text-sm">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 이미지 확대 모달 */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <X className="w-8 h-8" />
          </button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPhoto.src.startsWith('http') || selectedPhoto.src.startsWith('/images') ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.caption || '확대 이미지'}
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
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-4 text-lg">
                {selectedPhoto.caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
