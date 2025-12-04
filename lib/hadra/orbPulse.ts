// lib/hadra/orbPulse.ts
// HADRA Orb Pulse Modulation Engine
// Controls animation classes based on orb state

export type OrbStatus = 
  | "idle" 
  | "analyzing" 
  | "insight" 
  | "warning" 
  | "critical" 
  | "onboarding" 
  | "operator-focus";

export function getOrbPulse(status: OrbStatus): string {
  switch (status) {
    case "idle":
      return "animate-[sage-orb-pulse_2.4s_ease-in-out_infinite]";

    case "analyzing":
      return "animate-hadra-analyze";

    case "insight":
      return "ring-2 ring-indigo-400/60 animate-hadra-insight";

    case "warning":
      return "ring-2 ring-yellow-400/70 animate-hadra-warning";

    case "critical":
      return "ring-2 ring-rose-500/80 animate-hadra-critical";

    case "onboarding":
      return "animate-hadra-soft";

    case "operator-focus":
      return "animate-hadra-focus ring-2 ring-purple-300/60";

    default:
      return "animate-[sage-orb-pulse_2.4s_ease-in-out_infinite]";
  }
}

