import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { DonationPollResponse } from "@/types";

export async function GET(request: NextRequest) {
  const checkoutRequestId = request.nextUrl.searchParams.get("checkoutRequestId");

  if (!checkoutRequestId) {
    return NextResponse.json(
      { error: "Missing checkoutRequestId" },
      { status: 400 },
    );
  }

  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const { data: raw } = await sb
    .from("donations")
    .select("status, mpesa_receipt, receipt_number")
    .eq("checkout_request_id", checkoutRequestId)
    .single();

  const d = raw as { status: string; mpesa_receipt: string | null; receipt_number: string | null } | null;

  if (!d) {
    return NextResponse.json(
      { error: "Donation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json<DonationPollResponse>({
    status: d.status as DonationPollResponse["status"],
    mpesa_receipt: d.mpesa_receipt || undefined,
    receipt_number: d.receipt_number || undefined,
  });
}
