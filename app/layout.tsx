import type { Metadata, Viewport } from "next";
import { Nanum_Pen_Script, Noto_Serif_KR, Cinzel } from "next/font/google";
import "./globals.css";

const nanumPen = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "재현 & 가인 - 결혼합니다",
  description: "소중한 분들을 초대합니다",
  openGraph: {
    title: "💍 가인 & 재현의 결혼식에 초대합니다.",
    description: "2026년 8월 23일(일) 오전 11시·라브르 에드니아",
    images: ["/images/hero-bg.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
        {/* Pretendard 폰트 preload - TTF */}
        <link
          rel="preload"
          href="/fonts/Pretendard-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Pretendard-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${nanumPen.variable} ${notoSerifKR.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
