"use client";

import { useMemo } from "react";
import { useAdraeRhythm } from "./useAdraeRhythm";
import { SignalEmitter } from "@/lib/signals/types";

/**
 * useAdraeSignal
 * Converts ADRAE rhythm state to SignalEmitter format
 * 
 * This hook wraps useAdraeRhythm and transforms its output
 * into the generic SignalEmitter interface for aggregation.
 * 
 * Characteristics:
 * - Read-only observation
 * - Graceful degradation (returns unavailable signal if ADRAE is down)
 * - No side effects
 */
export function useAdraeSignal(): SignalEmitter | null {
  const adraeState = useAdraeRhythm();

  return useMemo(() => {
    // Map ADRAE inferred state to signal severity
    const severity: SignalEmitter["severity"] =
      adraeState.state === "connected"
        ? "info" // ADRAE rhythm active - informational
        : adraeState.state === "idle"
        ? "info" // ADRAE present but idle - informational
        : "unavailable"; // ADRAE unavailable

    // Only emit signal if ADRAE is available
    if (severity === "unavailable") {
      return null;
    }

    return {
      id: `adrae-${adraeState.lastFetched || Date.now()}`,
      source: "adrae",
      state: adraeState.state,
      severity,
      timestamp: adraeState.telemetry?.timestamp || new Date().toISOString(),
      metadata: adraeState.telemetry?.metadata,
    };
  }, [
    adraeState.state,
    adraeState.available,
    adraeState.lastFetched,
    adraeState.telemetry,
  ]);
}
