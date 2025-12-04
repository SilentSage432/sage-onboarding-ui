"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function SystemStatusStrip() {
  const [heartbeat, setHeartbeat] = useState(false);

  // simple heartbeat animation toggle
  useEffect(() => {
    const interval = setInterval(() => setHeartbeat((h) => !h), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2",
        "z-[var(--z-panels)]",
        "px-6 py-2",
        "rounded-full",
        "backdrop-blur-md bg-white/5",
        "border border-white/10",
        "shadow-lg shadow-black/20",
        "flex items-center gap-8",
        "text-[11px] text-gray-300 tracking-wide uppercase",
        "select-none",
        "max-lg:bottom-4 max-lg:scale-90",
        "max-sm:gap-4 max-sm:px-4 max-sm:py-1.5",
        "max-sm:text-[10px]"
      )}
    >
      {/* Mesh Link */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full transition-all ${
            heartbeat ? "bg-green-400" : "bg-green-700"
          }`}
        />
        <span className="max-sm:hidden">Mesh: Stable</span>
        <span className="sm:hidden">Mesh</span>
      </div>

      {/* Rho² Trust */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span className="max-sm:hidden">Rho² Secure</span>
        <span className="sm:hidden">Rho²</span>
      </div>

      {/* Agents */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="max-sm:hidden">Agents: Active</span>
        <span className="sm:hidden">Agents</span>
      </div>

      {/* HADRA Sync */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        <span className="max-sm:hidden">HADRA Sync</span>
        <span className="sm:hidden">HADRA</span>
      </div>

      {/* Workspace Identity */}
      <div className="flex items-center gap-2 opacity-70 max-sm:hidden">
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <span>Workspace • Enterprise</span>
      </div>
    </motion.div>
  );
}

