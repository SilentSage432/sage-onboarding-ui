"use client";

import { cn } from "@/lib/utils";

export default function HadraOrb({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <div
      onClick={() => setOpen(!open)}
      className="fixed bottom-6 right-6 z-50 cursor-pointer select-none"
    >
      <div
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg",
          !open && "animate-[sage-orb-pulse_2.4s_ease-in-out_infinite]",
          open && "animate-[sage-orb-surge_0.45s_ease-out]",
          "hover:scale-105 hover:shadow-xl hover:brightness-110",
          "hover:animate-[sage-orb-tilt_0.6s_ease-in-out]"
        )}
      >
        {/* Core icon */}
        {!open ? (
          <div
            className={cn(
              "w-6 h-6 rounded-full shadow-md",
              "transition-all duration-500",
              "bg-gradient-to-br from-purple-400 to-indigo-600"
            )}
          />
        ) : (
          <div className="text-white text-2xl font-bold">×</div>
        )}
      </div>
    </div>
  );
}

