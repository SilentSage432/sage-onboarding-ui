"use client";

import { motion } from "framer-motion";
import { Circle, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useArcStatus } from "@/lib/console/useArcStatus";
import { useArcTelemetry } from "@/lib/signals/useArcTelemetry";
import ArcTelemetryReadout from "@/components/console/panels/ArcTelemetryReadout";

export default function ArcThetaPanel() {
  const { data, loading, error, unavailable } = useArcStatus("theta");
  const telemetry = useArcTelemetry({
    arc: "theta",
    slug: "arc-theta",
    namespace: "arc-theta",
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Arc Theta</h1>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 text-gray-400">
            <Circle className="h-5 w-5 animate-pulse" />
            <span>Loading status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Arc Theta</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-gray-400">
            <Circle className="h-5 w-5" />
            <span className="font-semibold">Status Unavailable</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Arc Theta status information is not currently available. This is an observational panel and will display data when the service is connected.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Arc Theta</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-yellow-500/30 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </motion.div>
      </div>
    );
  }

  const statusIcon =
    data?.status === "active" ? (
      <CheckCircle2 className="h-6 w-6 text-green-400" />
    ) : data?.status === "inactive" ? (
      <XCircle className="h-6 w-6 text-red-400" />
    ) : (
      <Circle className="h-6 w-6 text-gray-400" />
    );

  const healthColor =
    data?.health === "healthy"
      ? "text-green-400"
      : data?.health === "degraded"
      ? "text-yellow-400"
      : data?.health === "unhealthy"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Arc Theta</h1>

      <motion.div
        whileHover={{
          boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
          scale: 1.01,
        }}
        transition={{ duration: 0.25 }}
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Circle className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Status</h2>
            <p className="text-gray-400 text-sm">Arc Theta operational state</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">State</span>
            <div className="flex items-center gap-2">
              {statusIcon}
              <span className="text-white capitalize">{data?.status || "unknown"}</span>
            </div>
          </div>

          {data?.health && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Health</span>
              <span className={`capitalize ${healthColor}`}>
                {data.health}
              </span>
            </div>
          )}

          {data?.version && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Version</span>
              <span className="text-white font-mono text-sm">{data.version}</span>
            </div>
          )}

          {data?.lastSeen && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Last Seen</span>
              <span className="text-white text-sm">{data.lastSeen}</span>
            </div>
          )}
        </div>

        {data?.message && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-gray-300 text-sm">{data.message}</p>
          </div>
        )}

        <ArcTelemetryReadout signal={telemetry.signal} />
      </motion.div>
    </div>
  );
}
