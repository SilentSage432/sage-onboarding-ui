"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useArcTelemetry } from "@/lib/signals/useArcTelemetry";
import ArcTelemetryReadout from "@/components/console/panels/ArcTelemetryReadout";

export default function ArcEpsilonPanel() {
  const telemetry = useArcTelemetry({
    arc: "epsilon",
    slug: "arc-epsilon",
    namespace: "arc-epsilon",
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Arc Epsilon</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Eye className="h-12 w-12 text-gray-400" />
          <div className="space-y-2">
            <h2 className="text-white font-semibold text-lg">OBSERVATION MODE</h2>
            <p className="text-gray-400 text-sm">
              This panel is read-only and displays Arc Epsilon status when available.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              No controls, no actions, no derived insights.
            </p>
          </div>
          <div className="w-full text-left">
            <ArcTelemetryReadout signal={telemetry.signal} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
