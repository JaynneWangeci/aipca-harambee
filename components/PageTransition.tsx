"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -15,
    x: -60,
    scale: 0.97,
    transformPerspective: 1200,
  },
  enter: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    scale: 1,
    transformPerspective: 1200,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 15,
    x: 60,
    scale: 0.97,
    transformPerspective: 1200,
    transition: {
      duration: 0.35,
      ease: [0.55, 0.085, 0.68, 0.53] as const,
    },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
