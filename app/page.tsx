"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { getSupabase } from "@/lib/supabase";
import type { Campaign } from "@/types";

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    async function load() {
      const { data } = await sb!
        .from("campaigns")
        .select("*")
        .eq("slug", "development-fund")
        .single();
      if (data) setCampaign(data as Campaign);
    }
    load();

    const channel = sb
      .channel("home-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "donations",
          filter: "status=eq.completed",
        },
        (payload) => {
          const newDonation = payload.new as { amount: number };
          setCampaign((prev) => {
            if (!prev) return prev;
            return { ...prev, raised_amount: prev.raised_amount + newDonation.amount };
          });
        },
      )
      .subscribe();

    return () => { sb.removeChannel(channel); };
  }, []);

  const raised = campaign?.raised_amount ?? 842500;
  const goal = campaign?.goal_amount ?? 5000000;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center">
        <Hero raised={raised} goal={goal} />
      </div>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </div>
  );
}
