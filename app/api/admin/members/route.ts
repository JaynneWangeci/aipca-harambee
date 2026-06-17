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
    .from("committee_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return NextResponse.json(raw || []);
}
