"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Smartphone, Target } from "lucide-react";
import Header from "@/components/Header";
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
    <div className="min-h-screen bg-cream">
      <Header light />

      {/* Hero with progress */}
      <div className="bg-white border-b border-maroon/5">
        <CampaignHero
          title={title}
          description={description}
          raised={raised}
          goal={goal}
        />
      </div>

      {/* Main content — Clean two-column */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Give / Pledge tab toggle (Nobuk-style) */}
            <div className="flex rounded-lg bg-white border border-maroon/10 p-0.5 mb-6 shadow-sm">
              <button
                type="button"
                onClick={() => setTab("give")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  tab === "give"
                    ? "bg-maroon text-white shadow-sm"
                    : "text-maroon/50 hover:text-maroon"
                }`}
              >
                <Smartphone size={15} /> Give Now
              </button>
              <button
                type="button"
                onClick={() => setTab("pledge")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  tab === "pledge"
                    ? "bg-maroon text-white shadow-sm"
                    : "text-maroon/50 hover:text-maroon"
                }`}
              >
                <Target size={15} /> Pledge
              </button>
            </div>

            {tab === "give" ? <DonationForm /> : <PledgeForm />}

            <div className="mt-4">
              <TreasurerSignatories />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-4"
          >
            <DonorWall donations={donations} />
            <BankDetails />
          </motion.div>
        </div>
      </main>

      <div className="border-t border-maroon/5 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}
