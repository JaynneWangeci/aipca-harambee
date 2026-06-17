"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CathedralBackground from "@/components/CathedralBackground";
import Footer from "@/components/Footer";
import type { CommitteeMember } from "@/types";

const GROUP_ORDER = [
  "Executive",
  "Women's Council",
  "Men's Council",
  "Development Committee",
];

const GROUP_LABELS: Record<string, string> = {
  Executive: "Executive Board",
  "Women's Council": "Women's Council",
  "Men's Council": "Men's Council",
  "Development Committee": "Development Committee",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function LeadershipPage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);

  useEffect(() => {
    fetch("/api/committee")
      .then((r) => r.json())
      .then(setMembers)
      .catch(() => {});
  }, []);

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    members: members.filter((m) => m.group_name === group),
  })).filter((g) => g.members.length > 0);

  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 60%" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

        <div className="relative w-full max-w-5xl mx-auto px-6 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-xs transition-colors mb-4">
            <ArrowLeft size={14} /> Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-3xl sm:text-4xl text-cream">
              Harambee <span className="italic text-gold">Leadership</span>
            </h1>
            <p className="text-cream/70 text-sm mt-1 max-w-lg mx-auto">
              The stewards accountable to the parish for every shilling raised and spent.
            </p>
          </motion.div>

          <div className="space-y-8">
            {grouped.map(({ group, label, members }) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display text-gold text-sm uppercase tracking-wider mb-3">
                  {label}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {members.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-cream/10 rounded-2xl p-4 border border-cream/10 flex items-center gap-3 backdrop-blur-sm"
                    >
                      <div className="w-11 h-11 rounded-full bg-maroon flex items-center justify-center shrink-0 border-2 border-gold/30">
                        <span className="font-display text-gold text-sm font-bold">
                          {initials(m.name)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-cream text-sm truncate">
                          {m.name}
                        </p>
                        <p className="text-cream/50 text-[10px] font-mono uppercase tracking-wider mt-0.5 truncate">
                          {m.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
