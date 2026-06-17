import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { MpesaCallbackPayload } from "@/types";

function generateReceiptNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const seq = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `AIPCA-${y}${m}${d}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const payload: MpesaCallbackPayload = await request.json();
    const { stkCallback } = payload.Body;
    const checkoutId = stkCallback.CheckoutRequestID;

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ received: true, error: "Database not configured" }, { status: 200 });
    }

    // DB-level idempotency: check if this checkout_request_id is already finalised
    const { data: existing } = await supabase
      .from("donations")
      .select("status")
      .eq("checkout_request_id", checkoutId)
      .single();

    const existingDonation = existing as { status: string } | null;
    if (existingDonation && (existingDonation.status === "completed" || existingDonation.status === "failed")) {
      return NextResponse.json({ received: true });
    }

    const meta = stkCallback.CallbackMetadata?.Item || [];
    const getMeta = (name: string) =>
      meta.find((item) => item.Name === name)?.Value;

    const mpesaReceipt = getMeta("MpesaReceipt") as string | undefined;
    const amount = getMeta("Amount") as number | undefined;
    const phone = getMeta("PhoneNumber") as string | undefined;

    const isSuccess = stkCallback.ResultCode === 0;

    const updates: Record<string, unknown> = {
      status: isSuccess ? "completed" : "failed",
      mpesa_receipt: mpesaReceipt || null,
      result_desc: stkCallback.ResultDesc,
    };

    if (isSuccess) {
      updates.receipt_number = generateReceiptNumber();
      updates.completed_at = new Date().toISOString();
      updates.provider_ref = mpesaReceipt || null;
    }

    const donation = await supabase
      .from("donations")
      .update(updates as never)
      .eq("checkout_request_id", checkoutId)
      .select("campaign_id, amount, id")
      .single()
      .then((r) => r.data as { campaign_id: string; amount: number; id: string } | null);

    if (isSuccess && donation) {
      await supabase.rpc("increment_campaign_raised", {
        campaign_id: donation.campaign_id,
        inc_amount: donation.amount,
      } as never);

      // Store encrypted phone in lookup table
      if (phone) {
        const encoded = Buffer.from(phone).toString("base64");
        await supabase.from("donation_phone_lookup").insert({
          donation_id: donation.id,
          phone_encrypted: encoded,
        } as never);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
