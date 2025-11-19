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
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-gyeonggi), serif' }}>
            Wedding Information
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-4" />
          <p className="text-amber-800/70 text-sm font-light">예식 안내</p>
        </motion.div>

        {/* 정보 - 카드 없이 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 space-y-8"
        >
          {/* 날짜 */}
          <div className="flex items-center gap-5 justify-center">
            <Calendar className="w-6 h-6 text-amber-600/70" />
            <div className="text-center">
              <p className="text-sm text-amber-800/60 mb-1 font-light uppercase tracking-wider">Date</p>
              <p className="text-xl font-medium text-amber-900">{date}</p>
            </div>
          </div>

          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mx-auto" />

          {/* 시간 */}
          <div className="flex items-center gap-5 justify-center">
            <Clock className="w-6 h-6 text-amber-600/70" />
            <div className="text-center">
              <p className="text-sm text-amber-800/60 mb-1 font-light uppercase tracking-wider">Time</p>
              <p className="text-xl font-medium text-amber-900">{time}</p>
            </div>
          </div>

          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mx-auto" />

          {/* 장소 */}
          <div className="flex items-center gap-5 justify-center">
            <MapPin className="w-6 h-6 text-amber-600/70" />
            <div className="text-center">
              <p className="text-sm text-amber-800/60 mb-1 font-light uppercase tracking-wider">Location</p>
              <p className="text-xl font-medium text-amber-900 mb-1">{venue}</p>
              {venueDetail && (
                <p className="text-sm text-amber-900/70 mb-1">{venueDetail}</p>
              )}
              <p className="text-sm text-amber-800/60 font-light">{address}</p>
            </div>
          </div>
        </motion.div>

        {/* 지도 - 심플한 프레임 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div
            id="map"
            className="w-full h-80 rounded-2xl overflow-hidden bg-amber-50/30 shadow-lg"
            style={{ border: '1px solid rgba(205, 186, 150, 0.2)' }}
          >
            {/* 카카오맵이 여기에 로드됩니다 */}
            <div className="w-full h-full flex items-center justify-center text-amber-400/70">
              <p className="text-sm font-light">지도 로딩 중...</p>
            </div>
          </div>
        </motion.div>

        {/* 네비게이션 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 gap-4 max-w-md mx-auto"
        >
          <button
            onClick={() => openNavigation('kakao')}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
            style={{ backgroundColor: 'rgba(255, 253, 245, 0.7)', border: '1px solid rgba(205, 186, 150, 0.3)', color: '#78350f' }}
          >
            <Navigation className="w-5 h-5" />
            카카오맵
          </button>
          <button
            onClick={() => openNavigation('naver')}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
            style={{ backgroundColor: 'rgba(255, 253, 245, 0.7)', border: '1px solid rgba(205, 186, 150, 0.3)', color: '#78350f' }}
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
