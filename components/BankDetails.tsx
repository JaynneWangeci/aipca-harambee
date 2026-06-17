"use client";

import { Banknote, Copy, Check } from "lucide-react";
import { useState } from "react";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1 text-maroon/40 hover:text-maroon transition-colors text-[10px] font-medium"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function BankDetails() {
  return (
    <div className="bg-white rounded-xl border border-maroon/10 p-4 shadow-sm space-y-2">
      <h3 className="font-semibold text-maroon text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Banknote size={13} /> Bank Transfer
      </h3>
      <div className="space-y-1 text-maroon/60 text-[12px]">
        <p><span className="text-maroon/50">Bank:</span> Equity Bank</p>
        <p className="flex items-center gap-2">
          <span className="text-maroon/50">Account:</span>
          <span className="font-mono font-medium text-maroon">1840291670724</span>
          <CopyBtn text="1840291670724" />
        </p>
        <p><span className="text-maroon/50">Name:</span> AIPCA Bahati Cathedral Development Fund</p>
      </div>
      <div className="pt-2 border-t border-maroon/5 space-y-1 text-maroon/60 text-[12px]">
        <p className="flex items-center gap-2">
          <span className="text-maroon/50">M-Pesa Paybill:</span>
          <span className="font-mono font-medium text-maroon">247247</span>
          <CopyBtn text="247247" />
        </p>
        <p className="flex items-center gap-2">
          <span className="text-maroon/50">Account:</span>
          <span className="font-mono font-medium text-maroon">BAHATI</span>
          <CopyBtn text="BAHATI" />
        </p>
      </div>
    </div>
  );
}
