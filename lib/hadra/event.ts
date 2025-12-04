// lib/hadra/event.ts

export type HadraEventLevel = "normal" | "anomaly" | "warning" | "critical";

export interface HadraEvent {
  id: string;
  timestamp: string;
  level: HadraEventLevel;
  subsystem: string;   // mesh | agents | rho2 | system | console
  message: string;
}

