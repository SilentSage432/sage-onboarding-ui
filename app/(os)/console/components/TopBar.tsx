"use client";

import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="
        fixed top-0 left-0 right-0
        h-12
        flex justify-between items-center
        px-6
        border-b border-white/5
        bg-[#080b11]/80 backdrop-blur-xl
        select-none
        z-[var(--z-topbar)]
      "
    >
      <div className="flex items-center gap-2 text-slate-300">
        <div className="flex items-center gap-1">
          <span className="text-[10px] tracking-wider uppercase text-slate-500">Rho² Secure Channel</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <span className="text-xs text-green-400/90 font-medium">Active</span>
        <div className="text-xs text-gray-400 ml-4 tracking-wide">
          OPERATOR • ACTIVE
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Federation Verified</span>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(80,130,255,0.6)] animate-[sage-verified-pulse_2.5s_ease-in-out_infinite]" />
      </div>
    </motion.div>
  );
}


