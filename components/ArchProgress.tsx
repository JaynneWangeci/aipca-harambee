"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

interface ArchProgressProps {
  raised: number;
  goal: number;
}

export default function ArchProgress({ raised, goal }: ArchProgressProps) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  // Arch path: a rounded-top window shape. The ring traces around the arch outline.
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-full max-w-[340px] mx-auto">
      {/* Arch frame */}
      <svg
        viewBox="0 0 320 380"
        className="w-full drop-shadow-[0_0_40px_rgba(232,184,75,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="archGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8B84B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C9447A" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="archTrack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Track: full arch outline */}
        <path
          d="M 20 360 L 20 140 A 140 140 0 0 1 300 140 L 300 360"
          fill="none"
          stroke="url(#archTrack)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Progress: animated stroke */}
        <motion.path
          d="M 20 360 L 20 140 A 140 140 0 0 1 300 140 L 300 360"
          fill="none"
          stroke="url(#archGlow)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        />

        {/* Inner glow panel, like light through stained glass */}
        <motion.path
          d="M 36 360 L 36 146 A 124 124 0 0 1 284 146 L 284 360 Z"
          fill="url(#archGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 + (pct / 100) * 0.14 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        />
      </svg>

      {/* Centered stats */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 text-center px-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold/90 mb-2">
          Raised so far
        </span>
        <div className="font-mono text-4xl sm:text-5xl font-semibold text-cream tabular-nums">
          <CountUp end={raised} duration={1.8} separator="," prefix="KES " />
        </div>
        <div className="mt-3 h-px w-16 bg-gold/40" />
        <span className="mt-3 font-display text-sm text-cream/70">
          of KES {goal.toLocaleString()} goal
        </span>
        <span className="mt-1 font-mono text-xs text-gold/80">{pct}% there</span>
      </div>
    </div>
  );
}
