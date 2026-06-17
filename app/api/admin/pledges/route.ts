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
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: raw } = await sb
    .from("pledges")
    .select("*, campaign:campaigns(title, slug)")
    .order("created_at", { ascending: false });

  return NextResponse.json(raw || []);
}

export async function PATCH(request: NextRequest) {
  const token = getTokenFromHeader(request);
  if (!token || !verifyToken(token)) return unauthorized();

  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await request.json();
  const { id, status, fulfilled_amount, notes } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing pledge id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (fulfilled_amount !== undefined) updates.fulfilled_amount = fulfilled_amount;
  if (notes !== undefined) updates.notes = notes;
  if (status === "fulfilled") updates.fulfilled_at = new Date().toISOString();

  const { error } = await sb.from("pledges").update(updates as never).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
