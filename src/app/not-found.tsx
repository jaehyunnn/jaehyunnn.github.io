import Link from "next/link";

export default function NotFound() {
  return (
    <section className="content-width flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <h1 className="font-display text-7xl font-bold sm:text-8xl">
        <span className="gradient-text">404</span>
      </h1>
      <p className="mt-6 text-lg text-text-secondary">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="gradient-border glass-btn hover:glass-btn-hover mt-10 px-7 py-3 text-sm font-medium text-text-primary"
      >
        홈으로 돌아가기
      </Link>
    </section>
  );
}
