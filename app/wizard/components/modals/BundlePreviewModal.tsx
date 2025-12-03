"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import AgentNodeGraph from "../visuals/AgentNodeGraph";
import { getAgentLabel } from "@/app/wizard/config/agentDependencies";

interface BundlePreviewModalProps {
  bundle: {
    id: string;
    name: string;
    description: string;
    recommended?: boolean;
    premium?: boolean;
    agents: string[];
  } | null;
  onApply: (bundle: any) => void;
  onClose: () => void;
}

export default function BundlePreviewModal({ bundle, onApply, onClose }: BundlePreviewModalProps) {
  if (!bundle) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.18, 0.9, 0.3, 1] }}
          className={cn(
            "relative z-50 w-full max-w-3xl p-8 rounded-2xl",
            "bg-[#0b0f17]/70 border border-white/10 backdrop-blur-2xl",
            "shadow-[0_0_40px_rgba(120,80,255,0.35)]",
            "max-h-[85vh] overflow-y-auto sage-scroll"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white">
                {bundle.name}
              </h2>
              {bundle.premium && (
                <span className="px-2 py-1 text-xs rounded-full bg-purple-500/25 text-purple-100 border border-purple-300/40">
                  PREMIUM
                </span>
              )}
              {bundle.recommended && (
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/25 text-indigo-100 border border-indigo-300/40">
                  ⭐ RECOMMENDED
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white text-xl transition-colors"
            >
              ×
            </button>
          </div>

          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            {bundle.description}
          </p>

          {/* Diagram */}
          <div className="mb-6">
            <AgentNodeGraph agents={bundle.agents} />
          </div>

          {/* Included agents */}
          <div className="sage-stack-lg">
            <h3 className="text-white/90 font-semibold text-lg">Included Agents</h3>
            <div className="flex flex-wrap gap-2">
              {bundle.agents.map((agentId) => (
                <span
                  key={agentId}
                  className="px-3 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-white/70"
                >
                  {getAgentLabel(agentId)}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(bundle);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-[0_0_15px_rgba(170,120,255,0.6)] hover:shadow-[0_0_20px_rgba(170,120,255,0.8)] transition-all"
            >
              Apply Bundle
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

