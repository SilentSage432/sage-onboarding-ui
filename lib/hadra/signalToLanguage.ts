/**
 * Signal → Language Mapping
 * 
 * Reference implementation for real Signal → Language mapping.
 * Pure function mapping SignalEmitter to diagnostic statements.
 * 
 * This follows the HADRA Signal → Language Constitution:
 * - No intelligence, prediction, or advice
 * - Direct state observation only
 * - Calm, matter-of-fact tone
 * - Precision over prose
 */

import type { SignalEmitter } from "@/lib/signals/types";
import type { HadraEvent, HadraEventLevel } from "./event";

/**
 * Diagnostic Statement
 * Structured diagnostic output derived from signals
 */
export interface DiagnosticStatement {
  /** Diagnostic title/headline */
  title: string;
  /** Diagnostic body/description */
  body: string;
  /** Confidence level (high = certain, low = uncertain) */
  confidence: "high" | "low";
}

/**
 * Convert DiagnosticStatement to HadraEvent
 * 
 * @param statement - Diagnostic statement
 * @param signal - Original signal (for timestamp and severity mapping)
 * @returns HadraEvent
 */
export function diagnosticToEvent(
  statement: DiagnosticStatement,
  signal: SignalEmitter
): HadraEvent {
  // Map signal severity to HadraEventLevel
  const levelMap: Record<SignalEmitter["severity"], HadraEventLevel> = {
    info: "normal",
    notice: "anomaly",
    warning: "warning",
    critical: "critical",
    unavailable: "normal",
  };

  // Combine title and body for message
  const message = `${statement.title} ${statement.body}`;

  return {
    id: signal.id,
    timestamp: signal.timestamp,
    level: levelMap[signal.severity],
    subsystem: "system", // GitOps reconciliation is a system-level concern
    message,
  };
}

/**
 * Map sage.reconciliation signal to diagnostic statement
 * 
 * Pure function: no side effects, no randomness, no state.
 * Returns null if signal is not sage.reconciliation.
 * 
 * Reference implementation for real Signal → Language mapping.
 * 
 * @param signal - SignalEmitter to map
 * @returns DiagnosticStatement | null
 */
export function mapReconciliationSignal(signal: SignalEmitter): DiagnosticStatement | null {
  // Only process sage.reconciliation signals
  if (signal.id !== "sage.reconciliation") {
    return null;
  }

  // Extract interval_seconds from metadata if available
  const intervalSeconds = signal.metadata?.interval_seconds as number | undefined;
  const intervalText = intervalSeconds ? `${intervalSeconds}` : "current";

  // Map state to diagnostic statement
  switch (signal.state) {
    case "aligned":
      return {
        title: "GitOps reconciliation aligned",
        body: `All observed targets converged within the last ${intervalText}-second interval.`,
        confidence: "high",
      };

    case "drifting":
      return {
        title: "GitOps reconciliation drift observed",
        body: `One or more reconciliation targets failed to converge within the last ${intervalText}-second interval.`,
        confidence: "high",
      };

    case "stalled":
      return {
        title: "GitOps reconciliation stalled",
        body: "Reconciliation has not progressed since the last successful cycle.",
        confidence: "high",
      };

    case "unknown":
    case "unavailable":
    default:
      return {
        title: "Reconciliation state unavailable",
        body: "Reconciliation status could not be observed during the current interval.",
        confidence: "low",
      };
  }
}

/**
 * Map sage.health signal to diagnostic statement
 * 
 * Pure function: no side effects, no randomness, no state.
 * Returns null if signal is not sage.health.
 * 
 * Reference implementation for real Signal → Language mapping.
 * 
 * @param signal - SignalEmitter to map
 * @returns DiagnosticStatement | null
 */
export function mapHealthSignal(signal: SignalEmitter): DiagnosticStatement | null {
  // Only process sage.health signals
  if (signal.id !== "sage.health") {
    return null;
  }

  // Map state to diagnostic statement
  switch (signal.state) {
    case "nominal":
      return {
        title: "System health nominal",
        body: "All system components operating within expected parameters.",
        confidence: "high",
      };

    case "degraded":
      return {
        title: "System health degraded",
        body: "One or more system components operating outside expected parameters.",
        confidence: "high",
      };

    case "unavailable":
    default:
      return {
        title: "System health unavailable",
        body: "System health status could not be observed during the current interval.",
        confidence: "low",
      };
  }
}

/**
 * Map sage.capacity signal to diagnostic statement
 * 
 * Pure function: no side effects, no randomness, no state.
 * Returns null if signal is not sage.capacity.
 * 
 * Reference implementation for real Signal → Language mapping.
 * 
 * @param signal - SignalEmitter to map
 * @returns DiagnosticStatement | null
 */
export function mapCapacitySignal(signal: SignalEmitter): DiagnosticStatement | null {
  // Only process sage.capacity signals
  if (signal.id !== "sage.capacity") {
    return null;
  }

  // Map state to diagnostic statement
  switch (signal.state) {
    case "normal":
      return {
        title: "System capacity within normal range",
        body: "Observed workload levels are operating within expected capacity limits.",
        confidence: "high",
      };

    case "constrained":
      return {
        title: "System capacity under constraint",
        body: "Observed workload levels indicate sustained pressure on system resources.",
        confidence: "high",
      };

    case "unavailable":
    default:
      return {
        title: "System capacity unavailable",
        body: "Capacity metrics could not be observed during the current interval.",
        confidence: "low",
      };
  }
}

/**
 * Map sage.latency signal to diagnostic statement
 * 
 * Pure function: no side effects, no randomness, no state.
 * Returns null if signal is not sage.latency.
 * 
 * Reference implementation for real Signal → Language mapping.
 * 
 * @param signal - SignalEmitter to map
 * @returns DiagnosticStatement | null
 */
export function mapLatencySignal(signal: SignalEmitter): DiagnosticStatement | null {
  // Only process sage.latency signals
  if (signal.id !== "sage.latency") {
    return null;
  }

  // Map state to diagnostic statement
  switch (signal.state) {
    case "normal":
      return {
        title: "System latency within normal bounds",
        body: "Observed latency metrics are operating within expected parameters.",
        confidence: "high",
      };

    case "elevated":
      return {
        title: "System latency elevated",
        body: "Observed latency metrics indicate sustained elevation above baseline.",
        confidence: "high",
      };

    case "unstable":
      return {
        title: "System latency unstable",
        body: "Observed latency metrics show significant variability and instability.",
        confidence: "high",
      };

    case "unavailable":
    default:
      return {
        title: "System latency unavailable",
        body: "Latency metrics could not be observed during the current interval.",
        confidence: "low",
      };
  }
}
