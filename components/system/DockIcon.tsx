"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DockIcon() {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={() =>
        window.dispatchEvent(new CustomEvent("hadra:toggle"))
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "fixed bottom-6 right-6 z-[1000] rounded-full p-3 transition-all duration-300",
        "bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]",
        hover && "scale-110 shadow-[0_0_60px_rgba(80,80,255,0.6)]",
      )}
    >
      <Sparkles className="w-7 h-7 text-blue-300" />
    </button>
  );
}


