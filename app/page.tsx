'use client';

import { useState } from 'react';
import BGMPlayer from '@/components/BGMPlayer';
import IntroSection from '@/components/sections/IntroSection';
import HeroSection from '@/components/sections/HeroSection';
import CalendarSection from '@/components/sections/CalendarSection';
import InvitationSection from '@/components/sections/InvitationSection';
import GallerySection from '@/components/sections/GallerySection';
import WeddingInfoSection from '@/components/sections/WeddingInfoSection';
import ContactSection from '@/components/sections/ContactSection';
import ShareSection from '@/components/sections/ShareSection';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  // 청첩장 데이터 (실제 사용시 수정하세요)
  const weddingData = {
    groom: {
      name: '박재현',
      name_eng: 'Jae-Hyun',
      father: '박준길',
      mother: '이상숙',
      phone: '010-2788-2543',
      accountBank: '기업은행',
      accountNumber: '065-154410-01-010',
      accountHolder: '박재현',
    },
    bride: {
      name: '김가인',
      name_eng: 'Gaain',
      father: '김연재',
      mother: '김선화',
      phone: '010-2450-4137',
      accountBank: '하나은행',
      accountNumber: '215-910417-00707',
      accountHolder: '김가인',
    },
    wedding: {
      date: '2026년 8월 23일 일요일',
      time: '오전 11시',
      venue: '라브르 에드니아',
      venueDetail: '단독홀',
      address: '서울특별시 송파구 백제고분로 95',
      latitude: 37.508439,
      longitude: 127.079492,
    },
    invitation: {
      message: `무더운 여름의 끝,
선선한 가을바람에 실려 온
'우연'은 어느새 '필연'이 되었습니다.

처음 만났던 그날처럼 청명한 가을,
여러 해를 지나 더욱 깊어진 우리가
또 한 번의 신선한 가을을 맞이하려 합니다.

'함께'라는 이름으로 물들어갈
저희의 가장 빛나는 계절에
소중한 분들을 초대합니다.`,
    },
    photos: [
      {
        src: '/images/photo1.jpg',
        caption: '첫 만남',
        rotation: -2,
      },
      {
        src: '/images/photo2.jpg',
        caption: '행복한 순간',
        rotation: 1,
      },
      {
        src: '/images/photo3.jpg',
        caption: '프로포즈',
        rotation: -1,
      },
      {
        src: '/images/photo4.jpg',
        caption: '함께한 시간',
        rotation: 2,
      },
      {
        src: '/images/photo5.jpg',
        caption: '우리의 약속',
        rotation: -3,
      },
      {
        src: '/images/photo6.jpg',
        caption: '영원히',
        rotation: 1,
      },
      {
        src: '/images/photo7.jpg',
        caption: '특별한 날',
        rotation: -2,
      },
      {
        src: '/images/photo8.jpg',
        caption: '사랑의 순간',
        rotation: 3,
      },
      {
        src: '/images/photo9.jpg',
        caption: '함께 걸을 길',
        rotation: -1,
      },
    ],
  };

  return (
    <main className="min-h-screen relative">
      {/* 인트로 섹션 */}
      {showIntro && (
        <IntroSection
          groomName={weddingData.groom.name_eng}
          brideName={weddingData.bride.name_eng}
          weddingDate={weddingData.wedding.date}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* BGM 플레이어 - 인트로 완료 후 자동 재생 */}
      <BGMPlayer audioSrc="/audio/bgm.mp3" autoPlay={!showIntro} />

      {/* 히어로 섹션 */}
      <HeroSection
        groomName={weddingData.groom.name}
        brideName={weddingData.bride.name}
        weddingDate={weddingData.wedding.date}
        weddingTime={weddingData.wedding.time}
        backgroundImage="/images/hero-bg.jpg"
      />

      {/* 예식일 달력 */}
      <CalendarSection year={2026} month={8} day={23} />

      {/* 초대 인사 */}
      <InvitationSection
        invitationMessage={weddingData.invitation.message}
        groomFather={weddingData.groom.father}
        groomMother={weddingData.groom.mother}
        groomName={weddingData.groom.name}
        brideFather={weddingData.bride.father}
        brideMother={weddingData.bride.mother}
        brideName={weddingData.bride.name}
      />

      {/* 갤러리 */}
      <GallerySection photos={weddingData.photos} />

      {/* 예식 정보 */}
      <WeddingInfoSection
        date={weddingData.wedding.date}
        time={weddingData.wedding.time}
        venue={weddingData.wedding.venue}
        address={weddingData.wedding.address}
        venueDetail={weddingData.wedding.venueDetail}
        latitude={weddingData.wedding.latitude}
        longitude={weddingData.wedding.longitude}
      />

      {/* 연락처 및 계좌정보 */}
      <ContactSection
        groom={{
          name: weddingData.groom.name,
          phone: weddingData.groom.phone,
          accountBank: weddingData.groom.accountBank,
          accountNumber: weddingData.groom.accountNumber,
          accountHolder: weddingData.groom.accountHolder,
        }}
        groomFather={{
          name: weddingData.groom.father,
          phone: '010-1111-2222',
        }}
        groomMother={{
          name: weddingData.groom.mother,
          phone: '010-3333-4444',
        }}
        bride={{
          name: weddingData.bride.name,
          phone: weddingData.bride.phone,
          accountBank: weddingData.bride.accountBank,
          accountNumber: weddingData.bride.accountNumber,
          accountHolder: weddingData.bride.accountHolder,
        }}
        brideFather={{
          name: weddingData.bride.father,
          phone: '010-5555-6666',
        }}
        brideMother={{
          name: weddingData.bride.mother,
          phone: '010-7777-8888',
        }}
      />

      {/* 공유하기 */}
      <ShareSection
        groomName={weddingData.groom.name}
        brideName={weddingData.bride.name}
        weddingDate={weddingData.wedding.date}
        thumbnailImage="/images/hero-bg.jpg"
        description={`${weddingData.wedding.date} ${weddingData.wedding.time} · ${weddingData.wedding.venue}`}
      />

      {/* 푸터 - 궁전 테마 */}
      <footer className="py-12 relative">
        <div className="max-w-2xl mx-auto text-center glass-strong rounded-3xl p-8 shadow-xl mx-6 border-2 border-amber-200/40">
          <p className="mb-2 text-amber-900 text-lg tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
            {weddingData.groom.name} <span className="text-amber-600 mx-2">&</span> {weddingData.bride.name}
          </p>
          <p className="text-amber-800/80">{weddingData.wedding.date}</p>
          <div className="mt-6 flex justify-center items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500/60 shadow-lg" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60 shadow-lg" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60 shadow-lg" />
          </div>
        </div>
      </footer>
    </main>
  );
}
