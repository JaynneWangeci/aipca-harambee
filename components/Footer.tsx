import { PlayCircle, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <div className="flex items-center justify-between gap-4 text-cream/40 text-[10px] font-mono">
      <span>&copy; {new Date().getFullYear()} AIPCA Cathedral Bahati</span>
      <div className="flex items-center gap-3">
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
