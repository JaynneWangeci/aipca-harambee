import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: donations, error } = await sb
    .from("donations")
    .select("created_at, donor_name, amount, method, mpesa_receipt, status, receipt_number, completed_at, is_anonymous")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (donations || []) as Array<{
    created_at: string;
    donor_name: string;
    amount: number;
    method: string;
    mpesa_receipt: string | null;
    status: string;
    receipt_number: string | null;
    completed_at: string | null;
    is_anonymous: boolean;
  }>;

  const header = "Date,Donor,Amount,Method,Receipt,Status,Completed At\n";
  const csv = rows
    .map((d) =>
      [
        d.created_at,
        d.is_anonymous ? "Anonymous" : `"${(d.donor_name || "Anonymous").replace(/"/g, '""')}"`,
        d.amount,
        d.method,
        d.mpesa_receipt || d.receipt_number || "",
        d.status,
        d.completed_at || "",
      ].join(","),
    )
    .join("\n");

  return new NextResponse(header + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="harambee-ledger-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
