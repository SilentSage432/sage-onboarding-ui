"use client";

import { motion } from "framer-motion";
import { Network, AlertCircle, CheckCircle2, XCircle, Server } from "lucide-react";
import { useFederationState } from "@/lib/console/useFederationHealth";

export default function FederationStatePanel() {
  const { data, loading, error, unavailable } = useFederationState();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation State</h1>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 text-gray-400">
            <Network className="h-5 w-5 animate-pulse" />
            <span>Loading federation state...</span>
          </div>
        </div>
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation State</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-gray-400">
            <Network className="h-5 w-5" />
            <span className="font-semibold">Status Unavailable</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Federation state information is not currently available. This is an observational panel and will display data when the service is connected.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation State</h1>
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

  const stateColor =
    data?.state === "active" || data?.state === "ready"
      ? "text-green-400"
      : data?.state === "degraded" || data?.state === "partial"
      ? "text-yellow-400"
      : data?.state === "inactive" || data?.state === "error"
      ? "text-red-400"
      : "text-gray-400";

  const stateIcon =
    data?.state === "active" || data?.state === "ready" ? (
      <CheckCircle2 className="h-6 w-6 text-green-400" />
    ) : data?.state === "inactive" || data?.state === "error" ? (
      <XCircle className="h-6 w-6 text-red-400" />
    ) : (
      <Network className="h-6 w-6 text-gray-400" />
    );

  const getNodeStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ready":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      case "degraded":
      case "partial":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "inactive":
      case "error":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Federation State</h1>

      {/* Overall State */}
      <motion.div
        whileHover={{
          boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
          scale: 1.01,
        }}
        transition={{ duration: 0.25 }}
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-cyan-400" />
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">Current State</h2>
            <p className="text-gray-400 text-sm">Federation operational state</p>
          </div>
          <div className="flex items-center gap-2">
            {stateIcon}
            <span className={`capitalize font-semibold ${stateColor}`}>
              {data?.state || "unknown"}
            </span>
          </div>
        </div>

        {data?.phase && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Phase</span>
              <span className="text-white capitalize">{data.phase}</span>
            </div>
          </div>
        )}

        {data?.lastUpdated && (
          <div className="pt-4 border-t border-white/10">
            <span className="text-gray-400 text-xs">Last updated: {data.lastUpdated}</span>
          </div>
        )}
      </motion.div>

      {/* Nodes List */}
      {data?.nodes && data.nodes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg text-white font-semibold">Federation Nodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.nodes.map((node, index) => (
              <motion.div
                key={node.id || index}
                whileHover={{
                  boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
                  scale: 1.01,
                }}
                transition={{ duration: 0.25 }}
                className={`backdrop-blur-md border rounded-xl p-4 space-y-2 ${getNodeStatusColor(node.status)}`}
              >
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{node.name || node.id}</h3>
                    {node.role && (
                      <p className="text-xs opacity-70 mt-1">Role: {node.role}</p>
                    )}
                  </div>
                  <span className="text-xs capitalize">{node.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {data?.message && (
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-300 text-sm">{data.message}</p>
        </motion.div>
      )}
    </div>
  );
}
