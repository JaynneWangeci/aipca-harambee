import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { CampaignApiResponse } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json<CampaignApiResponse>(
      { campaign: null, recentDonations: [] },
      { status: 200 },
    );
  }

  const { data: raw } = await sb
    .from("campaigns")
    .select("id, title, slug, goal_amount, raised_amount, created_at")
    .eq("slug", slug)
    .single();

  type RawCampaign = {
    id: string;
    title: string;
    slug: string;
    goal_amount: number;
    raised_amount: number;
    created_at: string;
  };
  const campaign = raw ? (raw as RawCampaign) : null;

  const campaignId = campaign ? campaign.id : "";
  const { data: donations } = await sb
    .from("donations")
    .select("donor_name, amount, method, created_at, is_anonymous")
    .eq("status", "completed")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(10);

  const recentDonations = (donations || []).map((d: Record<string, unknown>) => ({
    donor_name: d.is_anonymous ? "Anonymous" : d.donor_name,
    amount: d.amount,
    method: d.method,
    created_at: d.created_at,
  })) as CampaignApiResponse["recentDonations"];

  const res = NextResponse.json<CampaignApiResponse>({
    campaign,
    recentDonations,
  });

  res.headers.set(
    "Cache-Control",
    "s-maxage=10, stale-while-revalidate=30",
  );

  return res;
}
