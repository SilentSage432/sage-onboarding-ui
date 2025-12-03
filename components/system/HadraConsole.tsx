"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HadraConsole() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener("hadra:toggle", handler);
    return () => window.removeEventListener("hadra:toggle", handler);
  }, []);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 w-[420px] h-[520px] z-[2000]",
        "rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10",
        "shadow-[0_0_80px_rgba(0,0,0,0.7)]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold tracking-wide">
          HADRA-01
        </h2>
        <button onClick={() => setOpen(false)}>
          <X className="w-5 h-5 text-white/60 hover:text-white transition" />
        </button>
      </div>

      {/* Placeholder content */}
      <div className="p-4 text-white/70 text-sm">
        <p className="mb-3">
          Your autonomous support agent is initializing…
        </p>
        <p className="text-xs text-white/40">
          (Full conversational console coming soon)
        </p>
      </div>
    </div>
  );
}


