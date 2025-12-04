/**
 * HADRA Context Resolver
 * Determines:
 * - Which panel is active
 * - Whether onboarding or console mode
 * - Whether issue is new or repeated
 * - Whether the operator is interacting with HADRA
 * 
 * Future phases will integrate with:
 * - Cluster telemetry
 * - Onboarding flow
 * - Rho² agents
 * - Pattern detection
 */

export interface HadraEvent {
  severity?: "info" | "anomaly" | "warning" | "critical";
  message?: string;
  context?: "console" | "onboarding" | "wizard" | "mesh" | "agents" | "security";
  subsystem?: string;
  isRepeated?: boolean;
  operatorInteracting?: boolean;
}

export interface ResolvedContext {
  severity: "info" | "anomaly" | "warning" | "critical";
  message: string;
  context: string;
  subsystem?: string;
  isRepeated: boolean;
  operatorInteracting: boolean;
}

export function contextResolver(event: HadraEvent): ResolvedContext {
  return {
    severity: event.severity || "info",
    message: event.message || "",
    context: event.context || "console",
    subsystem: event.subsystem,
    isRepeated: event.isRepeated || false,
    operatorInteracting: event.operatorInteracting || false,
  };
}

