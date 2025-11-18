import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nanumPen = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "모바일 청첩장 - 우리 결혼합니다",
  description: "소중한 분들을 초대합니다",
  openGraph: {
    title: "모바일 청첩장",
    description: "우리의 특별한 날을 함께해 주세요",
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKR.variable} ${nanumPen.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
