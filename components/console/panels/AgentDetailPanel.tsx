"use client";

import { X, Activity, Cpu, Network, Settings, Zap } from "lucide-react";
import { motion } from "framer-motion";

type AgentDetail = {
  id: string;
  name: string;
  description: string;
  status: string;
  icon: any;
};

export default function AgentDetailPanel({
  agent,
  onClose,
}: {
  agent: AgentDetail;
  onClose: () => void;
}) {
  const Icon = agent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
    >
      <div className="relative bg-black/70 border border-white/10 rounded-2xl shadow-2xl w-[650px] max-h-[80vh] overflow-y-auto p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-semibold text-white">{agent.name}</h1>
        </div>
        <p className="text-gray-400 text-sm">{agent.description}</p>

        {/* Status */}
        <div>
          <h2 className="text-lg text-white font-semibold mb-2">Status</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <Activity className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-white capitalize">{agent.status}</p>
              <p className="text-gray-400 text-sm">
                Agent heartbeat received 2 seconds ago.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <h2 className="text-lg text-white font-semibold">Live Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="CPU Load" value="4.3%" icon={Cpu} />
            <Metric label="Memory" value="128MB" icon={Settings} />
            <Metric label="Mesh Neighbors" value="3" icon={Network} />
            <Metric label="Autonomy" value="Assisted" icon={Zap} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <h2 className="text-lg text-white font-semibold">Controls</h2>
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600/20 border border-blue-600/30 text-blue-300 py-2 rounded-lg hover:bg-blue-600/30">
              Restart Agent
            </button>
            <button className="flex-1 bg-purple-600/20 border border-purple-600/30 text-purple-300 py-2 rounded-lg hover:bg-purple-600/30">
              Change Autonomy Mode
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
      <Icon className="h-5 w-5 text-blue-400" />
      <div>
        <p className="text-white text-sm">{label}</p>
        <p className="text-gray-400 text-xs">{value}</p>
      </div>
    </div>
  );
}


