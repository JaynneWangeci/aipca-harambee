"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Church, Users, Sprout, Wrench } from "lucide-react";
import Link from "next/link";
import CathedralBackground from "@/components/CathedralBackground";
import Footer from "@/components/Footer";

const PROJECTS = [
  { icon: Church, title: "Sanctuary improvements", progress: 65, desc: "New sound system, seating, lighting, and finishes" },
  { icon: Users, title: "Fellowship hall", progress: 30, desc: "Multi-purpose space for weddings, conferences, youth" },
  { icon: Sprout, title: "Ministry growth", progress: 45, desc: "Sunday school, youth, choir — materials & training" },
  { icon: Wrench, title: "Grounds & maintenance", progress: 55, desc: "Plumbing, electrical, painting, and ongoing upkeep" },
];

export default function ProjectsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="flex-1 flex items-center">
        <CathedralBackground objectPosition="center 60%" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/80 via-magenta/60 to-ink/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,75,0.15)_0%,_transparent_60%)]" />

        <div className="relative w-full max-w-5xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-xs transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-3xl sm:text-4xl text-cream">
              Our <span className="italic text-gold">Projects</span>
            </h1>
            <p className="text-cream text-sm mt-1">Four parallel tracks. One shared vision.</p>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PROJECTS.map((project, i) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-cream/10 rounded-2xl p-4 sm:p-5 border border-cream/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                      <Icon className="text-gold" size={16} />
                    </div>
                    <h3 className="font-display text-cream text-sm">{project.title}</h3>
                  </div>
                  <p className="text-cream/50 text-xs mb-3">{project.desc}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-cream/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-magenta"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.08 }}
                      />
                    </div>
                    <span className="font-mono text-gold text-xs">{project.progress}%</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <Link
              href="/give"
              className="inline-block px-8 py-3 rounded-full bg-gold text-maroon font-display font-semibold text-sm hover:bg-cream transition-all"
            >
              Support these projects
            </Link>
          </motion.div>
        </div>
      </section>
      <div className="shrink-0 px-6 pb-3">
        <Footer />
      </div>
    </main>
  );
}
