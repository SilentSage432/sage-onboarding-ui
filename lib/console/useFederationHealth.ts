"use client";

import { useTruthfulFetch } from "./useTruthfulFetch";

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

/**
 * Truthful hook for fetching Federation health matrix data.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 * Uses shared truthful fetch utility for standardized semantics.
 */
export function useFederationHealthMatrix() {
  return useTruthfulFetch<FederationHealthData>(`/api/federation/health/matrix`, {
    transform: (data: any) => ({
      overall: data.overall || "unknown",
      metrics: data.metrics || [],
      lastUpdated: data.lastUpdated,
      nodeCount: data.nodeCount,
      activeNodes: data.activeNodes,
      message: data.message,
    }),
  });
}

/**
 * Truthful hook for fetching Federation health core (detailed) data.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 * Uses shared truthful fetch utility for standardized semantics.
 */
export function useFederationHealthCore() {
  return useTruthfulFetch<FederationHealthData>(`/api/federation/health/core`, {
    transform: (data: any) => ({
      overall: data.overall || "unknown",
      metrics: data.metrics || [],
      lastUpdated: data.lastUpdated,
      nodeCount: data.nodeCount,
      activeNodes: data.activeNodes,
      message: data.message,
    }),
  });
}

/**
 * Truthful hook for fetching Federation state data.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 * Uses shared truthful fetch utility for standardized semantics.
 */
export function useFederationState() {
  return useTruthfulFetch<FederationStateData>(`/api/federation/state`, {
    transform: (data: any) => ({
      state: data.state || "unknown",
      phase: data.phase,
      nodes: data.nodes,
      lastUpdated: data.lastUpdated,
      message: data.message,
    }),
  });
}
