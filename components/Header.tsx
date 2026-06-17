"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/give", label: "Give" },
  { href: "/leadership", label: "Leadership" },
  { href: "/watch", label: "Watch" },
  { href: "/about", label: "About" },
];

interface HeaderProps {
  light?: boolean;
}

export default function Header({ light }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isDark = !light;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isDark
          ? scrolled
            ? "bg-ink/95 backdrop-blur-md shadow-lg"
            : "bg-ink/80 backdrop-blur-sm"
          : "bg-white/95 backdrop-blur-md border-b border-maroon/5"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isDark ? "bg-gold/20 group-hover:bg-gold/30" : "bg-maroon/10 group-hover:bg-maroon/20"
          }`}>
            <span className={`font-display text-lg font-bold ${
              isDark ? "text-gold" : "text-maroon"
            }`}>A</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-display text-base sm:text-lg leading-tight transition-colors ${
              isDark
                ? "text-cream group-hover:text-gold"
                : "text-maroon group-hover:text-maroon/70"
            }`}>
              AIPCA Bahati Cathedral
            </span>
            <span className={`font-mono text-[10px] tracking-widest uppercase ${
              isDark ? "text-cream/40" : "text-maroon/40"
            }`}>
              Development Fund
            </span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-all ${
                pathname === item.href
                  ? isDark ? "text-gold" : "text-maroon font-semibold"
                  : isDark ? "text-cream/60 hover:text-cream" : "text-maroon/50 hover:text-maroon"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/give"
            className="px-5 py-2.5 rounded-full bg-gold text-maroon font-display font-semibold text-sm hover:bg-maroon hover:text-cream hover:scale-105 transition-all shadow-lg shadow-gold/20"
          >
            Give now
          </Link>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`sm:hidden p-2 ${isDark ? "text-cream" : "text-maroon"}`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`sm:hidden overflow-hidden border-t ${
              isDark ? "bg-ink border-cream/10" : "bg-white border-maroon/10"
            }`}
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-colors py-2 ${
                    pathname === item.href
                      ? isDark ? "text-gold" : "text-maroon"
                      : isDark ? "text-cream/70 hover:text-cream" : "text-maroon/60 hover:text-maroon"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/give"
                className="mt-3 px-5 py-3 rounded-full bg-gold text-maroon font-display font-semibold text-base text-center hover:bg-maroon hover:text-cream transition-colors"
              >
                Give now — support the fund
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
