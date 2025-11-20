'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
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
    naver: any;
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
    // 네이버 지도 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=0ft29k7u1e`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        const container = document.getElementById('naverMap');
        if (!container) return;

        const location = new window.naver.maps.LatLng(latitude, longitude);

        const mapOptions = {
          center: location,
          zoom: 17,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT
          }
        };

        const map = new window.naver.maps.Map(container, mapOptions);

        // 커스텀 아이콘 마커 생성
        const marker = new window.naver.maps.Marker({
          position: location,
          map: map,
          title: venue,
          icon: {
            url: '/icons/heart_location.png',
            scaledSize: new window.naver.maps.Size(40, 40),
            origin: new window.naver.maps.Point(0, 0),
          }
        });

        // InfoWindow 내용 - 글라스모피즘 스타일
        const contentString = [
          '<div class="iw_inner" style="',
          'padding: 8px 12px;',
          'width: 160px;',
          'text-align: center;',
          'background: rgba(255, 253, 245, 0.85);',
          'backdrop-filter: blur(12px);',
          '-webkit-backdrop-filter: blur(12px);',
          'border-radius: 16px;',
          'box-shadow: 0 4px 12px rgba(120, 53, 15, 0.15), 0 0 1px rgba(205, 186, 150, 0.3);',
          'border: 1px solid rgba(251, 191, 36, 0.3);',
          '">',
          `   <p style="font-size: 0.85rem; margin: 0 0 3px 0; font-weight: 600; color: #78350f; letter-spacing: -0.02em;">${venue}</p>`,
          `   <p style="font-size: 0.7rem; margin: 0; color: #92400e; opacity: 0.8; line-height: 1.3;">${address}</p>`,
          '</div>'
        ].join('');

        // InfoWindow 생성 - 투명 배경으로 설정
        const infowindow = new window.naver.maps.InfoWindow({
          content: contentString,
          maxWidth: 180,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          disableAnchor: true,
          pixelOffset: new window.naver.maps.Point(0, -5)
        });

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, 'click', function() {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
          }
        });

        // 초기에 InfoWindow 열어두기
        infowindow.open(map, marker);
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [latitude, longitude, venue]);

  const openNavigation = (type: 'kakao' | 'naver' | 'tmap') => {
    if (type === 'kakao') {
      // iOS와 Android 모두 지원하는 카카오맵 URL 스킴
      const kakaoMapUrl = `kakaomap://look?p=${latitude},${longitude}`;
      const webFallbackUrl = `https://map.kakao.com/link/map/${encodeURIComponent(venue)},${latitude},${longitude}`;

      // 먼저 앱으로 열기 시도
      window.location.href = kakaoMapUrl;

      // 1.5초 후에도 페이지가 바뀌지 않으면 웹으로 fallback
      setTimeout(() => {
        window.open(webFallbackUrl, '_blank');
      }, 1500);
    } else if (type === 'naver') {
      // 네이버 지도 앱 URL 스킴 (iOS, Android 공통)
      const naverMapUrl = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(venue)}&appname=com.wedding.invitation`;
      const webFallbackUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

      window.location.href = naverMapUrl;

      setTimeout(() => {
        window.open(webFallbackUrl, '_blank');
      }, 1500);
    } else if (type === 'tmap') {
      // TMAP URL 스킴
      window.location.href = `tmap://search?name=${encodeURIComponent(venue)}`;
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
          <h2 className="text-4xl md:text-5xl text-amber-900 mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
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
          <div className="flex flex-col items-center justify-center">
            <Calendar className="w-4 h-4 text-amber-600/70 mb-2" />
            <p className="text-sm text-amber-800/60 mb-1 font-light uppercase tracking-wider">Date</p>
            <p className="text-xl font-medium text-amber-900">{date}</p>
          </div>

          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mx-auto" />

          {/* 시간 */}
          <div className="flex flex-col items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600/70 mb-2" />
            <p className="text-sm text-amber-800/60 mb-1 font-light uppercase tracking-wider">Time</p>
            <p className="text-xl font-medium text-amber-900">{time}</p>
          </div>

          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mx-auto" />

          {/* 장소 */}
          <div className="flex flex-col items-center justify-center">
            <MapPin className="w-4 h-4 text-amber-600/70 mb-2" />
            <p className="text-sm text-amber-800/60 mb-1 font-light uppercase tracking-wider">Location</p>
            <p className="text-xl font-medium text-amber-900 mb-1">{venue}</p>
            {venueDetail && (
              <p className="text-sm text-amber-900/70 mb-1">{venueDetail}</p>
            )}
            <p className="text-sm text-amber-800/60 font-light">{address}</p>
          </div>
        </motion.div>

        {/* 지도 - 네이버 지도 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div
            id="naverMap"
            className="w-full h-80 rounded-2xl overflow-hidden bg-amber-50/30 shadow-lg"
            style={{ border: '1px solid rgba(205, 186, 150, 0.2)' }}
          >
            {/* 네이버 지도가 여기에 로드됩니다 */}
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
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          <button
            onClick={() => openNavigation('naver')}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm"
            style={{ backgroundColor: 'rgba(255, 253, 245, 0.7)', border: '1px solid rgba(205, 186, 150, 0.3)', color: '#78350f' }}
          >
            <Image src="/icons/naver_map.webp" alt="네이버지도" width={20} height={20} />
            네이버지도
          </button>
          <button
            onClick={() => openNavigation('kakao')}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm"
            style={{ backgroundColor: 'rgba(255, 253, 245, 0.7)', border: '1px solid rgba(205, 186, 150, 0.3)', color: '#78350f' }}
          >
            <Image src="/icons/kakao_map.webp" alt="카카오맵" width={20} height={20} />
            카카오맵
          </button>
          <button
            onClick={() => openNavigation('tmap')}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm"
            style={{ backgroundColor: 'rgba(255, 253, 245, 0.7)', border: '1px solid rgba(205, 186, 150, 0.3)', color: '#78350f' }}
          >
            <Image src="/icons/tmap.webp" alt="TMAP" width={20} height={20} />
            TMAP
          </button>
        </motion.div>

        {/* 교통편 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 p-6 bg-gray-50 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">교통편 안내</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>🚇 지하철: 2·9호선 종합운동장역 9번 출구에서 도보 5분</p>
            <p>🚌 버스: 340, 350번</p>
            <p>🚗 주차: 건물 내 주차 / 발렛 가능 (3시간 무료)</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
