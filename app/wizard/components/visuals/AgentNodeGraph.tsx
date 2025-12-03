"use client";

import { getAgentLabel } from "@/app/wizard/config/agentDependencies";

interface AgentNodeGraphProps {
  agents: string[];
}

export default function AgentNodeGraph({ agents }: AgentNodeGraphProps) {
  if (!agents || agents.length === 0) return null;

  // Calculate node positions in a circular or fan layout
  const centerX = 50;
  const centerY = 50;
  const radius = 35;
  
  const nodePositions = agents.map((_, i) => {
    const angle = (i / agents.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, angle };
  });

  return (
    <div className="w-full h-64 relative rounded-xl bg-black/20 border border-white/10 overflow-hidden">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* SVG for connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Lines from center to nodes */}
        {nodePositions.map((pos, i) => (
          <line
            key={`line-${i}`}
            x1={`${centerX}%`}
            y1={`${centerY}%`}
            x2={`${pos.x}%`}
            y2={`${pos.y}%`}
            stroke="rgba(160,130,255,0.25)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
        ))}
      </svg>

      {/* Center hub node */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${centerX}%`,
          top: `${centerY}%`,
        }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-500/40 border-2 border-purple-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(140,120,255,0.4)]">
          <span className="text-white text-xs font-semibold">Bundle</span>
        </div>
      </div>

      {/* Agent nodes */}
      {nodePositions.map((pos, i) => (
        <div
          key={agents[i]}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
        >
          <div className="px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white/80 shadow-[0_0_12px_rgba(140,120,255,0.2)] backdrop-blur-sm whitespace-nowrap max-w-[120px] truncate">
            {getAgentLabel(agents[i])}
          </div>
        </div>
      ))}
    </div>
  );
}

