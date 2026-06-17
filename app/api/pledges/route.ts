import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const sb = getServiceSupabase();
    if (!sb) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { amount, donor_name, phone, email, message, honored_member_id } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const campaign = await sb
      .from("campaigns")
      .select("id")
      .eq("slug", "development-fund")
      .single()
      .then((r) => r.data as { id: string } | null);

    const maskedPhone = phone
      ? phone.replace(/^0+/, "254").replace(/^\+/, "").replace(/(\d{4})\d+(\d{3})/, "$1***$2")
      : null;

    const { error: insertError } = await sb.from("pledges").insert({
      campaign_id: campaign?.id || "00000000-0000-0000-0000-000000000000",
      donor_name: donor_name || "Anonymous",
      amount,
      phone_masked: maskedPhone,
      email: email || null,
      message: message || null,
      honored_member_id: honored_member_id || null,
      status: "pending",
    } as never);

    if (insertError) {
      console.error("Pledge insert error:", insertError);
      return NextResponse.json({ error: "Failed to record pledge" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pledge error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
