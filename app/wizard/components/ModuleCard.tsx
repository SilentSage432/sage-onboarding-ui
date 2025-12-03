"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ModuleCard({
  module,
  selected,
  onToggle,
}: {
  module: {
    id: string;
    name: string;
    icon?: string;
    description?: string;
  };
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative cursor-pointer rounded-2xl p-5 border backdrop-blur-md transition-all",
        "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(120,70,255,0.15)]",
        selected &&
          "border-purple-400/40 shadow-[0_0_30px_rgba(170,120,255,0.45)] bg-purple-500/10"
      )}
      onClick={onToggle}
    >
      {/* Top-right toggle badge */}
      <div
        className={cn(
          "absolute top-4 right-4 px-3 py-1 text-xs rounded-full border",
          selected
            ? "bg-purple-600/70 border-purple-400 text-white"
            : "bg-white/10 border-white/20 text-white/60"
        )}
      >
        {selected ? "Enabled" : "Disabled"}
      </div>

      {/* Icon */}
      <div className="text-2xl mb-3">{module.icon}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-1">{module.name}</h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed">
        {module.description}
      </p>
    </motion.div>
  );
}

