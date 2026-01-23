"use client";

import { useState, useEffect } from "react";
import { useEndpointConnectivity } from "./useEndpointConnectivity";

/**
 * Standardized state returned by truthful fetch hooks.
 */
export type TruthfulFetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  unavailable: boolean;
};

/**
 * Truthful fetch utility with standardized semantics.
 * 
 * Characteristics:
 * - No retries (single attempt per mount)
 * - No cache (always fetches fresh)
 * - Truthful error handling (explicit unavailable state)
 * - Observes endpoint connectivity (passive awareness)
 * - Never returns mock or fake data
 * 
 * @param endpoint - API endpoint path (e.g., '/api/arc/theta/status')
 * @param options - Optional fetch options
 * @returns Standardized fetch state
 */
export function useTruthfulFetch<T = any>(
  endpoint: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    transform?: (data: any) => T;
  }
): TruthfulFetchState<T> {
  const { observeEndpointAvailability } = useEndpointConnectivity();
  const [state, setState] = useState<TruthfulFetchState<T>>({
    data: null,
    loading: true,
    error: null,
    unavailable: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(endpoint, {
          method: options?.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...options?.headers,
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 404 || response.status >= 500) {
            // Backend endpoint doesn't exist or is unavailable
            const errorText = await response.text().catch(() => "Unknown error");
            observeEndpointAvailability(endpoint, false, errorText);
            setState({
              data: null,
              loading: false,
              error: null,
              unavailable: true,
            });
            return;
          }

          // Other HTTP errors (4xx except 404)
          const errorText = await response.text().catch(() => "Unknown error");
          observeEndpointAvailability(endpoint, false, errorText);
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

        // Transform data if transform function provided
        const transformedData = options?.transform ? options.transform(data) : data;

        // Record successful connectivity
        observeEndpointAvailability(endpoint, true);

        setState({
          data: transformedData,
          loading: false,
          error: null,
          unavailable: false,
        });
      } catch (err) {
        if (cancelled) return;

        // Network error or fetch failure - backend is unavailable
        const errorMessage = err instanceof Error ? err.message : "Network error";
        observeEndpointAvailability(endpoint, false, errorMessage);
        setState({
          data: null,
          loading: false,
          error: null,
          unavailable: true,
        });
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [endpoint, observeEndpointAvailability]);

  return state;
}
