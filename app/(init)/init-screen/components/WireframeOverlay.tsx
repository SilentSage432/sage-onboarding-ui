"use client";

import { motion } from "framer-motion";

export default function WireframeOverlay({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.25 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(130,80,255,0.15),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:60px_100%]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_60px]"
      />
    </motion.div>
  );
}

