import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json(
      { totalRaised: 0, totalDonors: 0, avgGift: 0, methodSplit: { mpesa: 0, bank: 0 } },
      { status: 200 },
    );
  }

  const { data: completed } = await sb
    .from("donations")
    .select("amount, method")
    .eq("status", "completed");

  const donations = (completed || []) as Array<{ amount: number; method: string }>;
  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = donations.length;
  const avgGift = totalDonors > 0 ? Math.round(totalRaised / totalDonors) : 0;
  const methodSplit = {
    mpesa: donations.filter((d) => d.method === "mpesa").reduce((s, d) => s + d.amount, 0),
    bank: donations.filter((d) => d.method === "bank").reduce((s, d) => s + d.amount, 0),
  };

  return NextResponse.json({ totalRaised, totalDonors, avgGift, methodSplit });
}
