/**
 * HADRA Type Definitions
 * TypeScript interfaces for HADRA-01 messaging and events
 */

export type HadraRole = "operator" | "hadra" | "system";

export interface HadraMessage {
  id: string;
  role: HadraRole;
  content: string;
  timestamp: number;
  severity?: "info" | "anomaly" | "warning" | "critical";
  subsystem?: string;
}

export interface HadraInsight {
  role: "hadra";
  content: string;
  ts: number;
  severity?: "info" | "anomaly" | "warning" | "critical";
  subsystem?: string;
}

export interface HadraConsoleMessage {
  role: "operator" | "hadra" | "system";
  content: string;
  ts: number;
}

export interface HadraActionRequest {
  action: string;
  target?: string;
  reason: string;
  confidence: number;
}

export interface HadraStatus {
  type: "opened" | "closed" | "idle" | "analyzing" | "insight" | "warning" | "critical";
}

