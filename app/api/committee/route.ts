import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import type { CommitteeMember } from "@/types";

export async function GET() {
  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json<CommitteeMember[]>([]);
  }

  const { data } = await sb
    .from("committee_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return NextResponse.json<CommitteeMember[]>(data || []);
}
