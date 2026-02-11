"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith("/blog/") && !pathname.includes("/tags/");

  useEffect(() => {
    if (!isBlogPost) return;

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      setProgress(Math.min((window.scrollY / scrollHeight) * 100, 100));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBlogPost]);

  if (!isBlogPost) return null;

  return (
    <div className="fixed top-0 left-0 z-[60] h-0.5 w-full bg-transparent">
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--accent))",
        }}
      />
    </div>
  );
}
