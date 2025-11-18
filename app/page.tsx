'use client';

import BGMPlayer from '@/components/BGMPlayer';
import HeroSection from '@/components/sections/HeroSection';
import InvitationSection from '@/components/sections/InvitationSection';
import GallerySection from '@/components/sections/GallerySection';
import WeddingInfoSection from '@/components/sections/WeddingInfoSection';
import ContactSection from '@/components/sections/ContactSection';
import ShareSection from '@/components/sections/ShareSection';

export default function Home() {
  // 청첩장 데이터 (실제 사용시 수정하세요)
  const weddingData = {
    groom: {
      name: '김신랑',
      father: '김아버지',
      mother: '김어머니',
      phone: '010-1234-5678',
      accountBank: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '김신랑',
    },
    bride: {
      name: '이신부',
      father: '이아버지',
      mother: '이어머니',
      phone: '010-9876-5432',
      accountBank: '신한은행',
      accountNumber: '987-654-321098',
      accountHolder: '이신부',
    },
    wedding: {
      date: '2025년 6월 14일 토요일',
      time: '오후 2시 30분',
      venue: '그랜드 컨벤션 웨딩홀',
      venueDetail: '3층 그랜드볼룸',
      address: '서울특별시 강남구 테헤란로 123',
      latitude: 37.5665,
      longitude: 126.9780,
    },
    invitation: {
      message: `서로가 마주보며 다져온 사랑을
이제 함께 한 곳을 바라보며
걸어갈 수 있는 큰 사랑으로 키우고자 합니다.

저희 두 사람이 사랑의 이름으로 지켜나갈
첫 걸음에 여러분을 초대합니다.

오셔서 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
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
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      {/* BGM 플레이어 */}
      <BGMPlayer audioSrc="/audio/bgm.mp3" autoPlay={true} />

      {/* 히어로 섹션 */}
      <HeroSection
        groomName={weddingData.groom.name}
        brideName={weddingData.bride.name}
        weddingDate={weddingData.wedding.date}
        weddingTime={weddingData.wedding.time}
        backgroundImage="/images/hero-bg.jpg"
      />

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
        thumbnailImage="/images/og-image.jpg"
        description={`${weddingData.wedding.date}에 저희 두 사람이 결혼합니다. 참석하셔서 축복해 주시면 감사하겠습니다.`}
      />

      {/* 푸터 */}
      <footer className="py-12 bg-gray-50 text-center text-sm text-gray-500">
        <p className="mb-2">
          {weddingData.groom.name} & {weddingData.bride.name}
        </p>
        <p>{weddingData.wedding.date}</p>
        <div className="mt-6 flex justify-center items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-rose-300" />
          <div className="w-1 h-1 rounded-full bg-rose-300" />
          <div className="w-1 h-1 rounded-full bg-rose-300" />
        </div>
      </footer>
    </main>
  );
}
