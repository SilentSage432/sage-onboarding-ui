// lib/hadra/memory.ts

export interface HadraMemory {
  recentEvents: string[];        // last 50 event messages
  recentInsights: string[];      // last 50 insight titles
  anomalyCount: number;          // anomalies in recent window
  warningCount: number;          // warnings in recent window
  criticalCount: number;         // criticals in recent window
}

