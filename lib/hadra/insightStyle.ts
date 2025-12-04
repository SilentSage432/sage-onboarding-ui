// lib/hadra/insightStyle.ts

export const severityStyles = {
  info: {
    border: "border-white/10",
    text: "text-gray-300",
    glow: "hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]",
  },
  anomaly: {
    border: "border-indigo-400/30",
    text: "text-indigo-200",
    glow: "hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]",
  },
  warning: {
    border: "border-yellow-400/40",
    text: "text-yellow-200",
    glow: "hover:shadow-[0_0_12px_rgba(234,179,8,0.4)]",
  },
  critical: {
    border: "border-rose-500/50",
    text: "text-rose-200",
    glow: "hover:shadow-[0_0_16px_rgba(244,63,94,0.6)]",
  },
} as const;

