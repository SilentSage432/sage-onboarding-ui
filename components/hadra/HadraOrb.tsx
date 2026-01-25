"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { resolveOrbClasses } from "@/lib/hadra/orbStateMap";
import { useHadraAudio } from "@/lib/hadra/useHadraAudio";
import { OrbStatus } from "@/lib/hadra/orbPulse";
import { hadraBus } from "@/lib/hadra/hadraEventBus";
import { useAdraeRhythm } from "@/lib/adrae/useAdraeRhythm";
import { mapAdraeStateToOrbStatus, mapAdraeStateToOrbColor, getAdraeGlowIntensity } from "@/lib/adrae/orbMapping";

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

  // ADRAE rhythm observation (passive, polls every 30s)
  const adraeState = useAdraeRhythm();

  // Compute effective status: ADRAE override if available, otherwise use prop status
  const adraeOrbStatus = useMemo(() => {
    if (adraeState.available && adraeState.state !== "unavailable") {
      const mapped = mapAdraeStateToOrbStatus(adraeState.state);
      return mapped || status;
    }
    return status;
  }, [adraeState.available, adraeState.state, status]);

  // Use multimodal state stack (pulse + gesture)
  const effectiveStatus = isHovered ? "operator-focus" : adraeOrbStatus;
  const orbClasses = resolveOrbClasses(effectiveStatus);

  // ADRAE color mapping (only applies when ADRAE is available)
  const adraeColorMapping = useMemo(() => {
    if (adraeState.available && adraeState.state !== "unavailable") {
      return mapAdraeStateToOrbColor(adraeState.state);
    }
    return null;
  }, [adraeState.available, adraeState.state]);

  // Audio cues based on status changes (only trigger on severity changes)
  const prevStatusRef = useRef<OrbStatus>(adraeOrbStatus);
  useEffect(() => {
    if (adraeOrbStatus !== prevStatusRef.current) {
      if (adraeOrbStatus === "insight") audio.insight();
      if (adraeOrbStatus === "warning") audio.warning();
      if (adraeOrbStatus === "critical") audio.critical();
      prevStatusRef.current = adraeOrbStatus;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adraeOrbStatus]); // audio is memoized and stable, no need to include in deps

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
                max-md:bottom-20 max-md:right-4
                max-sm:bottom-16 max-sm:right-2
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
          "hover:animate-[sage-orb-tilt_0.6s_ease-in-out]",
          "max-sm:w-16 max-sm:h-16",
          "touch-manipulation"
        )}
      >
        {/* Core icon */}
        {!open ? (
          <div
            className={cn(
              "w-6 h-6 rounded-full shadow-md",
              "transition-all duration-500",
              adraeColorMapping?.gradient || "bg-gradient-to-br from-purple-400 to-indigo-600"
            )}
            style={
              adraeColorMapping?.glowColor && adraeState.state !== "unavailable"
                ? {
                    boxShadow: `0 0 ${8 * getAdraeGlowIntensity(adraeState.state)}px ${adraeColorMapping.glowColor}`,
                  }
                : undefined
            }
          />
        ) : (
          <div className="text-white text-2xl font-bold">×</div>
        )}
      </div>
    </motion.div>
  );
}

