"use client";

import { UserCheck } from "lucide-react";

export default function TreasurerSignatories() {
  return (
    <div className="bg-cream/10 rounded-2xl p-4 border border-cream/10">
      <h3 className="font-display text-gold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <UserCheck size={13} /> Treasurer Signatories
      </h3>
      <div className="space-y-1 text-cream/70 text-[11px]">
        <p><span className="text-cream">Johnson Kamau</span> — Treasurer</p>
        <p><span className="text-cream">George Kibia</span> — Vice Treasurer</p>
        <p><span className="text-cream">Maria Goretti Njenga</span> — Development Treasurer</p>
      </div>
    </div>
  );
}
