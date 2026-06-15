"use client";

import { motion } from "framer-motion";
import { Church, Users, Sprout, Wrench } from "lucide-react";

const projects = [
  {
    icon: Church,
    title: "Sanctuary improvements",
    description:
      "Upgrading seating, sound, and finishes in the main worship hall so every service feels as warm as the welcome.",
  },
  {
    icon: Users,
    title: "Fellowship hall",
    description:
      "A dedicated space for weddings, conferences, youth gatherings, and community meals after service.",
  },
  {
    icon: Sprout,
    title: "Ministry growth",
    description:
      "Resourcing Sunday school, youth, and choir programs with materials, instruments, and training.",
  },
  {
    icon: Wrench,
    title: "Grounds & maintenance",
    description:
      "Ongoing upkeep — plumbing, electrical, painting, and the small repairs that keep the cathedral dignified.",
  },
];

export default function ProjectCards() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
      {projects.map((project, i) => {
        const Icon = project.icon;
        return (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl bg-white border border-maroon/10 p-5 sm:p-6"
          >
            <div className="w-10 h-10 rounded-full bg-terracotta-tint flex items-center justify-center mb-4">
              <Icon className="text-maroon" size={18} />
            </div>
            <h3 className="font-display text-lg text-maroon mb-1.5">
              {project.title}
            </h3>
            <p className="text-sm text-ink/60 leading-relaxed">
              {project.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
