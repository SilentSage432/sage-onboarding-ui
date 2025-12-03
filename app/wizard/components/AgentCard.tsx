"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOnboardingDataStore } from "@/app/wizard/store/useOnboardingDataStore";
import { AGENT_DEPENDENCIES, getAgentLabel } from "@/app/wizard/config/agentDependencies";

export default function AgentCard({
  label,
  selected,
  onClick,
  icon,
  description,
  agent,
  recommended,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  selected: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  description?: string;
  agent?: any;
  recommended?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { setSelectedAgent } = useOnboardingDataStore();
  const [hover, setHover] = useState(false);
  
  const agentId = agent?.id;
  const dependencies = agentId ? AGENT_DEPENDENCIES[agentId] : null;

  const handleClick = () => {
    if (agent) {
      setSelectedAgent(agent);
    } else if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    setHover(true);
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    setHover(false);
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "sage-card-base sage-card-hover relative flex flex-col items-start text-left gap-3",
        // extra room for badge in top-right
        "pt-7 pr-10 pb-5 pl-5",
        "transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(150,120,255,0.35)] hover:bg-white/10",
        selected && "sage-card-selected"
      )}
    >
      {/* Selection ripple animation */}
      {selected && <div className="sage-ripple" />}
      {/* Recommended badge anchored inside this card only */}
      {recommended && (
        <span className="absolute top-3 right-3 px-2 py-1 text-[11px] rounded-full bg-purple-500/30 text-purple-100 border border-purple-300/70">
          Recommended
        </span>
      )}

      {/* Icon (if provided) */}
      {icon && (
        <div className="sage-card-icon">
          {icon}
        </div>
      )}

      {/* Title + category */}
      <div className="flex flex-col gap-1">
        <h3 className="sage-card-title">{label}</h3>
        {agent?.category && (
          <p className="text-xs text-white/50">{agent.category}</p>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="sage-card-desc text-sm text-white/70">
          {description}
        </p>
      )}

      {/* Advanced Info - Only visible on hover or selection */}
      <div
        className={cn(
          "transition-all duration-200 overflow-hidden",
          (hover || selected) ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
        )}
      >
        {/* Capabilities */}
        {agent?.capabilities && agent.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 opacity-70">
            {agent.capabilities.slice(0, 3).map((cap: string) => (
              <span
                key={cap}
                className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60"
              >
                {cap}
              </span>
            ))}
          </div>
        )}

        {/* Dependencies */}
        {dependencies && (dependencies.required?.length || dependencies.recommended?.length) ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {dependencies.required?.map((dep, idx) => (
              <span
                key={`req-${dep}`}
                className="px-2 py-0.5 text-[11px] rounded-md bg-red-500/20 text-red-200 border border-red-400/30 transition-all opacity-0 animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                Requires: {getAgentLabel(dep)}
              </span>
            ))}
            {dependencies.recommended?.map((dep, idx) => (
              <span
                key={`rec-${dep}`}
                className="px-2 py-0.5 text-[11px] rounded-md bg-purple-500/20 text-purple-100 border border-purple-400/30 transition-all opacity-0 animate-fade-in"
                style={{ animationDelay: `${(dependencies.required?.length || 0) * 50 + idx * 50}ms` }}
              >
                Recommended: {getAgentLabel(dep)}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}

