"use client";

import { useState, useEffect } from "react";
import type { SignalEmitter } from "./types";

/**
 * useSageSignal
 * Fetches SAGE-emitted signals from /api/sage/signals.
 *
 * Returns SignalEmitter[] directly from SAGE. On failure or invalid data,
 * returns empty array. No retries, no caching, no persistence.
 */
export function useSageSignal(): SignalEmitter[] {
  const [signals, setSignals] = useState<SignalEmitter[]>([]);

  useEffect(() => {
    let cancelled = false;
    const intervalMs = 60_000;

    async function fetchSignals() {
      try {
        const response = await fetch("/api/sage/signals", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          setSignals([]);
          return;
        }

        const data = await response.json().catch(() => null);

        if (cancelled) return;

        if (!data || !Array.isArray(data)) {
          setSignals([]);
          return;
        }

        // Map response to SignalEmitter[] (assume response is already in correct shape)
        const mappedSignals: SignalEmitter[] = data
          .filter((item): item is SignalEmitter => {
            return (
              typeof item === "object" &&
              item !== null &&
              typeof item.id === "string" &&
              typeof item.source === "string" &&
              typeof item.state === "string" &&
              typeof item.severity === "string" &&
              typeof item.timestamp === "string"
            );
          })
          .map((item) => ({
            id: item.id,
            source: item.source,
            state: item.state,
            severity: item.severity,
            timestamp: item.timestamp,
            metadata: item.metadata,
          }));

        setSignals(mappedSignals);
      } catch {
        if (cancelled) return;
        setSignals([]);
      }
    }

    fetchSignals();
    const interval = setInterval(fetchSignals, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return signals;
}
