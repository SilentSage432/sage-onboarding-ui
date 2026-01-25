"use client";

import { useState, useEffect, useRef } from "react";
import { AdraeRhythmState, AdraeInferredState, AdraeRhythmTelemetry } from "./telemetry";

/**
 * useAdraeRhythm
 * Passive observer hook that polls /api/adrae/rhythm every 30 seconds.
 * 
 * Characteristics:
 * - Polls every 30 seconds (passive observation)
 * - Handles absence gracefully (idle / connected / unavailable)
 * - No retries or urgency - graceful degradation
 * - Assumes endpoint may not exist yet (no errors)
 * - Pure observation, no side effects
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
          // Endpoint doesn't exist or unavailable - graceful degradation
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
      } catch (err) {
        if (cancelled) return;

        // Network error or fetch failure - graceful degradation
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

    // Poll every 30 seconds
    intervalRef.current = setInterval(() => {
      if (!cancelled) {
        fetchRhythm();
      }
    }, 30000);

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
