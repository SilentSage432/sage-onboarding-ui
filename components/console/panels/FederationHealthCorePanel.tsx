"use client";

import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, XCircle, AlertTriangle, Heart } from "lucide-react";
import { useFederationHealthCore } from "@/lib/console/useFederationHealth";

export default function FederationHealthCorePanel() {
  const { data, loading, error, unavailable } = useFederationHealthCore();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation Health Core</h1>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 text-gray-400">
            <Activity className="h-5 w-5 animate-pulse" />
            <span>Loading detailed health metrics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation Health Core</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-red-500/30 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Not Connected</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Federation health core endpoint is unavailable. The backend service may not be running or the endpoint has not been implemented.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation Health Core</h1>
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

  const overallColor =
    data?.overall === "healthy"
      ? "text-green-400"
      : data?.overall === "degraded"
      ? "text-yellow-400"
      : data?.overall === "unhealthy"
      ? "text-red-400"
      : "text-gray-400";

  const overallIcon =
    data?.overall === "healthy" ? (
      <CheckCircle2 className="h-6 w-6 text-green-400" />
    ) : data?.overall === "degraded" ? (
      <AlertTriangle className="h-6 w-6 text-yellow-400" />
    ) : data?.overall === "unhealthy" ? (
      <XCircle className="h-6 w-6 text-red-400" />
    ) : (
      <Heart className="h-6 w-6 text-gray-400" />
    );

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "unhealthy":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getMetricStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Federation Health Core</h1>

      {/* Overall Status */}
      <motion.div
        whileHover={{
          boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
          scale: 1.01,
        }}
        transition={{ duration: 0.25 }}
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-purple-400" />
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">Overall Health</h2>
            <p className="text-gray-400 text-sm">Detailed federation health metrics</p>
          </div>
          <div className="flex items-center gap-2">
            {overallIcon}
            <span className={`capitalize font-semibold ${overallColor}`}>
              {data?.overall || "unknown"}
            </span>
          </div>
        </div>

        {(data?.nodeCount !== undefined || data?.activeNodes !== undefined) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {data.nodeCount !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total Nodes</span>
                <span className="text-white font-mono">{data.nodeCount}</span>
              </div>
            )}
            {data.activeNodes !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Active Nodes</span>
                <span className="text-white font-mono">{data.activeNodes}</span>
              </div>
            )}
          </div>
        )}

        {data?.lastUpdated && (
          <div className="pt-4 border-t border-white/10">
            <span className="text-gray-400 text-xs">Last updated: {data.lastUpdated}</span>
          </div>
        )}
      </motion.div>

      {/* Detailed Metrics */}
      {data?.metrics && data.metrics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg text-white font-semibold">Detailed Metrics</h2>
          {data.metrics.map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{
                boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
                scale: 1.01,
              }}
              transition={{ duration: 0.25 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getMetricStatusIcon(metric.status)}
                  <h3 className="text-white font-semibold">{metric.name}</h3>
                </div>
                <span className={`capitalize text-sm ${getMetricStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                </span>
                {metric.unit && <span className="text-sm text-gray-400">{metric.unit}</span>}
              </div>

              {metric.threshold && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 text-xs text-gray-400">
                  <div>
                    <span>Warning: </span>
                    <span className="text-yellow-400">{metric.threshold.warning}</span>
                  </div>
                  <div>
                    <span>Critical: </span>
                    <span className="text-red-400">{metric.threshold.critical}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
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
