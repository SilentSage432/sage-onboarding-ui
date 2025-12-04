// lib/hadra/systemContext.ts

export interface SystemContext {
  loadLevel: number;     // 0–1 scale
  anomalyRate: number;   // anomalies per minute
  uptimeHours: number;
}

