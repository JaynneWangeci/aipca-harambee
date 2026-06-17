import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request);
  if (!token || !verifyToken(token)) return unauthorized();

  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: completed } = await sb
    .from("donations")
    .select("amount, method, created_at, honored_member_id")
    .eq("status", "completed");

  const { data: pledges } = await sb
    .from("pledges")
    .select("amount, fulfilled_amount, status");

  const { data: members } = await sb
    .from("committee_members")
    .select("id, name")
    .eq("is_active", true);

  const allDonations = (completed || []) as Array<{ amount: number; method: string; created_at: string; honored_member_id: string | null }>;
  const allPledges = (pledges || []) as Array<{ amount: number; fulfilled_amount: number; status: string }>;
  const allMembers = (members || []) as Array<{ id: string; name: string }>;

  const totalRaised = allDonations.reduce((s, d) => s + d.amount, 0);
  const totalDonors = allDonations.length;
  const avgGift = totalDonors > 0 ? Math.round(totalRaised / totalDonors) : 0;

  const methodSplit = {
    mpesa: allDonations.filter((d) => d.method === "mpesa").reduce((s, d) => s + d.amount, 0),
    bank: allDonations.filter((d) => d.method === "bank").reduce((s, d) => s + d.amount, 0),
  };

  // Member honor roll: how much given in honor of each member
  const memberHonors = allMembers.map((m) => ({
    id: m.id,
    name: m.name,
    total: allDonations
      .filter((d) => d.honored_member_id === m.id)
      .reduce((s, d) => s + d.amount, 0),
    count: allDonations.filter((d) => d.honored_member_id === m.id).length,
  })).sort((a, b) => b.total - a.total);

  // Pledge stats
  const totalPledged = allPledges.reduce((s, p) => s + p.amount, 0);
  const totalFulfilled = allPledges.reduce((s, p) => s + p.fulfilled_amount, 0);
  const pendingPledges = allPledges.filter((p) => p.status === "pending" || p.status === "partially_fulfilled");
  const pledgeFulfillmentRate = totalPledged > 0 ? Math.round((totalFulfilled / totalPledged) * 100) : 0;

  // Recent activity (last 20 donations)
  const recentActivity = allDonations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)
    .map((d) => ({
      ...d,
      created_at: d.created_at,
    }));

  return NextResponse.json({
    totalRaised,
    totalDonors,
    avgGift,
    methodSplit,
    memberHonors,
    pledges: {
      total: totalPledged,
      fulfilled: totalFulfilled,
      pending: pendingPledges.length,
      fulfillmentRate: pledgeFulfillmentRate,
    },
    recentActivity,
  });
}
