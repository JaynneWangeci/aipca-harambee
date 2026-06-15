"use client";

import { motion } from "framer-motion";
import { PlayCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CathedralBackground from "@/components/CathedralBackground";
import Footer from "@/components/Footer";

const VIDEOS = [
  { id: "N0lB_gzRPBU", title: "Youth Sunday Service", date: "Sept 2025" },
  { id: "ea7BK7ZH2dY", title: "Mother Council Mass", date: "July 2025" },
  { id: "tYQXBU8Ldh4", title: "Sunday Service", date: "Mar 2024" },
];

export default function WatchPage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 40%" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

        <div className="relative w-full max-w-5xl mx-auto px-6 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-xs transition-colors mb-3">
            <ArrowLeft size={14} /> Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h1 className="font-display text-3xl sm:text-4xl text-cream">
              Watch Our <span className="italic text-gold">Services</span>
            </h1>
            <p className="text-cream text-sm">Catch up on recent sermons and events.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-cream/10"
            >
              <iframe
                src="https://www.youtube.com/embed/N0lB_gzRPBU?rel=0"
                title="Featured Service"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VIDEOS.map((video, i) => (
                <motion.a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="group rounded-xl overflow-hidden bg-cream/10 border border-cream/10 hover:border-gold/30 transition-all"
                >
                  <div className="aspect-video relative">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-maroon ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-cream text-xs group-hover:text-gold transition-colors truncate">{video.title}</h3>
                    <p className="text-cream/40 text-[10px] mt-0.5">{video.date}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <a
              href="https://www.youtube.com/channel/UC2ns-v_SOBxF7CH6Bz4v52w"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream/10 border border-cream/20 text-cream font-display text-xs hover:bg-cream/20 transition-all"
            >
              <PlayCircle size={16} />
              Visit YouTube Channel
            </a>
          </motion.div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
