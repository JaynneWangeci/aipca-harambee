import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { EquityCallbackPayload } from "@/types";

const processedCallbacks = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const payload: EquityCallbackPayload = await request.json();

    // Idempotency
    if (processedCallbacks.has(payload.sessionId)) {
      return NextResponse.json({ received: true });
    }
    processedCallbacks.add(payload.sessionId);

    const supabase = getServiceSupabase();
    const isSuccess = payload.status === "SUCCESS";

    const donation = await supabase
      .from("donations")
      .update({
        status: isSuccess ? "completed" : "failed",
        mpesa_receipt: payload.transactionCode || null,
      } as never)
      .eq("checkout_request_id", payload.sessionId)
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
