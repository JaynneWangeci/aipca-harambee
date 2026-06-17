import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { EquityCallbackPayload } from "@/types";

function generateReceiptNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const seq = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `AIPCA-${y}${m}${d}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const payload: EquityCallbackPayload = await request.json();
    const sessionId = payload.sessionId;

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ received: true, error: "Database not configured" }, { status: 200 });
    }

    // DB-level idempotency
    const { data: existing } = await supabase
      .from("donations")
      .select("status")
      .eq("checkout_request_id", sessionId)
      .single();

    const existingDonation = existing as { status: string } | null;
    if (existingDonation && (existingDonation.status === "completed" || existingDonation.status === "failed")) {
      return NextResponse.json({ received: true });
    }

    const isSuccess = payload.status === "SUCCESS";

    const updates: Record<string, unknown> = {
      status: isSuccess ? "completed" : "failed",
    };

    if (isSuccess) {
      updates.receipt_number = generateReceiptNumber();
      updates.completed_at = new Date().toISOString();
      updates.provider_ref = payload.transactionCode || null;
      updates.mpesa_receipt = payload.transactionCode || null;
    }

    const donation = await supabase
      .from("donations")
      .update(updates as never)
      .eq("checkout_request_id", sessionId)
      .select("campaign_id, amount")
      .single()
      .then((r) => r.data as { campaign_id: string; amount: number } | null);

    if (isSuccess && donation) {
      await supabase.rpc("increment_campaign_raised", {
        campaign_id: donation.campaign_id,
        inc_amount: donation.amount,
      } as never);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Equity callback error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
