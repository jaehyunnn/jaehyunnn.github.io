"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useLang } from "@/components/home/LangContext";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Bio", href: "/#bio" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle: toggleLang } = useLang();

  function handleNavClick(e: React.MouseEvent, href: string) {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (pathname === "/") {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      } else {
        e.preventDefault();
        router.push(href);
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/blog") return pathname.startsWith("/blog");
    return false;
  }

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b border-border/50"
      style={{
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        background: "var(--surface)",
      }}
    >
      <nav className="content-width flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight"
        >
          <span className="gradient-text">Jae-Hyun Park</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-1 border-l border-border/50 pl-3">
            <button
              onClick={toggleLang}
              className="flex h-9 items-center gap-1 rounded-xl px-2.5 text-text-secondary transition-all hover:text-text-primary hover:bg-surface-hover"
              aria-label={lang === "en" ? "한국어로 전환" : "Switch to English"}
            >
              <Languages size={16} />
              <span className="text-xs font-medium">{lang === "en" ? "KO" : "EN"}</span>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={toggleLang}
            className="flex h-9 items-center gap-1 rounded-xl px-2 text-text-secondary transition-all hover:text-text-primary hover:bg-surface-hover"
            aria-label={lang === "en" ? "한국어로 전환" : "Switch to English"}
          >
            <Languages size={16} />
            <span className="text-xs font-medium">{lang === "en" ? "KO" : "EN"}</span>
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-all hover:text-text-primary hover:bg-surface-hover"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border/50 px-4 pb-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
