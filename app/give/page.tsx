"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Smartphone, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DonationForm from "@/components/DonationForm";
import LiveGivingTicker from "@/components/LiveGivingTicker";
import CathedralBackground from "@/components/CathedralBackground";
import Footer from "@/components/Footer";
import { getSupabase } from "@/lib/supabase";
import type { Campaign, Donation } from "@/types";

export default function GivePage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const sb = getSupabase();
    async function load() {
      const { data } = await sb.from("campaigns").select("*").eq("slug", "development-fund").single();
      if (data) setCampaign(data as Campaign);
      const { data: donations } = await sb
        .from("donations").select("*").eq("status", "completed")
        .order("created_at", { ascending: false }).limit(5);
      if (donations) setRecentDonations(donations as Donation[]);
    }
    load();
    const channel = sb.channel("give-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "donations", filter: "status=eq.completed" },
        (p) => setRecentDonations((prev) => [p.new as Donation, ...prev].slice(0, 5)))
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, []);

  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 30%" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

        <div className="relative w-full max-w-5xl mx-auto px-6 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-xs transition-colors mb-3">
            <ArrowLeft size={14} /> Home
          </Link>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scroll"
            >
              <h1 className="text-2xl sm:text-3xl text-cream font-bold mb-1">
                Give to the <span className="italic text-gold">Development Fund</span>
              </h1>
              <p className="text-cream text-xs sm:text-sm mb-4">
                Your gift powers sanctuary, fellowship hall, ministries, and grounds — all at once.
              </p>
              <DonationForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <LiveGivingTicker entries={recentDonations} />
              <div className="bg-cream/10 rounded-2xl p-4 border border-cream/10 space-y-3">
                {[
                  { icon: Shield, text: "All transactions processed through Safaricom M-Pesa and Equity Bank. No payment data passes through this website." },
                  { icon: Smartphone, text: "Enter your phone for M-Pesa — you'll receive an STK prompt to confirm instantly." },
                  { icon: Building2, text: "Choose Bank/Card to donate via Equity Bank's secure payment portal." },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-2">
                    <item.icon className="text-gold shrink-0 mt-0.5" size={14} />
                    <p className="text-cream/50 text-[11px]">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
