"use client";

import { useState, useEffect } from "react";

export type ArcStatus = {
  name: string;
  status: "active" | "inactive" | "unknown";
  lastSeen?: string;
  version?: string;
  health?: "healthy" | "degraded" | "unhealthy";
  message?: string;
};

type ArcStatusState = {
  data: ArcStatus | null;
  loading: boolean;
  error: string | null;
  unavailable: boolean;
};

/**
 * Truthful hook for fetching Arc status.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 */
export function useArcStatus(arcName: string): ArcStatusState {
  const [state, setState] = useState<ArcStatusState>({
    data: null,
    loading: true,
    error: null,
    unavailable: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/arc/${arcName}/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 404 || response.status >= 500) {
            // Backend endpoint doesn't exist or is unavailable
            setState({
              data: null,
              loading: false,
              error: null,
              unavailable: true,
            });
            return;
          }

          // Other errors
          const errorText = await response.text().catch(() => "Unknown error");
          setState({
            data: null,
            loading: false,
            error: errorText || `HTTP ${response.status}`,
            unavailable: false,
          });
          return;
        }

        const data = await response.json();

        if (cancelled) return;

        setState({
          data: {
            name: data.name || arcName,
            status: data.status || "unknown",
            lastSeen: data.lastSeen,
            version: data.version,
            health: data.health,
            message: data.message,
          },
          loading: false,
          error: null,
          unavailable: false,
        });
      } catch (err) {
        if (cancelled) return;

        // Network error or fetch failure - backend is unavailable
        setState({
          data: null,
          loading: false,
          error: null,
          unavailable: true,
        });
      }
    }

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [arcName]);

  return state;
}
