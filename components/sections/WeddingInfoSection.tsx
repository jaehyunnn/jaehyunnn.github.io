'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { useEffect } from 'react';

interface WeddingInfoSectionProps {
  date: string;
  time: string;
  venue: string;
  address: string;
  venueDetail?: string;
  latitude?: number;
  longitude?: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function WeddingInfoSection({
  date,
  time,
  venue,
  address,
  venueDetail,
  latitude = 37.5665,
  longitude = 126.9780
}: WeddingInfoSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=3cd74c7f5d1d79108ec506779a38c9db&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3
          };

          const map = new window.kakao.maps.Map(container, options);

          // 마커 생성
          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [latitude, longitude]);

  const openNavigation = (type: 'kakao' | 'naver') => {
    if (type === 'kakao') {
      window.open(
        `https://map.kakao.com/link/map/${venue},${latitude},${longitude}`,
        '_blank'
      );
    } else {
      window.open(
        `https://map.naver.com/v5/search/${encodeURIComponent(address)}`,
        '_blank'
      );
    }
  };

  return (
    <section ref={ref} className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
            Wedding Information
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-4" />
          <p className="text-gray-600 text-sm">예식 안내</p>
        </motion.div>

        {/* 정보 카드 - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 mb-8 shadow-xl"
        >
          <div className="space-y-6">
            {/* 날짜 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 glass-subtle rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Calendar className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">날짜</p>
                <p className="text-lg font-semibold text-gray-800">{date}</p>
              </div>
            </div>

            {/* 시간 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 glass-subtle rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Clock className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">시간</p>
                <p className="text-lg font-semibold text-gray-800">{time}</p>
              </div>
            </div>

            {/* 장소 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 glass-subtle rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <MapPin className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">장소</p>
                <p className="text-lg font-semibold text-gray-800 mb-1">{venue}</p>
                {venueDetail && (
                  <p className="text-sm text-gray-700 mb-1">{venueDetail}</p>
                )}
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 지도 - Glassmorphism 프레임 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
        >
          <div className="glass p-2 rounded-3xl shadow-xl">
            <div
              id="map"
              className="w-full h-80 rounded-2xl overflow-hidden bg-gray-100"
            >
              {/* 카카오맵이 여기에 로드됩니다 */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p className="text-sm">지도 로딩 중...</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 네비게이션 버튼 - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => openNavigation('kakao')}
            className="flex items-center justify-center gap-2 glass-strong hover:glass text-yellow-700 font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Navigation className="w-5 h-5" />
            카카오맵
          </button>
          <button
            onClick={() => openNavigation('naver')}
            className="flex items-center justify-center gap-2 glass-strong hover:glass text-green-700 font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Navigation className="w-5 h-5" />
            네이버지도
          </button>
        </motion.div>

        {/* 교통편 안내 */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 p-6 bg-gray-50 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">교통편 안내</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>🚇 지하철: 2호선 강남역 10번 출구에서 도보 5분</p>
            <p>🚌 버스: 146, 740, 341, 360번</p>
            <p>🚗 주차: 건물 내 주차 가능 (2시간 무료)</p>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
