"use client";

import { useMemo } from "react";
import { SignalEmitter, SignalSeverity } from "./types";
import { OrbStatus } from "@/lib/hadra/orbPulse";

/**
 * Aggregated Signal State
 * Result of signal aggregation with effective HADRA state
 */
export type AggregatedSignalState = {
  /** Effective HADRA orb status derived from signals */
  orbStatus: OrbStatus;
  /** Highest severity among all signals */
  maxSeverity: SignalSeverity;
  /** All active signals (excluding unavailable) */
  activeSignals: SignalEmitter[];
  /** Whether any signals are present */
  hasSignals: boolean;
};

/**
 * Severity precedence order (highest to lowest)
 * Used for deterministic aggregation
 */
const SEVERITY_ORDER: Record<SignalSeverity, number> = {
  critical: 4,
  warning: 3,
  notice: 2,
  info: 1,
  unavailable: 0,
};

/**
 * Map severity to HADRA orb status
 * Pure function mapping signal severity to visual state
 */
function severityToOrbStatus(severity: SignalSeverity): OrbStatus {
  switch (severity) {
    case "critical":
      return "critical";
    case "warning":
      return "warning";
    case "notice":
      return "insight";
    case "info":
      return "insight";
    case "unavailable":
      return "idle";
    default:
      return "idle";
  }
}

/**
 * useSignalAggregation
 * Pure, deterministic signal aggregation hook.
 *
 * LOCKED (Phase C): Severity → orb status. Precedence: critical > warning > notice > info > unavailable.
 * critical→critical, warning→warning, notice|info→insight, unavailable|none→idle.
 * No side effects, no storage. Observer-only input for HADRA-01 orb.
 *
 * @param signals - Array of signal emitter observations
 * @returns Aggregated signal state with effective HADRA orb status
 */
export function useSignalAggregation(
  signals: SignalEmitter[]
): AggregatedSignalState {
  return useMemo(() => {
    // Filter out unavailable signals for active signal list
    const activeSignals = signals.filter(
      (s) => s.severity !== "unavailable"
    );

    // If no active signals, return idle state
    if (activeSignals.length === 0) {
      return {
        orbStatus: "idle",
        maxSeverity: "unavailable",
        activeSignals: [],
        hasSignals: false,
      };
    }

    // Find signal with highest severity
    const maxSeveritySignal = activeSignals.reduce((max, signal) => {
      const maxPriority = SEVERITY_ORDER[max.severity];
      const signalPriority = SEVERITY_ORDER[signal.severity];
      return signalPriority > maxPriority ? signal : max;
    }, activeSignals[0]);

    const maxSeverity = maxSeveritySignal.severity;

    // Map highest severity to orb status
    const orbStatus = severityToOrbStatus(maxSeverity);

    return {
      orbStatus,
      maxSeverity,
      activeSignals,
      hasSignals: true,
    };
  }, [signals]);
}
