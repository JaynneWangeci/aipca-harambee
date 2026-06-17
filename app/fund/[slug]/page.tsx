"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Smartphone, Target } from "lucide-react";
import CathedralBackground from "@/components/CathedralBackground";
import CampaignHero from "@/components/CampaignHero";
import DonorWall from "@/components/DonorWall";
import TreasurerSignatories from "@/components/TreasurerSignatories";
import BankDetails from "@/components/BankDetails";
import DonationForm from "@/components/DonationForm";
import PledgeForm from "@/components/PledgeForm";
import Footer from "@/components/Footer";
import type { CampaignApiResponse, Donation } from "@/types";

interface FundPageProps {
  params: Promise<{ slug: string }>;
}

export default function FundPage({ params }: FundPageProps) {
  const [campaign, setCampaign] = useState<CampaignApiResponse["campaign"]>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [slug, setSlug] = useState("");
  const [tab, setTab] = useState<"give" | "pledge">("give");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const fetchCampaign = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch(`/api/campaigns/${slug}`);
      const data: CampaignApiResponse = await res.json();
      if (data.campaign) setCampaign(data.campaign);
      if (data.recentDonations) setDonations(data.recentDonations);
    } catch {}
  }, [slug]);

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 10_000);
    return () => clearInterval(interval);
  }, [fetchCampaign]);

  const title = campaign?.title || "Development Fund";
  const description =
    "Support the sanctuary, fellowship hall, ministries, and grounds of AIPCA Bahati Cathedral. Every gift builds something eternal.";
  const raised = campaign?.raised_amount ?? 842500;
  const goal = campaign?.goal_amount ?? 5000000;

  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 40%" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

        <div className="relative w-full">
          <CampaignHero
            title={title}
            description={description}
            raised={raised}
            goal={goal}
          />

          <div className="max-w-5xl mx-auto px-6 pb-12">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scroll"
              >
                <h2 className="text-xl text-cream font-bold mb-1">
                  {tab === "give"
                    ? `Give to the ${title}`
                    : `Pledge to the ${title}`}
                </h2>
                <p className="text-cream/60 text-xs sm:text-sm mb-4">
                  {tab === "give"
                    ? "Give now via M-Pesa or bank transfer."
                    : "Promise an amount now, send it later."}
                </p>

                {/* Tab toggle */}
                <div className="flex rounded-xl bg-cream/10 border border-cream/10 p-1 mb-4">
                  <button
                    type="button"
                    onClick={() => setTab("give")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === "give"
                        ? "bg-gold text-maroon"
                        : "text-cream/60 hover:text-cream"
                    }`}
                  >
                    <Smartphone size={16} /> Give Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("pledge")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === "pledge"
                        ? "bg-gold text-maroon"
                        : "text-cream/60 hover:text-cream"
                    }`}
                  >
                    <Target size={16} /> Pledge
                  </button>
                </div>

                {tab === "give" ? <DonationForm /> : <PledgeForm />}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4"
                >
                  <TreasurerSignatories />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <DonorWall donations={donations} />
                <BankDetails />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
