"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, Users, Banknote, Download, LogOut, BarChart3,
  Gift, Target, Menu, X
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Metrics {
  totalRaised: number;
  totalDonors: number;
  avgGift: number;
  methodSplit: { mpesa: number; bank: number };
  memberHonors: Array<{ id: string; name: string; total: number; count: number }>;
  pledges: { total: number; fulfilled: number; pending: number; fulfillmentRate: number };
  recentActivity: Array<{ amount: number; method: string; created_at: string; honored_member_id: string | null }>;
}

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/pledges", label: "Pledges", icon: Target },
  { href: "/admin/donations", label: "Donations", icon: Gift },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const stored = localStorage.getItem("admin_user");
    if (!token || !stored) {
      router.replace("/admin/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetch("/api/admin/metrics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => {});
  }, [router]);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  }

  // Format as KES shorthand: 1.2M, 500K
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
    return `KES ${n}`;
  };

  if (!user || !metrics) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-cream/10 border-r border-cream/10 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="p-6">
          <Link href="/admin/dashboard" className="font-display text-gold text-lg">AIPCA Admin</Link>
          <p className="text-cream/40 text-[10px] font-mono mt-0.5">{user.email}</p>
        </div>
        <nav className="px-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
            >
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

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-ink/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur-md border-b border-cream/10 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-cream" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <h1 className="font-display text-cream text-lg">Dashboard</h1>
          <div className="flex items-center gap-3">
            <a href="/api/ledger/export" className="flex items-center gap-1.5 text-cream/50 hover:text-gold text-xs transition-colors">
              <Download size={13} /> Export
            </a>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-6xl">
          {/* KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "Total Raised", value: fmt(metrics.totalRaised), sub: `${metrics.totalDonors} donors` },
              { icon: Users, label: "Average Gift", value: fmt(metrics.avgGift) },
              { icon: Banknote, label: "M-Pesa", value: fmt(metrics.methodSplit.mpesa) },
              { icon: Banknote, label: "Bank Transfer", value: fmt(metrics.methodSplit.bank) },
            ].map((stat) => (
              <div key={stat.label} className="bg-cream/10 rounded-2xl p-4 border border-cream/10">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="text-gold" size={16} />
                  <span className="text-cream/50 text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="font-display text-cream text-xl">{stat.value}</p>
                {stat.sub && <p className="text-cream/40 text-xs mt-0.5">{stat.sub}</p>}
              </div>
            ))}
          </div>

          {/* Pledge stats */}
          <div className="bg-cream/10 rounded-2xl p-5 border border-cream/10">
            <h2 className="font-display text-gold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target size={16} /> Pledge Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-cream/50 text-[10px] font-mono">Total Pledged</p>
                <p className="font-display text-cream text-lg">{fmt(metrics.pledges.total)}</p>
              </div>
              <div>
                <p className="text-cream/50 text-[10px] font-mono">Fulfilled</p>
                <p className="font-display text-cream text-lg">{fmt(metrics.pledges.fulfilled)}</p>
              </div>
              <div>
                <p className="text-cream/50 text-[10px] font-mono">Pending</p>
                <p className="font-display text-cream text-lg">{metrics.pledges.pending}</p>
              </div>
              <div>
                <p className="text-cream/50 text-[10px] font-mono">Fulfillment Rate</p>
                <p className="font-display text-gold text-lg">{metrics.pledges.fulfillmentRate}%</p>
              </div>
            </div>
          </div>

          {/* Member honor roll */}
          <div className="bg-cream/10 rounded-2xl p-5 border border-cream/10">
            <h2 className="font-display text-gold text-sm uppercase tracking-wider mb-3">Member Honor Roll</h2>
            <div className="space-y-1">
              {metrics.memberHonors.length === 0 && (
                <p className="text-cream/40 text-sm">No gifts given in honor of members yet.</p>
              )}
              {metrics.memberHonors.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-cream/80">{m.name}</span>
                  <span className="font-mono text-gold text-xs">
                    {fmt(m.total)} ({m.count} gifts)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-cream/10 rounded-2xl p-5 border border-cream/10">
            <h2 className="font-display text-gold text-sm uppercase tracking-wider mb-3">Recent Activity</h2>
            <div className="space-y-1 max-h-60 overflow-y-auto custom-scroll">
              {metrics.recentActivity.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm border-t border-cream/5">
                  <span className="text-cream/50 text-xs font-mono">
                    {new Date(d.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-cream/70">
                    {d.method === "mpesa" ? "M-Pesa" : "Bank"}
                  </span>
                  <span className="font-mono text-gold text-xs">
                    KES {d.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
