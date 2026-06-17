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
      className="inline-flex items-center gap-1 text-gold hover:text-cream transition-colors text-[10px] font-mono"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function BankDetails() {
  return (
    <div className="bg-cream/10 rounded-2xl p-4 border border-cream/10 space-y-2">
      <h3 className="font-display text-gold text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Banknote size={13} /> Direct Bank Transfer
      </h3>
      <div className="space-y-1 text-cream/60 text-[11px]">
        <p><span className="text-cream/80">Bank:</span> Equity Bank</p>
        <p className="flex items-center gap-2">
          <span className="text-cream/80">Account:</span>
          <span className="font-mono text-cream">1840291670724</span>
          <CopyBtn text="1840291670724" />
        </p>
        <p><span className="text-cream/80">Name:</span> AIPCA Bahati Cathedral Development Fund</p>
        <p className="mt-2 flex items-center gap-2 text-cream/40 italic">
          <span>M-Pesa Paybill:</span>
          <span className="font-mono not-italic text-cream/70">247247</span>
          <CopyBtn text="247247" />
        </p>
        <p className="text-cream/40 italic">
          Account: <span className="font-mono not-italic text-cream/70">BAHATI</span>
          <CopyBtn text="BAHATI" />
        </p>
      </div>
    </div>
  );
}
