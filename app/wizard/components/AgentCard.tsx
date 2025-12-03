"use client";

import { cn } from "@/lib/utils";

export default function AgentCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all backdrop-blur-md",
        selected
          ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/20"
          : "border-white/10 hover:border-white/30 bg-white/5"
      )}
    >
      <p className="text-white text-sm font-medium">{label}</p>
    </div>
  );
}

