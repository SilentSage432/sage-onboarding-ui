// lib/hadra/insight.ts

export type InsightSeverity = "info" | "anomaly" | "warning" | "critical";

export interface HadraInsight {
  id: string;
  severity: InsightSeverity;
  title: string;
  description?: string;
  timestamp: string;
  subsystem: string;     // e.g. "mesh", "agents", "rho2", "system"
  actions?: string[];    // suggestions
}

