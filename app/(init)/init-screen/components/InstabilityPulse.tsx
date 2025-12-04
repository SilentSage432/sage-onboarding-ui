"use client";

import { motion } from "framer-motion";

export default function InstabilityPulse({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 bg-red-500/5 pointer-events-none rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  );
}

