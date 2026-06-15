"use client";

import { motion } from "framer-motion";

interface YouTubeVideo {
  id: string;
  title: string;
  date: string;
}

interface YouTubeGalleryProps {
  videos?: YouTubeVideo[];
}

const RECENT_VIDEOS: YouTubeVideo[] = [
  { id: "N0lB_gzRPBU", title: "Youth Sunday Service", date: "Sept 2025" },
  { id: "ea7BK7ZH2dY", title: "Mother Council Wednesday Mass", date: "July 2025" },
  { id: "tYQXBU8Ldh4", title: "Sunday Service", date: "Mar 2024" },
  { id: "PV5adHQovHw", title: "Academy Wednesday Mass", date: "Jan 2025" },
  { id: "lyv9wAuOwSo", title: "Church Service", date: "2024" },
  { id: "bUvIGigwMcA", title: "Live Stream", date: "Recent" },
];

export default function YouTubeGallery({ videos = RECENT_VIDEOS }: YouTubeGalleryProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {videos.map((video, i) => (
        <motion.a
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="group rounded-2xl overflow-hidden bg-white border border-maroon/10 shadow-sm hover:shadow-lg transition-all"
        >
          <div className="relative aspect-video bg-maroon/10">
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-maroon ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-display text-sm text-maroon group-hover:text-magenta transition-colors line-clamp-2">
              {video.title}
            </h3>
            <p className="text-xs text-ink/40 mt-1">{video.date}</p>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
