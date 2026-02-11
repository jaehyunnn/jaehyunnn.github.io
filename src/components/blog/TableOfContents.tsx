"use client";

import { useState, useEffect } from "react";
import { List, X } from "lucide-react";
import type { TocItem } from "@/types/notion";

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Track active heading via IntersectionObserver
  useEffect(() => {
    const ids = toc.map((item) => item.id);
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -75% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="glass fixed right-4 bottom-4 z-40 flex h-10 w-10 items-center justify-center lg:hidden"
        aria-label="목차 토글"
      >
        {open ? <X size={18} /> : <List size={18} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* TOC panel */}
      <nav
        className={`toc-panel fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-l border-border bg-background p-5 transition-transform lg:relative lg:top-0 lg:block lg:h-auto lg:w-auto lg:translate-x-0 lg:border-0 lg:bg-transparent lg:p-0 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Desktop: glass card wrapper */}
        <div className="hidden lg:block">
          <div className="rounded-2xl border border-glass-border bg-surface/60 p-4 backdrop-blur-xl">
            <p className="mb-3 text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              On this page
            </p>
            <div className="toc-scroll max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
              <ul className="space-y-0.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`toc-link block rounded-lg px-2.5 py-1.5 text-[0.8rem] leading-snug transition-all duration-200 ${
                        item.level === 3 ? "ml-3" : ""
                      } ${
                        activeId === item.id
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile: plain list */}
        <div className="lg:hidden">
          <p className="mb-3 text-xs font-semibold tracking-wider text-text-secondary uppercase">
            목차
          </p>
          <ul className="space-y-1.5">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block text-sm text-text-secondary transition-colors hover:text-accent ${
                    item.level === 3 ? "pl-4" : ""
                  } ${activeId === item.id ? "font-medium text-accent" : ""}`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
