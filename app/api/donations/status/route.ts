import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { DonationPollResponse } from "@/types";

export async function GET(request: NextRequest) {
  const checkoutRequestId = request.nextUrl.searchParams.get("checkoutRequestId");

  if (!checkoutRequestId) {
    return NextResponse.json(
      { error: "Missing checkoutRequestId" },
      { status: 400 },
    );
  }

  const { data, error } = await getSupabase()
    .from("donations")
    .select("status, mpesa_receipt")
    .eq("checkout_request_id", checkoutRequestId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Donation not found" },
      { status: 404 },
    );
  }

  const d = data as { status: string; mpesa_receipt: string | null };
  return NextResponse.json<DonationPollResponse>({
    status: d.status as DonationPollResponse["status"],
    mpesa_receipt: d.mpesa_receipt || undefined,
  });
}
