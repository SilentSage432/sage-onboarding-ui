"use client";

import { motion } from "framer-motion";

export default function HADRAIntro() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="text-4xl font-light tracking-wide text-white/90"
      >
        <span className="text-indigo-300">HADRA-01</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-lg text-white/60 max-w-xl"
      >
        Heuristic Autonomous Diagnostic &amp; Response Agent
        <br />Initializing neural substrate…
      </motion.div>

      <motion.div
        className="w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}
