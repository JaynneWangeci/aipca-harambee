import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { EquityInitiateRequest, EquityInitiateResponse } from "@/types";

const JENGA_BASE =
  process.env.JENGA_ENV === "production"
    ? "https://api.equitybankgroup.com"
    : "https://api-uat.equitybankgroup.com";

function isJengaConfigured(): boolean {
  return !!(
    process.env.JENGA_MERCHANT_CODE &&
    process.env.JENGA_CONSUMER_SECRET &&
    process.env.JENGA_API_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!isJengaConfigured()) {
      return NextResponse.json<EquityInitiateResponse>(
        { success: false, error: "Bank payments are not configured" },
        { status: 503 },
      );
    }

    const body: EquityInitiateRequest = await request.json();

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json<EquityInitiateResponse>(
        { success: false, error: "Invalid amount" },
        { status: 400 },
      );
    }

    const authRes = await fetch(`${JENGA_BASE}/authentication/api/v3/authenticate/merchant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantCode: process.env.JENGA_MERCHANT_CODE,
        consumerSecret: process.env.JENGA_CONSUMER_SECRET,
      }),
    });

    if (!authRes.ok) {
      throw new Error(`Jenga auth failed: ${authRes.status}`);
    }

    const authData = await authRes.json();
    const accessToken = authData.accessToken;

    const paymentRes = await fetch(
      `${JENGA_BASE}/transaction/api/v3/checkout/mobile/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Api-Key": process.env.JENGA_API_KEY!,
        },
        body: JSON.stringify({
          merchantCode: process.env.JENGA_MERCHANT_CODE,
          currency: "KES",
          amount: Math.round(body.amount),
          description: "AIPCA Harambee Donation",
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/equity/callback`,
          customerName: body.donor_name || "Anonymous",
          customerEmail: body.email || "",
        }),
      },
    );

    if (!paymentRes.ok) {
      const errText = await paymentRes.text();
      throw new Error(`Jenga payment session failed: ${errText}`);
    }

    const paymentData = await paymentRes.json();

    const supabase = getServiceSupabase();
    if (supabase) {
      const campaign = await supabase
        .from("campaigns")
        .select("id")
        .eq("slug", "development-fund")
        .single()
        .then((r) => r.data as { id: string } | null);

      await supabase.from("donations").insert({
        campaign_id: campaign?.id || "00000000-0000-0000-0000-000000000000",
        donor_name: body.donor_name || "Anonymous",
        amount: body.amount,
        method: "bank",
        status: "pending",
        message: body.message || null,
        checkout_request_id: paymentData.sessionId,
        honored_member_id: body.honored_member_id || null,
      } as never);
    }

    return NextResponse.json<EquityInitiateResponse>({
      success: true,
      redirectUrl: paymentData.redirectUrl,
      sessionId: paymentData.sessionId,
    });
  } catch (error) {
    console.error("Equity initiate error:", error);
    return NextResponse.json<EquityInitiateResponse>(
      { success: false, error: "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
