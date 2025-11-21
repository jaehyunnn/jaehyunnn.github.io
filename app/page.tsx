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
      firstName: '재현',
      lastName: '박',
      name_eng: 'JaeHyun',
      father: '박준길',
      mother: '이상숙',
      phone: '010-2788-2543',
      accountBank: '기업은행',
      accountNumber: '065-154410-01-010',
      accountHolder: '박재현',
      kakaopayLink: 'https://link.kakaopay.com/__/dESqQ9P',
    },
    bride: {
      firstName: '가인',
      lastName: '김',
      name_eng: 'Gaain',
      father: '김연재',
      mother: '김선화',
      phone: '010-2450-4137',
      accountBank: '하나은행',
      accountNumber: '215-910417-00707',
      accountHolder: '김가인',
      kakaopayLink: 'https://link.kakaopay.com/__/48elydi',
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
우연은 어느새 필연이 되었습니다.

처음 만났던 그날처럼 청명한 가을,
여러 해를 지나 더욱 깊어진 우리가
또 한 번의 신선한 가을을 맞이하려 합니다.

함께라는 이름으로 물들어갈
저희의 가장 빛나는 계절에
소중한 분들을 초대합니다.`,
    },
    photos: [
      {
        src: '/images/photo1.jpg',
        caption: '',
        rotation: -2,
      },
      {
        src: '/images/photo2.jpg',
        caption: '',
        rotation: 1,
      },
      {
        src: '/images/photo3.jpg',
        caption: '',
        rotation: -1,
      },
      {
        src: '/images/photo4.jpg',
        caption: '',
        rotation: 2,
      },
      {
        src: '/images/photo5.jpg',
        caption: '',
        rotation: -3,
      },
      {
        src: '/images/photo6.jpg',
        caption: '',
        rotation: 1,
      },
      {
        src: '/images/photo7.jpg',
        caption: '',
        rotation: -2,
      },
      {
        src: '/images/photo8.jpg',
        caption: '',
        rotation: 3,
      },
      {
        src: '/images/photo9.jpg',
        caption: '',
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
        groomName={`${weddingData.groom.lastName}${weddingData.groom.firstName}`}
        brideName={`${weddingData.bride.lastName}${weddingData.bride.firstName}`}
        weddingDate={weddingData.wedding.date}
        weddingTime={weddingData.wedding.time}
        venue={weddingData.wedding.venue}
        backgroundImage="/images/hero-bg.jpg"
      />

      {/* 예식일 달력 */}
      <CalendarSection year={2026} month={8} day={23} />

      {/* 초대 인사 */}

      <InvitationSection
        invitationMessage={weddingData.invitation.message}
        groomFather={weddingData.groom.father}
        groomMother={weddingData.groom.mother}
        groomName={weddingData.groom.firstName}
        brideFather={weddingData.bride.father}
        brideMother={weddingData.bride.mother}
        brideName={weddingData.bride.firstName}
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
          name: `${weddingData.groom.lastName}${weddingData.groom.firstName}`,
          phone: weddingData.groom.phone,
          accountBank: weddingData.groom.accountBank,
          accountNumber: weddingData.groom.accountNumber,
          accountHolder: weddingData.groom.accountHolder,
          kakaopayLink: weddingData.groom.kakaopayLink,
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
          name: `${weddingData.bride.lastName}${weddingData.bride.firstName}`,
          phone: weddingData.bride.phone,
          accountBank: weddingData.bride.accountBank,
          accountNumber: weddingData.bride.accountNumber,
          accountHolder: weddingData.bride.accountHolder,
          kakaopayLink: weddingData.bride.kakaopayLink,
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
        groomName={weddingData.groom.firstName}
        brideName={weddingData.bride.firstName}
        weddingDate={weddingData.wedding.date}
        thumbnailImage="/images/hero-bg.jpg"
        description={`${weddingData.wedding.date} ${weddingData.wedding.time} · ${weddingData.wedding.venue}`}
      />

      {/* 푸터 */}
      <footer className="py-16 relative bg-[#fbfaf8]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        <div className="max-w-2xl mx-auto text-center px-6">
          <div className="w-8 h-px bg-stone-200 mx-auto mb-8" />
          <p className="mb-3 text-amber-950 text-lg font-medium tracking-widest">
            {weddingData.groom.firstName} <span className="text-stone-400 mx-2 text-sm">|</span> {weddingData.bride.firstName}
          </p>
          <p className="text-stone-500 text-sm font-light tracking-wider mb-8">{weddingData.wedding.date}</p>

          <p className="text-[10px] text-stone-400 font-light tracking-widest uppercase">
            Copyright © 2025 Jae-Hyun Park. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
