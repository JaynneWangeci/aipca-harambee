import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    const sb = getServiceSupabase();
    if (!sb) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    // Check if admin exists
    const { data: existing } = await sb
      .from("admin_users")
      .select("id")
      .eq("email", "admin@aipcaharambee.org")
      .single();

    if (existing) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const hash = await hashPassword("admin123");
    const { error } = await sb.from("admin_users").insert({
      email: "admin@aipcaharambee.org",
      password_hash: hash,
      name: "System Admin",
      role: "superadmin",
    } as never);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Admin seeded. Email: admin@aipcaharambee.org, Password: admin123" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
