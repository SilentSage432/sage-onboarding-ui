"use client";

import { motion } from "framer-motion";

export default function Rho2Pulse({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.18 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0.1 }}
        animate={{ scale: 1.35, opacity: 0 }}
        transition={{
          repeat: Infinity,
          duration: 2.4,
          ease: "easeOut",
        }}
        className="absolute inset-0 rounded-2xl bg-purple-500/40 blur-3xl"
      />
    </motion.div>
  );
}

