"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, TrendingUp, Users, Banknote } from "lucide-react";
import Link from "next/link";
import CathedralBackground from "@/components/CathedralBackground";
import Footer from "@/components/Footer";
import type { Campaign, Donation } from "@/types";

interface Aggregates {
  totalRaised: number;
  totalDonors: number;
  avgGift: number;
  methodSplit: { mpesa: number; bank: number };
}

export default function TransparencyPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [aggregates, setAggregates] = useState<Aggregates | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [campRes, aggRes] = await Promise.all([
          fetch("/api/campaigns/development-fund"),
          fetch("/api/ledger/aggregates"),
        ]);
        const campData = await campRes.json();
        setCampaign(campData.campaign);

        if (aggRes.ok) {
          const aggData = await aggRes.json();
          setAggregates(aggData);
        }
      } catch {}
    }
    load();
  }, []);

  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 50%" />
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
              Fund <span className="italic text-gold">Transparency</span>
            </h1>
            <p className="text-cream/70 text-sm mt-1 max-w-lg mx-auto">
              Every shilling accounted for — because you deserve to see where your gift goes.
            </p>
          </motion.div>

          {campaign && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-3 gap-4 mb-6"
            >
              {[
                { icon: TrendingUp, label: "Raised So Far", value: `KES ${campaign.raised_amount.toLocaleString()}` },
                { icon: Banknote, label: "Our Goal", value: `KES ${campaign.goal_amount.toLocaleString()}` },
                { icon: TrendingUp, label: "Progress", value: `${Math.round((campaign.raised_amount / campaign.goal_amount) * 100)}%` },
              ].map((stat) => (
                <div key={stat.label} className="bg-cream/10 rounded-2xl p-4 border border-cream/10 text-center">
                  <stat.icon className="text-gold mx-auto mb-1.5" size={20} />
                  <p className="text-cream/50 text-[10px] font-mono uppercase tracking-wider">{stat.label}</p>
                  <p className="text-cream text-lg font-bold mt-0.5 font-display">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          {aggregates && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-cream/10 rounded-2xl p-5 border border-cream/10 mb-6"
            >
              <h2 className="font-display text-gold text-sm uppercase tracking-wider mb-3">Giving Summary</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-cream/50 text-[10px] font-mono uppercase">Total Donors</p>
                  <p className="text-cream text-lg font-bold">{aggregates.totalDonors}</p>
                </div>
                <div>
                  <p className="text-cream/50 text-[10px] font-mono uppercase">Average Gift</p>
                  <p className="text-cream text-lg font-bold">KES {aggregates.avgGift.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-cream/50 text-[10px] font-mono uppercase">M-Pesa</p>
                  <p className="text-cream text-lg font-bold">KES {aggregates.methodSplit.mpesa.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-cream/50 text-[10px] font-mono uppercase">Bank Transfer</p>
                  <p className="text-cream text-lg font-bold">KES {aggregates.methodSplit.bank.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <a
              href="/api/ledger/export"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-maroon font-display font-semibold text-sm hover:bg-cream transition-colors"
            >
              <Download size={16} /> Download Full Ledger (CSV)
            </a>
            <p className="text-cream/40 text-[10px] mt-2 font-mono">
              Includes all donations. For treasurer reconciliation.
            </p>
          </motion.div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
