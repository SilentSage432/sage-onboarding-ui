"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ReviewRibbonProps {
  count: number;
  onClick: () => void;
}

export default function ReviewRibbon({ count, onClick }: ReviewRibbonProps) {
  if (count < 2) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={onClick}
        className="fixed bottom-8 right-8 z-40 px-5 py-3 rounded-full text-sm font-medium bg-purple-700 hover:bg-purple-600 text-white shadow-[0_0_18px_rgba(170,120,255,0.45)] backdrop-blur-md transition-all active:scale-95"
      >
        Review {count} Selected Agent{count !== 1 ? "s" : ""} →
      </motion.button>
    </AnimatePresence>
  );
}


