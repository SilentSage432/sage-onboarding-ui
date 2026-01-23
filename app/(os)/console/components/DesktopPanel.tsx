"use client";

import { motion } from "framer-motion";

export default function DesktopPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex-1 min-w-0 flex flex-col"
    >
      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="p-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

