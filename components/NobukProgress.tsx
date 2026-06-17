"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

interface NobukProgressProps {
  raised: number;
  goal: number;
}

export default function NobukProgress({ raised, goal }: NobukProgressProps) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <div className="space-y-3">
      {/* Stats row */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-maroon/50">
            Raised
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-maroon tabular-nums">
            KES <CountUp end={raised} duration={1.8} separator="," />
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium uppercase tracking-wider text-maroon/50">
            Goal
          </p>
          <p className="text-lg sm:text-xl font-semibold text-maroon/70 tabular-nums">
            KES {goal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress bar — clean horizontal like Nobuk/Chakra */}
      <div className="relative h-3 w-full bg-maroon/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-maroon to-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-maroon/60">{pct}% complete</span>
        <span className="text-maroon/40">
          {goal - raised > 0
            ? `KES ${(goal - raised).toLocaleString()} to go`
            : "Goal reached!"}
        </span>
      </div>
    </div>
  );
}
