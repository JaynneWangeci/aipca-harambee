import { PlayCircle, ExternalLink, Download, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex items-center justify-between gap-4 text-cream/40 text-[10px] font-mono flex-wrap">
      <span>&copy; {new Date().getFullYear()} AIPCA Cathedral Bahati</span>
      <div className="flex items-center gap-3">
        <Link
          href="/transparency"
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          <BarChart3 size={12} />
          Transparency
        </Link>
        <a
          href="/api/ledger/export"
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          <Download size={12} />
          Ledger
        </a>
        <a
          href="https://www.youtube.com/channel/UC2ns-v_SOBxF7CH6Bz4v52w"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          <PlayCircle size={12} />
          YouTube
        </a>
        <a
          href="https://facebook.com/aipcacathedral"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          <ExternalLink size={12} />
          Facebook
        </a>
      </div>
    </div>
  );
}
