"use client";

import { motion } from "framer-motion";
import { X, AlertCircle, Eye, Server, Shield, Clock } from "lucide-react";
import { useArcStatus } from "@/lib/console/useArcStatus";
import { useArcTelemetry } from "@/lib/signals/useArcTelemetry";
import ArcTelemetryReadout from "@/components/console/panels/ArcTelemetryReadout";

export default function ArcChiPanel() {
  const { data, loading, error, unavailable } = useArcStatus("chi");
  const telemetry = useArcTelemetry({
    arc: "chi",
    slug: "arc-chi",
    namespace: "arc-chi",
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Arc Χ (Chi)</h1>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 text-gray-400">
            <Eye className="h-5 w-5 animate-pulse" />
            <span>Observing...</span>
          </div>
        </div>
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Arc Χ (Chi)</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-gray-400">
            <Eye className="h-5 w-5" />
            <span className="font-semibold">Observation Unavailable</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Arc Chi observation data is not currently available. This is a read-only witness panel and will display data when the service is connected.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Arc Χ (Chi)</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-yellow-500/30 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Observation Error</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </motion.div>
      </div>
    );
  }

  const getPodStatusColor = (status?: string) => {
    if (!status) return "text-gray-400";
    const s = status.toLowerCase();
    if (s === "running" || s === "ready") return "text-green-400";
    if (s === "pending" || s === "containercreating") return "text-yellow-400";
    if (s === "failed" || s === "error" || s === "crashloopbackoff") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Arc Χ (Chi)</h1>

      {/* Identity Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <X className="h-6 w-6 text-pink-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">Identity</h2>
            <p className="text-gray-400 text-sm">Arc configuration and role</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Arc Name</span>
            <span className="text-white font-mono text-sm">Χ (Chi)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Namespace</span>
            <span className="text-white font-mono text-sm">{data?.namespace || "arc-chi"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Mode</span>
            <span className="text-white text-sm">{data?.mode || "Observation"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Role</span>
            <span className="text-white text-sm">{data?.role || "Foundational Bus Anchor"}</span>
          </div>
        </div>

        <ArcTelemetryReadout signal={telemetry.signal} />
      </motion.div>

      {/* Kubernetes Status Section */}
      {data?.pod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Server className="h-6 w-6 text-cyan-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">Kubernetes Status</h2>
              <p className="text-gray-400 text-sm">Live pod observation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {data.pod.name && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Pod Name</span>
                <span className="text-white font-mono text-sm">{data.pod.name}</span>
              </div>
            )}

            {data.pod.status && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Pod Status</span>
                <span className={`capitalize text-sm ${getPodStatusColor(data.pod.status)}`}>
                  {data.pod.status}
                </span>
              </div>
            )}

            {data.pod.restartCount !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Restart Count</span>
                <span className="text-white font-mono text-sm">{data.pod.restartCount}</span>
              </div>
            )}

            {data.pod.nodeName && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Node Name</span>
                <span className="text-white font-mono text-sm">{data.pod.nodeName}</span>
              </div>
            )}

            {data.pod.age && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Pod Age</span>
                <span className="text-white text-sm">{data.pod.age}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Network Posture Section */}
      {data?.network && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">Network Posture</h2>
              <p className="text-gray-400 text-sm">Cilium policy observation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">CiliumNetworkPolicy</span>
              <span className={`text-sm ${data.network.ciliumPolicyPresent ? "text-green-400" : "text-gray-400"}`}>
                {data.network.ciliumPolicyPresent ? "Present" : "Not Present"}
              </span>
            </div>

            {data.network.defaultDeny !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Default-Deny</span>
                <span className={`text-sm ${data.network.defaultDeny ? "text-green-400" : "text-yellow-400"}`}>
                  {data.network.defaultDeny ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}
          </div>

          {data.network.policyNames && data.network.policyNames.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <span className="text-gray-400 text-sm block mb-2">Policy Names</span>
              <div className="space-y-1">
                {data.network.policyNames.map((policyName, index) => (
                  <div key={index} className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded">
                    {policyName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Temporal Signal Section */}
      {data?.pod?.startTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">Temporal Signal</h2>
              <p className="text-gray-400 text-sm">Pod lifecycle timing</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Pod Start Time</span>
              <span className="text-white font-mono text-sm">{data.pod.startTime}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fallback: Show basic status if no extended data */}
      {!data?.pod && !data?.network && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-gray-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">Observation Mode</h2>
              <p className="text-gray-400 text-sm">Read-only witness panel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {data?.status && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="text-white capitalize text-sm">{data.status}</span>
              </div>
            )}

            {data?.health && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Health</span>
                <span className={`capitalize text-sm ${
                  data.health === "healthy" ? "text-green-400" :
                  data.health === "degraded" ? "text-yellow-400" :
                  data.health === "unhealthy" ? "text-red-400" :
                  "text-gray-400"
                }`}>
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
        </motion.div>
      )}
    </div>
  );
}
