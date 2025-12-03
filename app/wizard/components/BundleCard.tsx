"use client";

import { cn } from "@/lib/utils";
import { getAgentLabel } from "@/app/wizard/config/agentDependencies";

interface BundleCardProps {
  bundle: {
    id: string;
    name: string;
    description: string;
    recommended?: boolean;
    premium?: boolean;
    agents: string[];
  };
  onApply?: (bundle: any) => void;
  onPreview: (bundle: any) => void;
}

export default function BundleCard({ bundle, onApply, onPreview }: BundleCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 bg-white/5 border border-white/10",
        "backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer",
        "shadow-[0_0_22px_rgba(120,80,255,0.25)]",
        "hover:shadow-[0_0_28px_rgba(120,80,255,0.35)]",
        "hover:border-white/20"
      )}
      onClick={() => onPreview(bundle)}
    >
      {/* Premium / Recommended labels */}
      <div className="absolute top-4 right-4 flex gap-2">
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

      <h3 className="text-lg font-semibold text-white pr-20">{bundle.name}</h3>
      <p className="text-sm text-white/70 mt-2 leading-relaxed">{bundle.description}</p>

      {/* Included agents */}
      <div className="flex flex-wrap gap-2 mt-4">
        {bundle.agents.map((agentId) => (
          <span
            key={agentId}
            className="text-xs px-2 py-1 rounded-md bg-black/20 border border-white/10 text-white/60"
          >
            {getAgentLabel(agentId)}
          </span>
        ))}
      </div>

      {/* Apply button */}
      <div className="mt-6">
        <button
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium backdrop-blur-sm transition-all shadow-[0_0_12px_rgba(147,51,234,0.4)] hover:shadow-[0_0_16px_rgba(147,51,234,0.6)] active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(bundle);
          }}
        >
          Apply Bundle
        </button>
      </div>
    </div>
  );
}

