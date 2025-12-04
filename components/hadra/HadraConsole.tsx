"use client";

import { motion, AnimatePresence } from "framer-motion";
import HadraConsoleFeed from "./HadraConsoleFeed";
import HadraConsoleInput from "./HadraConsoleInput";

/**
 * HadraConsole
 * Master console component for HADRA-01
 * Provides interactive diagnostic interface
 */
export default function HadraConsole({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            fixed bottom-24 right-6
            w-[420px] h-[520px]
            rounded-2xl overflow-hidden
            bg-black/40 backdrop-blur-2xl
            border border-white/10 shadow-xl
            flex flex-col
            z-[var(--z-hadra)]
            max-lg:w-[380px] max-lg:h-[480px]
            max-lg:bottom-20 max-lg:right-4
          "
        >
          {/* Header */}
          <div className="p-3 border-b border-white/10 text-gray-200 font-medium text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            HADRA-01 · Diagnostic Console
          </div>

          {/* Feed */}
          <div className="flex-1 overflow-hidden">
            <HadraConsoleFeed />
          </div>

          {/* Input */}
          <HadraConsoleInput />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

