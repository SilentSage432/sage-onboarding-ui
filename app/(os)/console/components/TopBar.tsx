"use client";

import { motion } from "framer-motion";
import OrientationBar from "@/components/console/OrientationBar";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";

export default function TopBar() {
  const { systemPerspective } = useReadinessStore();
  
  // Only show security/attestation indicators when in architect perspective
  // And label them accurately as development/simulated
  const showAttestationIndicators = systemPerspective === 'architect';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="
        fixed top-0 left-0 right-0
        h-12
        flex justify-between items-center
        px-6
        border-b border-white/5
        bg-[#080b11]/80 backdrop-blur-xl
        select-none
        z-[var(--z-topbar)]
      "
    >
      <div className="flex items-center gap-4 text-slate-300">
        <div className="flex items-center gap-2">
          {showAttestationIndicators ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] tracking-wider uppercase text-slate-500">
                Architect Perspective
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            </div>
          ) : null}
          <div className="text-xs text-gray-400 tracking-wide">
            {systemPerspective.toUpperCase()} • ACTIVE
          </div>
        </div>
        {/* Orientation Layer - Always visible when activated */}
        <OrientationBar />
      </div>
      {showAttestationIndicators && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Dev Attestation</span>
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(164,120,255,0.6)] animate-[sage-verified-pulse_2.5s_ease-in-out_infinite]" />
        </div>
      )}
    </motion.div>
  );
}


