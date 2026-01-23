"use client";

import { useState, useEffect } from "react";

export type FederationHealthMetric = {
  name: string;
  value: number | string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  unit?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
};

export type FederationHealthData = {
  overall: "healthy" | "degraded" | "unhealthy" | "unknown";
  metrics: FederationHealthMetric[];
  lastUpdated?: string;
  nodeCount?: number;
  activeNodes?: number;
  message?: string;
};

export type FederationStateData = {
  state: string;
  phase?: string;
  nodes?: Array<{
    id: string;
    name: string;
    status: string;
    role?: string;
  }>;
  lastUpdated?: string;
  message?: string;
};

type FederationHealthState = {
  data: FederationHealthData | null;
  loading: boolean;
  error: string | null;
  unavailable: boolean;
};

type FederationStateState = {
  data: FederationStateData | null;
  loading: boolean;
  error: string | null;
  unavailable: boolean;
};

/**
 * Truthful hook for fetching Federation health matrix data.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 */
export function useFederationHealthMatrix(): FederationHealthState {
  const [state, setState] = useState<FederationHealthState>({
    data: null,
    loading: true,
    error: null,
    unavailable: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchHealth() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/federation/health/matrix`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 404 || response.status >= 500) {
            setState({
              data: null,
              loading: false,
              error: null,
              unavailable: true,
            });
            return;
          }

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
            overall: data.overall || "unknown",
            metrics: data.metrics || [],
            lastUpdated: data.lastUpdated,
            nodeCount: data.nodeCount,
            activeNodes: data.activeNodes,
            message: data.message,
          },
          loading: false,
          error: null,
          unavailable: false,
        });
      } catch (err) {
        if (cancelled) return;

        setState({
          data: null,
          loading: false,
          error: null,
          unavailable: true,
        });
      }
    }

    fetchHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Truthful hook for fetching Federation health core (detailed) data.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 */
export function useFederationHealthCore(): FederationHealthState {
  const [state, setState] = useState<FederationHealthState>({
    data: null,
    loading: true,
    error: null,
    unavailable: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchHealth() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/federation/health/core`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 404 || response.status >= 500) {
            setState({
              data: null,
              loading: false,
              error: null,
              unavailable: true,
            });
            return;
          }

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
            overall: data.overall || "unknown",
            metrics: data.metrics || [],
            lastUpdated: data.lastUpdated,
            nodeCount: data.nodeCount,
            activeNodes: data.activeNodes,
            message: data.message,
          },
          loading: false,
          error: null,
          unavailable: false,
        });
      } catch (err) {
        if (cancelled) return;

        setState({
          data: null,
          loading: false,
          error: null,
          unavailable: true,
        });
      }
    }

    fetchHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Truthful hook for fetching Federation state data.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 */
export function useFederationState(): FederationStateState {
  const [state, setState] = useState<FederationStateState>({
    data: null,
    loading: true,
    error: null,
    unavailable: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchState() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(`/api/federation/state`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 404 || response.status >= 500) {
            setState({
              data: null,
              loading: false,
              error: null,
              unavailable: true,
            });
            return;
          }

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
            state: data.state || "unknown",
            phase: data.phase,
            nodes: data.nodes,
            lastUpdated: data.lastUpdated,
            message: data.message,
          },
          loading: false,
          error: null,
          unavailable: false,
        });
      } catch (err) {
        if (cancelled) return;

        setState({
          data: null,
          loading: false,
          error: null,
          unavailable: true,
        });
      }
    }

    fetchState();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
