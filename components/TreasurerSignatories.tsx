"use client";

import { UserCheck } from "lucide-react";

export default function TreasurerSignatories() {
  return (
    <div className="bg-white rounded-xl border border-maroon/10 p-4 shadow-sm">
      <h3 className="font-semibold text-maroon text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <UserCheck size={13} /> Treasurer Signatories
      </h3>
      <div className="space-y-1 text-maroon/60 text-[12px]">
        <p><span className="font-medium text-maroon">Johnson Kamau</span> — Treasurer</p>
        <p><span className="font-medium text-maroon">George Kibia</span> — Vice Treasurer</p>
        <p><span className="font-medium text-maroon">Maria Goretti Njenga</span> — Development Treasurer</p>
      </div>
    </div>
  );
}
