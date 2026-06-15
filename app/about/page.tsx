"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Church } from "lucide-react";
import Link from "next/link";
import CathedralBackground from "@/components/CathedralBackground";
import Footer from "@/components/Footer";

const MINISTERS = [
  { name: "Bishop Muita Njomo", role: "Diocese Bishop" },
  { name: "Pst. David Kimani", role: "Senior Pastor" },
  { name: "Deacon Isaac Muiruri I", role: "Academy & Wednesday Mass" },
  { name: "Deacon Macharia Mutuota", role: "Morning Service Minister" },
];

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 20%" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

        <div className="relative w-full max-w-5xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-cream font-bold leading-tight">
              About <span className="italic text-gold">AIPCA Cathedral</span>
            </h1>
            <p className="mt-3 text-cream/70 text-sm sm:text-base leading-relaxed">
              A house of God built by faith, serving the Bahati community and beyond since 2006.
              Located at Jogoo Road, off Heshima Road, Bahati Towers (Kwa Chief), Eastlands, Nairobi.
            </p>
            <p className="mt-3 text-cream/50 text-sm">
              Service times: First Service 7:30–9:30 AM &middot; Main Service 9:45 AM–1:00 PM
            </p>

            <div className="mt-6 space-y-3">
              <h3 className="font-display text-gold text-sm uppercase tracking-wider">Our Ministers</h3>
              <div className="grid grid-cols-2 gap-2">
                {MINISTERS.map((m) => (
                  <div key={m.name} className="bg-cream/10 rounded-xl px-4 py-3 border border-cream/10">
                    <p className="font-display text-cream text-sm">{m.name}</p>
                    <p className="text-cream/50 text-[10px] font-mono uppercase tracking-wider mt-0.5">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/give"
                className="px-6 py-3 rounded-full bg-gold text-maroon font-display font-semibold text-sm hover:bg-cream transition-all"
              >
                Give now
              </Link>
              <Link
                href="/watch"
                className="px-6 py-3 rounded-full border border-cream/30 text-cream font-display text-sm hover:bg-cream/10 transition-all"
              >
                Watch services
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            {[
              { icon: MapPin, label: "Location", text: "Jogoo Road, off Heshima Road\nBahati Towers (Kwa Chief)\nEastlands, Nairobi" },
              { icon: Clock, label: "Service Times", text: "Sun: 7:30–9:30 AM & 9:45 AM–1 PM\nWednesday Mass: Check schedule" },
              { icon: Church, label: "YouTube", text: "@aipcabahatilive4844\nLive services every Sunday" },
            ].map((item) => (
              <div key={item.label} className="bg-cream/10 rounded-2xl p-4 border border-cream/10 flex items-start gap-3">
                <item.icon className="text-gold shrink-0 mt-0.5" size={18} />
                <div>
                  <h3 className="font-display text-cream text-xs uppercase tracking-wider">{item.label}</h3>
                  <p className="text-cream/60 text-xs mt-0.5 whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
