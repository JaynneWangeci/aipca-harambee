"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target, CheckCircle, XCircle, Search, ArrowLeft, Loader2,
  Menu, BarChart3, Gift, LogOut
} from "lucide-react";

interface Pledge {
  id: string;
  donor_name: string;
  amount: number;
  fulfilled_amount: number;
  status: string;
  phone_masked: string | null;
  message: string | null;
  notes: string | null;
  created_at: string;
  fulfilled_at: string | null;
}

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/pledges", label: "Pledges", icon: Target },
  { href: "/admin/donations", label: "Donations", icon: Gift },
];

export default function AdminPledgesPage() {
  const router = useRouter();
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadPledges() {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    try {
      const res = await fetch("/api/admin/pledges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPledges(await res.json());
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { loadPledges(); }, [router]);

  async function updatePledge(id: string, status: string) {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setUpdating(id);
    try {
      await fetch("/api/admin/pledges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status, fulfilled_amount: status === "fulfilled" ? 0 : undefined }),
      });
      await loadPledges();
    } finally { setUpdating(null); }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  }

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    partially_fulfilled: "text-blue-400",
    fulfilled: "text-green-400",
    cancelled: "text-red-400",
  };

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
          <h1 className="font-display text-cream text-lg">Pledges</h1>
        </header>
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gold" size={32} />
            </div>
          ) : pledges.length === 0 ? (
            <div className="text-center py-20 text-cream/40">
              <Target size={40} className="mx-auto mb-3 opacity-30" />
              <p>No pledges yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-cream/50 text-[10px] font-mono uppercase tracking-wider border-b border-cream/10">
                    <th className="text-left py-3 px-2">Donor</th>
                    <th className="text-right py-3 px-2">Amount</th>
                    <th className="text-right py-3 px-2">Fulfilled</th>
                    <th className="text-center py-3 px-2">Status</th>
                    <th className="text-center py-3 px-2">Date</th>
                    <th className="text-center py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pledges.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-cream/5 text-cream/80"
                    >
                      <td className="py-3 px-2">{p.donor_name}</td>
                      <td className="py-3 px-2 text-right font-mono">KES {p.amount.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right font-mono">
                        {p.fulfilled_amount > 0 ? `KES ${p.fulfilled_amount.toLocaleString()}` : "—"}
                      </td>
                      <td className={`py-3 px-2 text-center font-mono text-xs ${statusColors[p.status] || ""}`}>
                        {p.status.replace("_", " ")}
                      </td>
                      <td className="py-3 px-2 text-center text-cream/40 text-xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {p.status === "pending" && (
                            <>
                              <button
                                onClick={() => updatePledge(p.id, "fulfilled")}
                                disabled={updating === p.id}
                                className="p-1.5 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                                title="Mark fulfilled"
                              >
                                {updating === p.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                              </button>
                              <button
                                onClick={() => updatePledge(p.id, "cancelled")}
                                disabled={updating === p.id}
                                className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                                title="Cancel"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {p.status === "fulfilled" && (
                            <span className="text-green-400 text-xs">Done</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
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
