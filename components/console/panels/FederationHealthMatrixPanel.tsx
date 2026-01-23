"use client";

import { motion } from "framer-motion";
import { Grid3x3, AlertCircle, Activity, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useFederationHealthMatrix } from "@/lib/console/useFederationHealth";

export default function FederationHealthMatrixPanel() {
  const { data, loading, error, unavailable } = useFederationHealthMatrix();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation Health Matrix</h1>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 text-gray-400">
            <Grid3x3 className="h-5 w-5 animate-pulse" />
            <span>Loading health metrics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation Health Matrix</h1>
        <motion.div
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3 text-gray-400">
            <Grid3x3 className="h-5 w-5" />
            <span className="font-semibold">Status Unavailable</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Federation health information is not currently available. This is an observational panel and will display data when the service is connected.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-bold">Federation Health Matrix</h1>
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
      <Activity className="h-6 w-6 text-gray-400" />
    );

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400 border-green-500/30 bg-green-500/10";
      case "degraded":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "unhealthy":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  const getMetricStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Federation Health Matrix</h1>

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
          <Grid3x3 className="h-8 w-8 text-blue-400" />
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">Overall Health</h2>
            <p className="text-gray-400 text-sm">Federation system health status</p>
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

      {/* Health Metrics Grid */}
      {data?.metrics && data.metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.metrics.map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{
                boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
                scale: 1.01,
              }}
              transition={{ duration: 0.25 }}
              className={`backdrop-blur-md border rounded-xl p-4 space-y-2 ${getMetricStatusColor(metric.status)}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{metric.name}</h3>
                {getMetricStatusIcon(metric.status)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                </span>
                {metric.unit && <span className="text-xs opacity-70">{metric.unit}</span>}
              </div>
              <div className="text-xs opacity-70 capitalize">{metric.status}</div>
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
