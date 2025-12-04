"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * ConsoleAtmosphere
 * Subtle atmospheric overlay layer (non-rotating, minimal)
 * 
 * Removed rotating elements per UX-C64C - now only provides
 * subtle pulse effects that don't distract from the Sovereign background
 */
export default function ConsoleAtmosphere() {
  return (
    <AnimatePresence>
      {/* HADRA ambient pulse sync - subtle, non-rotating */}
      <motion.div
        key="hadra-pulse"
        className="fixed inset-0 pointer-events-none z-[var(--z-bg)]"
        animate={{
          opacity: [0.02, 0.06, 0.02],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at 70% 80%, rgba(190,150,255,0.15), transparent 70%)",
        }}
      />
    </AnimatePresence>
  );
}

