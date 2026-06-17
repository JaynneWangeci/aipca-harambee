"use client";

import { motion } from "framer-motion";
import type { Donation } from "@/types";

interface DonorWallProps {
  donations: Donation[];
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
  if (parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`;
  return name;
}

export default function DonorWall({ donations }: DonorWallProps) {
  return (
    <div className="bg-white rounded-xl border border-maroon/10 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-maroon/5">
        <h3 className="font-semibold text-maroon text-sm">Recent gifts</h3>
      </div>
      {donations.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-maroon/40">
          Be the first to give.
        </div>
      ) : (
        <ul className="divide-y divide-maroon/5 max-h-[300px] overflow-y-auto">
          {donations.map((entry, i) => (
            <motion.li
              key={entry.id || `${entry.donor_name}-${entry.created_at}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="px-4 py-2.5 flex items-center justify-between text-sm"
            >
              <span className="text-maroon/70">{maskName(entry.donor_name)}</span>
              <div className="text-right">
                <div className="font-semibold text-maroon tabular-nums">
                  KES {entry.amount.toLocaleString()}
                </div>
                <div className="text-[10px] text-maroon/40">{timeAgo(entry.created_at)}</div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
