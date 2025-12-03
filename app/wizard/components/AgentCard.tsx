"use client";

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
}: {
  label: string;
  selected: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  description?: string;
  agent?: any;
  recommended?: boolean;
}) {
  const { setSelectedAgent } = useOnboardingDataStore();
  
  const agentId = agent?.id;
  const dependencies = agentId ? AGENT_DEPENDENCIES[agentId] : null;

  const handleClick = () => {
    if (agent) {
      setSelectedAgent(agent);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "sage-card-base sage-card-hover relative flex flex-col items-start text-left gap-3",
        // extra room for badge in top-right
        "pt-7 pr-10 pb-5 pl-5",
        selected && "sage-card-selected"
      )}
    >
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

      {/* Dependencies */}
      {dependencies && (dependencies.required?.length || dependencies.recommended?.length) ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {dependencies.required?.map((dep) => (
            <span
              key={`req-${dep}`}
              className="px-2 py-0.5 text-[11px] rounded-md bg-red-500/20 text-red-200 border border-red-400/30"
            >
              Requires: {getAgentLabel(dep)}
            </span>
          ))}
          {dependencies.recommended?.map((dep) => (
            <span
              key={`rec-${dep}`}
              className="px-2 py-0.5 text-[11px] rounded-md bg-purple-500/20 text-purple-100 border border-purple-400/30"
            >
              Recommended: {getAgentLabel(dep)}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

