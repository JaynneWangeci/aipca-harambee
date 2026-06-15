"use client";

import { motion } from "framer-motion";

interface GivingEntry {
  donor_name: string;
  amount: number;
  created_at: string;
}

interface LiveGivingTickerProps {
  entries?: GivingEntry[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function maskName(name: string): string {
  if (name === "Anonymous" || !name) return "A well-wisher";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return name;
}

export default function LiveGivingTicker({ entries = [] }: LiveGivingTickerProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-maroon/10 bg-white/60 backdrop-blur-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-maroon/10 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-magenta/60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-magenta" />
          </span>
          <h3 className="font-display text-sm tracking-wide text-maroon">
            Recent giving
          </h3>
        </div>
        <div className="px-5 py-8 text-center text-sm text-ink/40">
          Be the first to give — your gift will appear here in real time.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-maroon/10 bg-white/60 backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-maroon/10 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-magenta/60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-magenta" />
        </span>
        <h3 className="font-display text-sm tracking-wide text-maroon">
          Recent giving
        </h3>
      </div>
      <ul className="divide-y divide-maroon/5">
        {entries.map((entry, i) => (
          <motion.li
            key={`${entry.donor_name}-${entry.created_at}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="px-5 py-3 flex items-center justify-between text-sm"
          >
            <div>
              <span className="font-medium text-ink">{maskName(entry.donor_name)}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-maroon font-semibold">
                KES {entry.amount.toLocaleString()}
              </div>
              <div className="text-xs text-ink/40">{timeAgo(entry.created_at)}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
