import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const sb = getServiceSupabase();
    if (!sb) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const { data: raw } = await sb
      .from("admin_users")
      .select("id, email, name, role, password_hash")
      .eq("email", email.toLowerCase().trim())
      .single();

    const user = raw as {
      id: string;
      email: string;
      name: string;
      role: string;
      password_hash: string;
    } | null;

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { verifyPassword } = await import("@/lib/auth");
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update last_login
    await sb.from("admin_users").update({ last_login_at: new Date().toISOString() } as never).eq("id", user.id);

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
