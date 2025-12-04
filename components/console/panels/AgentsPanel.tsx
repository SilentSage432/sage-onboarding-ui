"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Shield, Wrench, Search } from "lucide-react";
import AgentDetailPanel from "@/components/console/panels/AgentDetailPanel";

const mockAgents = [
  {
    id: "inv-01",
    name: "Inventory Auditor",
    category: "Automation",
    status: "ready",
    description: "Scans item counts, detects anomalies, syncs stock levels.",
    icon: Wrench,
  },
  {
    id: "mesh-02",
    name: "Mesh Sentinel",
    category: "Security",
    status: "active",
    description: "Monitors mesh signals and detects unusual agent patterns.",
    icon: Shield,
  },
  {
    id: "predict-03",
    name: "Forecast Engine",
    category: "Predictive",
    status: "idle",
    description: "Predicts resource usage & operational trends.",
    icon: Brain,
  },
];

type Agent = (typeof mockAgents)[number];

export default function AgentsPanel() {
  const [query, setQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filtered = mockAgents.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Agents</h1>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className="bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-white w-full"
          placeholder="Search agents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((agent) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              whileHover={{
                boxShadow: "0px 0px 35px rgba(150, 100, 255, 0.25)",
                scale: 1.01,
              }}
              transition={{ duration: 0.25 }}
              className="relative z-10 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-blue-400" />
                <h2 className="text-lg text-white font-semibold">
                  {agent.name}
                </h2>
              </div>
              <p className="text-gray-400 text-sm mt-1">{agent.description}</p>
              <span
                className={`text-xs mt-2 inline-block px-2 py-1 rounded-md ${
                  agent.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : agent.status === "idle"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {agent.status}
              </span>
            </motion.div>
          );
        })}
      </div>

      {selectedAgent && (
        <AgentDetailPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

