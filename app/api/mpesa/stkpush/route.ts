import { NextRequest, NextResponse } from "next/server";
import { stkPush, isDarajaConfigured } from "@/lib/daraja";
import { getServiceSupabase } from "@/lib/supabase";
import type { MpesaStkPushRequest, MpesaStkPushResponse } from "@/types";

const RATE_LIMIT_WINDOW = 60_000;

function maskPhone(phone: string): string {
  const cleaned = phone.replace(/^0+/, "254").replace(/^\+/, "");
  if (cleaned.length < 8) return "07XX***XXX";
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-3)}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!isDarajaConfigured()) {
      return NextResponse.json<MpesaStkPushResponse>(
        { success: false, error: "M-Pesa payments are not configured" },
        { status: 503 },
      );
    }

    const body: MpesaStkPushRequest = await request.json();

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json<MpesaStkPushResponse>(
        { success: false, error: "Invalid amount" },
        { status: 400 },
      );
    }

    if (!body.phone || body.phone.length < 10) {
      return NextResponse.json<MpesaStkPushResponse>(
        { success: false, error: "Invalid phone number" },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json<MpesaStkPushResponse>(
        { success: false, error: "Database not configured" },
        { status: 500 },
      );
    }

    const normalizedPhone = body.phone.replace(/^0+/, "254").replace(/^\+/, "");

    // DB-level rate limit: check for pending donations from same phone within window
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString();
    const { count: recentCount } = await supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .eq("phone_masked", maskPhone(body.phone))
      .eq("status", "pending")
      .gte("created_at", windowStart);

    if (recentCount && recentCount > 0) {
      return NextResponse.json<MpesaStkPushResponse>(
        { success: false, error: "Please wait before requesting another prompt" },
        { status: 429 },
      );
    }

    const campaign = await supabase
      .from("campaigns")
      .select("id")
      .eq("slug", "development-fund")
      .single()
      .then((r) => r.data as { id: string } | null);

    const checkoutRequestId = `CHK${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    const { error: insertError } = await supabase.from("donations").insert({
      campaign_id: campaign?.id || "00000000-0000-0000-0000-000000000000",
      donor_name: body.donor_name || "Anonymous",
      amount: body.amount,
      method: "mpesa",
      phone_masked: maskPhone(body.phone),
      status: "pending",
      message: body.message || null,
      checkout_request_id: checkoutRequestId,
      honored_member_id: body.honored_member_id || null,
    } as never);

    if (insertError) {
      console.error("Failed to insert pending donation:", insertError);
    }

    const result = await stkPush(body.amount, body.phone, checkoutRequestId);

    if (!result) {
      return NextResponse.json<MpesaStkPushResponse>(
        { success: false, error: "Payment service unavailable" },
        { status: 502 },
      );
    }

    if (result.ResponseCode === "0") {
      return NextResponse.json<MpesaStkPushResponse>({
        success: true,
        checkoutRequestId: result.CheckoutRequestID,
      });
    }

    return NextResponse.json<MpesaStkPushResponse>(
      { success: false, error: result.ResponseDescription },
      { status: 502 },
    );
  } catch (error) {
    console.error("STK Push error:", error);
    return NextResponse.json<MpesaStkPushResponse>(
      { success: false, error: "Payment request failed" },
      { status: 500 },
    );
  }
}
