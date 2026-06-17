"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, BarChart3, Target, Gift, LogOut, Loader2 } from "lucide-react";
import { getServiceSupabase } from "@/lib/supabase";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  method: string;
  status: string;
  mpesa_receipt: string | null;
  receipt_number: string | null;
  created_at: string;
  completed_at: string | null;
  is_anonymous: boolean;
}

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/pledges", label: "Pledges", icon: Target },
  { href: "/admin/donations", label: "Donations", icon: Gift },
];

export default function AdminDonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    async function load() {
      const sb = getServiceSupabase();
      if (!sb) return;
      const { data } = await sb
        .from("donations")
        .select("id, donor_name, amount, method, status, mpesa_receipt, receipt_number, created_at, completed_at, is_anonymous")
        .order("created_at", { ascending: false })
        .limit(200);
      setDonations((data || []) as Donation[]);
      setLoading(false);
    }
    load();
  }, [router]);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-cream/10 border-r border-cream/10 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="p-6">
          <Link href="/admin/dashboard" className="font-display text-gold text-lg">AIPCA Admin</Link>
        </div>
        <nav className="px-4 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors">
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button onClick={logout} className="flex items-center gap-2 text-cream/40 hover:text-red-400 text-xs transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-ink/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-cream/10 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-cream" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <h1 className="font-display text-cream text-lg">Donations</h1>
          <a href="/api/ledger/export" className="text-cream/50 hover:text-gold text-xs transition-colors">Export CSV</a>
        </header>
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-gold" size={32} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-cream/50 text-[10px] font-mono uppercase tracking-wider border-b border-cream/10">
                    <th className="text-left py-3 px-2">Donor</th>
                    <th className="text-right py-3 px-2">Amount</th>
                    <th className="text-center py-3 px-2">Method</th>
                    <th className="text-center py-3 px-2">Status</th>
                    <th className="text-center py-3 px-2">Receipt</th>
                    <th className="text-center py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-cream/5 text-cream/80">
                      <td className="py-3 px-2">{d.is_anonymous ? "Anonymous" : d.donor_name}</td>
                      <td className="py-3 px-2 text-right font-mono">KES {d.amount.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center text-xs font-mono uppercase">{d.method}</td>
                      <td className={`py-3 px-2 text-center text-xs font-mono ${d.status === "completed" ? "text-green-400" : d.status === "failed" ? "text-red-400" : "text-yellow-400"}`}>{d.status}</td>
                      <td className="py-3 px-2 text-center text-[10px] font-mono text-cream/40">{d.receipt_number || d.mpesa_receipt || "—"}</td>
                      <td className="py-3 px-2 text-center text-cream/40 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
