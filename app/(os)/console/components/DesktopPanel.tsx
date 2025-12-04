"use client";

import { motion } from "framer-motion";

export default function DesktopPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex-1 overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

