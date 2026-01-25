"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { resolveOrbClasses } from "@/lib/hadra/orbStateMap";
import { useHadraAudio } from "@/lib/hadra/useHadraAudio";
import { OrbStatus } from "@/lib/hadra/orbPulse";
import { hadraBus } from "@/lib/hadra/hadraEventBus";
import { useSignalAggregation } from "@/lib/signals/useSignalAggregation";
import { getOrbVisualsFromSeverity, getSourceColorMapping } from "@/lib/signals/orbVisuals";
import { useSageSignal } from "@/lib/signals/useSageSignal";
import type { SignalEmitter } from "@/lib/signals/types";

/**
 * HADRA-01 Orb. Observer-only of aggregated signals.
 * Visual interpretation only. Never executes, stores, or escalates.
 */

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

  // Collect signals from all sources (SAGE-driven only)
  const sageSignals = useSageSignal();
  const signals = useMemo((): SignalEmitter[] => {
    return sageSignals;
  }, [sageSignals]);

  // Aggregate signals to determine effective HADRA state
  const aggregatedState = useSignalAggregation(signals);

  // HADRA-01 observer-only: effective status from aggregated signals only.
  // No signals → idle. Prop status unused for orb display (UI coordination only).
  const effectiveOrbStatus = useMemo(() => {
    if (aggregatedState.hasSignals) return aggregatedState.orbStatus;
    return "idle";
  }, [aggregatedState.hasSignals, aggregatedState.orbStatus]);

  // Use multimodal state stack (pulse + gesture)
  const effectiveStatus = isHovered ? "operator-focus" : effectiveOrbStatus;
  const orbClasses = resolveOrbClasses(effectiveStatus);

  // Compute visual properties from signal severity
  const visualProperties = useMemo(() => {
    if (aggregatedState.hasSignals) {
      const baseVisuals = getOrbVisualsFromSeverity(aggregatedState.maxSeverity);
      
      // Check for source-specific color overrides
      const primarySignal = aggregatedState.activeSignals[0];
      if (primarySignal) {
        const sourceMapping = getSourceColorMapping(
          primarySignal.source,
          primarySignal.state
        );
        if (sourceMapping) {
          if (sourceMapping.gradient) {
            baseVisuals.gradient = sourceMapping.gradient;
          }
          if (sourceMapping.glowColor) {
            baseVisuals.glowColor = sourceMapping.glowColor;
          }
        }
      }

      return baseVisuals;
    }
    return { glowIntensity: 1.0 };
  }, [aggregatedState]);

  // Audio cues based on status changes (only trigger on severity changes)
  const prevStatusRef = useRef<OrbStatus>(effectiveOrbStatus);
  useEffect(() => {
    if (effectiveOrbStatus !== prevStatusRef.current) {
      if (effectiveOrbStatus === "insight") audio.insight();
      if (effectiveOrbStatus === "warning") audio.warning();
      if (effectiveOrbStatus === "critical") audio.critical();
      prevStatusRef.current = effectiveOrbStatus;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveOrbStatus]); // audio is memoized and stable, no need to include in deps

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
              visualProperties.gradient || "bg-gradient-to-br from-purple-400 to-indigo-600"
            )}
            style={
              visualProperties.glowColor
                ? {
                    boxShadow: `0 0 ${8 * visualProperties.glowIntensity}px ${visualProperties.glowColor}`,
                  }
                : visualProperties.glowIntensity !== 1.0
                ? {
                    filter: `brightness(${visualProperties.glowIntensity})`,
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

