import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "@/styles/globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { LangProvider } from "@/components/home/LangContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jae-Hyun Park | Portfolio",
    template: "%s | Jae-Hyun Park",
  },
  description: "개발자 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LangProvider>
            <div className="bg-orb-3" aria-hidden="true" />
            <div className="noise-overlay" aria-hidden="true" />
            <ScrollProgress />
            <Header />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
