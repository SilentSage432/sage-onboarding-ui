"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function HadraPulse({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="hadra-pulse"
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            key="hadra-pulse-glow"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,120,255,0.25),transparent_70%)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

