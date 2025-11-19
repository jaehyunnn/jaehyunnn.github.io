import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

// Pretendard 폰트 (로컬)
const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

const nanumPen = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "재현 & 가인 - 우리 결혼합니다",
  description: "소중한 분들을 초대합니다",
  openGraph: {
    title: "💍 가인 & 재현의 결혼식에 초대합니다.",
    description: "2026년 8월 23일(월) 오전 11시·라브르에드니아",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${pretendard.variable} ${nanumPen.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
