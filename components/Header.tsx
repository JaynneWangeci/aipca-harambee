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
  { href: "/watch", label: "Watch" },
  { href: "/about", label: "About" },
];

export default function Header() {
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/95 backdrop-blur-md shadow-lg"
          : "bg-ink/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
            <span className="font-display text-gold text-lg font-bold">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg text-cream group-hover:text-gold transition-colors leading-tight">
              AIPCA Bahati Cathedral
            </span>
            <span className="font-mono text-[10px] text-cream/40 tracking-widest uppercase">
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
                  ? "text-gold"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/give"
            className="px-5 py-2.5 rounded-full bg-gold text-maroon font-display font-semibold text-sm hover:bg-cream hover:scale-105 transition-all shadow-lg shadow-gold/20"
          >
            Give now
          </Link>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-cream p-2"
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
            className="sm:hidden overflow-hidden bg-ink border-t border-cream/10"
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-colors py-2 ${
                    pathname === item.href
                      ? "text-gold"
                      : "text-cream/70 hover:text-cream"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/give"
                className="mt-3 px-5 py-3 rounded-full bg-gold text-maroon font-display font-semibold text-base text-center hover:bg-cream transition-colors"
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
