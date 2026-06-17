"use client";

import { Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Support AIPCA Bahati Cathedral Development Fund — give here: ${url}`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cream/10 border border-cream/10 text-cream/70 hover:text-cream text-xs transition-colors"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank",
          );
        }}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cream/10 border border-cream/10 text-cream/70 hover:text-cream text-xs transition-colors"
      >
        <Share2 size={13} /> Share
      </button>
    </div>
  );
}
