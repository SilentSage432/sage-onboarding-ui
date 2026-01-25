"use client";

import { useMemo } from "react";
import { useAdraeRhythm } from "./useAdraeRhythm";
import { SignalEmitter } from "@/lib/signals/types";

/**
 * useAdraeSignal
 * Converts ADRAE rhythm state to SignalEmitter format for aggregation.
 *
 * Unavailable → null (no signal). Aggregation treats absence as unavailable.
 * Read-only. No side effects. Failures already mapped to unavailable in rhythm.
 */
export function useAdraeSignal(): SignalEmitter | null {
  const adraeState = useAdraeRhythm();

  return useMemo(() => {
    const severity: SignalEmitter["severity"] =
      adraeState.state === "connected"
        ? "info"
        : adraeState.state === "idle"
          ? "info"
          : "unavailable";

    if (severity === "unavailable") return null;

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
