"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function TransitionOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="transition-overlay"
          className="fixed inset-0 z-[9999] pointer-events-none bg-gradient-to-b from-black via-[#0a0f16] to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* subtle pulse */}
          <motion.div
            key="transition-pulse"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,70,255,0.15),transparent)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

