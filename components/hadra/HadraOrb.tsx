"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { resolveOrbClasses } from "@/lib/hadra/orbStateMap";
import { useHadraAudio } from "@/lib/hadra/useHadraAudio";
import { OrbStatus } from "@/lib/hadra/orbPulse";
import { hadraBus } from "@/lib/hadra/hadraEventBus";

export default function HadraOrb({ 
  open, 
  setOpen,
  status = "idle",
  setStatus
}: { 
  open: boolean; 
  setOpen: (v: boolean) => void;
  status?: OrbStatus;
  setStatus?: (status: OrbStatus) => void;
}) {
  const [previousStatus, setPreviousStatus] = useState<OrbStatus>(status);
  const [isHovered, setIsHovered] = useState(false);
  const audio = useHadraAudio();

  // Use multimodal state stack (pulse + gesture)
  const effectiveStatus = isHovered ? "operator-focus" : status;
  const orbClasses = resolveOrbClasses(effectiveStatus);

  // Audio cues based on status changes (only trigger on severity changes)
  const prevStatusRef = useRef<OrbStatus>(status);
  useEffect(() => {
    if (status !== prevStatusRef.current) {
      if (status === "insight") audio.insight();
      if (status === "warning") audio.warning();
      if (status === "critical") audio.critical();
      prevStatusRef.current = status;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // audio is memoized and stable, no need to include in deps

  const handleMouseEnter = () => {
    if (!open) {
      setPreviousStatus(status);
      setIsHovered(true);
      audio.hover();
      if (setStatus) {
        setStatus("operator-focus");
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (setStatus && !open) {
      setStatus(previousStatus);
    }
  };

  const handleClick = () => {
    if (open) {
      audio.close();
    } else {
      audio.open();
    }
    setOpen(!open);
    
    // Emit status event to event bus
    hadraBus.emit("status", { type: open ? "closed" : "opened" });
  };

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
              className="
                fixed
                bottom-8 right-8
                z-[var(--z-hadra)]
                pointer-events-auto
                cursor-pointer select-none
                max-lg:bottom-6 max-lg:right-6
              "
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg",
          !open && orbClasses,
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
    </motion.div>
  );
}

