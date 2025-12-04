"use client";

import { motion } from "framer-motion";
import { KeyRound, RefreshCw } from "lucide-react";

const mockKeyset = {
  operator: "OP-7FAD19A",
  shardA: "shard-01-93AF…",
  shardB: "shard-02-CC12…",
  shardC: "shard-03-A1F9…",
  nextRotation: "24 hours",
};

export default function Rho2Panel() {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
        scale: 1.01,
      }}
      transition={{ duration: 0.25 }}
      className="relative z-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 space-y-6"
    >
      <h1 className="text-2xl text-white font-bold">Rho² Keyring</h1>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <KeyRound className="h-6 w-6 text-purple-400" />
          <h2 className="text-white font-semibold">Active Shards</h2>
        </div>

        {Object.entries(mockKeyset).map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm text-gray-300">
            <span className="capitalize">{k}</span>
            <span className="text-gray-400">{v}</span>
          </div>
        ))}

        <button className="mt-4 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 px-4 py-2 rounded-lg flex items-center gap-2 border border-purple-600/30">
          <RefreshCw className="h-4 w-4" />
          Rotate Keyset
        </button>
      </div>
    </motion.div>
  );
}
