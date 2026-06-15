"use client";

import { motion } from "framer-motion";
import ArchProgress from "@/components/ArchProgress";
import CathedralBackground from "@/components/CathedralBackground";
import Link from "next/link";

interface HeroProps {
  raised: number;
  goal: number;
}

export default function Hero({ raised, goal }: HeroProps) {
  return (
    <section className="relative overflow-hidden w-full flex items-center min-h-[calc(100vh-5rem)]">
      <CathedralBackground objectPosition="center bottom" />
      <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

      <div className="relative w-full max-w-5xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.25em] mb-4 sm:mb-6">
            AIPCA Cathedral, Bahati · Eastlands, Nairobi
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl text-cream font-bold text-center leading-[1.1]"
        >
          Building together,
          <br />
          <span className="italic text-gold">for generations to come</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-3 sm:mt-4 text-cream text-center max-w-xl mx-auto text-sm sm:text-base"
        >
          Support the sanctuary, fellowship hall, ministries, and grounds of
          AIPCA Bahati Cathedral. Every gift builds something eternal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 sm:mt-8"
        >
          <ArchProgress raised={raised} goal={goal} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/give"
            className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gold text-maroon font-semibold text-sm sm:text-base hover:bg-cream hover:scale-105 transition-all shadow-xl shadow-gold/30"
          >
            Give now
          </Link>
          <Link
            href="/watch"
            className="px-8 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-cream/30 text-cream font-semibold text-sm sm:text-base hover:bg-cream/10 hover:border-cream/50 transition-all"
          >
            Watch services
          </Link>
          <Link
            href="/about"
            className="text-cream/70 hover:text-cream text-xs sm:text-sm transition-all"
          >
            Learn more
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
