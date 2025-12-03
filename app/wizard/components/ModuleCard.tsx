"use client";

import { cn } from "@/lib/utils";

export default function ModuleCard({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all backdrop-blur-md",
        selected
          ? "border-blue-400 bg-blue-400/20 shadow-lg shadow-blue-500/20"
          : "border-white/10 hover:border-white/30 bg-white/5"
      )}
    >
      <p className="text-white font-medium">{label}</p>
    </div>
  );
}

