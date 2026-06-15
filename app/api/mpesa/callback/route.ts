import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { MpesaCallbackPayload } from "@/types";

const processedCallbacks = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const payload: MpesaCallbackPayload = await request.json();
    const { stkCallback } = payload.Body;

    // Idempotency: skip if we've already processed this CheckoutRequestID
    if (processedCallbacks.has(stkCallback.CheckoutRequestID)) {
      return NextResponse.json({ received: true });
    }
    processedCallbacks.add(stkCallback.CheckoutRequestID);

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ received: true, error: "Database not configured" }, { status: 200 });
    }

    // Extract metadata
    const meta = stkCallback.CallbackMetadata?.Item || [];
    const getMeta = (name: string) =>
      meta.find((item) => item.Name === name)?.Value;

    const mpesaReceipt = getMeta("MpesaReceipt") as string | undefined;
    const amount = getMeta("Amount") as number | undefined;
    const phone = getMeta("PhoneNumber") as string | undefined;

    const isSuccess = stkCallback.ResultCode === 0;

    // Update donation record
    const donation = await supabase
      .from("donations")
      .update({
        status: isSuccess ? "completed" : "failed",
        mpesa_receipt: mpesaReceipt || null,
        result_desc: stkCallback.ResultDesc,
      } as never)
      .eq("checkout_request_id", stkCallback.CheckoutRequestID)
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
    console.error("M-Pesa callback error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
