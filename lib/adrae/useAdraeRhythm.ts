"use client";

import { useState, useEffect, useRef } from "react";
import { AdraeRhythmState, AdraeInferredState, AdraeRhythmTelemetry } from "./telemetry";

/** ADRAE poll cadence (ms). Passive observation only. */
const ADRAE_POLL_CADENCE_MS = 30_000;

/**
 * useAdraeRhythm
 * Passive observer hook that polls /api/adrae/rhythm at fixed cadence.
 *
 * Cadence: ADRAE_POLL_CADENCE_MS (30s). Isolated, no retries.
 * Failures: map only to 'unavailable'. No UI side effects, no throw, no log.
 * No persistence, no retries, no inferred intent. Graceful degradation only.
 */
export function useAdraeRhythm(): AdraeRhythmState {
  const [state, setState] = useState<AdraeRhythmState>({
    state: "unavailable",
    telemetry: null,
    available: false,
    lastFetched: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRhythm() {
      try {
        const response = await fetch("/api/adrae/rhythm", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          setState({
            state: "unavailable",
            telemetry: null,
            available: false,
            lastFetched: null,
          });
          return;
        }

        const data = await response.json().catch(() => null);

        if (cancelled) return;

        if (!data) {
          setState({
            state: "unavailable",
            telemetry: null,
            available: false,
            lastFetched: null,
          });
          return;
        }

        // Infer state from telemetry
        const inferredState: AdraeInferredState = inferStateFromTelemetry(data);

        setState({
          state: inferredState,
          telemetry: data as AdraeRhythmTelemetry,
          available: true,
          lastFetched: Date.now(),
        });
      } catch {
        if (cancelled) return;
        setState({
          state: "unavailable",
          telemetry: null,
          available: false,
          lastFetched: null,
        });
      }
    }

    // Initial fetch
    fetchRhythm();

    intervalRef.current = setInterval(() => {
      if (!cancelled) fetchRhythm();
    }, ADRAE_POLL_CADENCE_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return state;
}

/**
 * Infer ADRAE state from telemetry data
 * Simple heuristic: if amplitude and phase are present, consider it connected
 */
function inferStateFromTelemetry(
  data: unknown
): AdraeInferredState {
  if (!data || typeof data !== "object") {
    return "unavailable";
  }

  const telemetry = data as Partial<AdraeRhythmTelemetry>;

  // Check if we have meaningful rhythm data
  if (
    typeof telemetry.amplitude === "number" &&
    typeof telemetry.phase === "number" &&
    telemetry.amplitude > 0
  ) {
    return "connected";
  }

  // If we have data but no meaningful rhythm, consider it idle
  if (telemetry.timestamp) {
    return "idle";
  }

  return "unavailable";
}
