import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // GitHub Pages를 위한 정적 export
  // basePath 제거: username.github.io 저장소는 루트 경로 사용
  images: {
    unoptimized: true, // GitHub Pages는 이미지 최적화 미지원
  },
};

export default nextConfig;
