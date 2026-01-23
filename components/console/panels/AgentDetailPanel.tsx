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
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 max-sm:p-2"
    >
      <div className="relative bg-black/70 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85dvh] overflow-y-auto p-6 space-y-6 max-md:p-4 max-sm:p-3 max-sm:space-y-4 max-sm:max-h-[90dvh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white max-sm:top-2 max-sm:right-2 w-8 h-8 flex items-center justify-center max-sm:w-10 max-sm:h-10"
          aria-label="Close panel"
        >
          <X className="h-5 w-5 max-sm:h-6 max-sm:w-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 max-sm:gap-2 pr-8">
          <Icon className="h-8 w-8 text-blue-400 max-sm:h-6 max-sm:w-6 flex-shrink-0" />
          <h1 className="text-2xl font-semibold text-white max-md:text-xl max-sm:text-lg truncate">{agent.name}</h1>
        </div>
        <p className="text-gray-400 text-sm max-sm:text-xs">{agent.description}</p>

        {/* Status */}
        <div>
          <h2 className="text-lg text-white font-semibold mb-2 max-sm:text-base max-sm:mb-1.5">Status</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 max-sm:p-3 max-sm:gap-3">
            <Activity className="h-6 w-6 text-green-400 max-sm:h-5 max-sm:w-5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white capitalize max-sm:text-sm">{agent.status}</p>
              <p className="text-gray-400 text-sm max-sm:text-xs">
                Agent heartbeat received 2 seconds ago.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3 max-sm:space-y-2">
          <h2 className="text-lg text-white font-semibold max-sm:text-base">Live Metrics</h2>
          <div className="grid grid-cols-2 gap-3 max-sm:gap-2">
            <Metric label="CPU Load" value="4.3%" icon={Cpu} />
            <Metric label="Memory" value="128MB" icon={Settings} />
            <Metric label="Mesh Neighbors" value="3" icon={Network} />
            <Metric label="Autonomy" value="Assisted" icon={Zap} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 max-sm:space-y-3">
          <h2 className="text-lg text-white font-semibold max-sm:text-base">Controls</h2>
          <div className="flex gap-3 max-sm:flex-col max-sm:gap-2">
            <button className="flex-1 bg-blue-600/20 border border-blue-600/30 text-blue-300 py-2 rounded-lg hover:bg-blue-600/30 max-sm:py-2.5 max-sm:text-sm touch-manipulation min-h-[44px]">
              Restart Agent
            </button>
            <button className="flex-1 bg-purple-600/20 border border-purple-600/30 text-purple-300 py-2 rounded-lg hover:bg-purple-600/30 max-sm:py-2.5 max-sm:text-sm touch-manipulation min-h-[44px]">
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
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 max-sm:p-3 max-sm:gap-2">
      <Icon className="h-5 w-5 text-blue-400 max-sm:h-4 max-sm:w-4 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-white text-sm max-sm:text-xs">{label}</p>
        <p className="text-gray-400 text-xs max-sm:text-[10px]">{value}</p>
      </div>
    </div>
  );
}


