"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs font-medium text-accent uppercase sm:text-sm"
        >
          AI Research Engineer & PM
        </motion.p>

        <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
          <span className="gradient-text">Jae-Hyun Park</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-lg font-light tracking-wide text-text-secondary sm:text-xl"
        >
          Go Deeper and Further
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            href="/blog"
            className="glass-btn hover:glass-btn-hover px-7 py-3 text-sm font-medium text-text-primary"
          >
            Blog
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-border glass-btn hover:glass-btn-hover px-7 py-3 text-sm font-medium text-text-primary"
          >
            GitHub
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10"
      >
        <a
          href="#bio"
          className="flex flex-col items-center gap-1 text-text-secondary transition-colors hover:text-accent"
          aria-label="아래로 스크롤"
        >
          <ArrowDown size={18} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
