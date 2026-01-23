"use client";

import { useTruthfulFetch } from "./useTruthfulFetch";

export type ArcStatus = {
  name: string;
  status: "active" | "inactive" | "unknown";
  lastSeen?: string;
  version?: string;
  health?: "healthy" | "degraded" | "unhealthy";
  message?: string;
};

/**
 * Truthful hook for fetching Arc status.
 * Returns explicit unavailable state if backend is not connected.
 * Never returns mock or fake data.
 * Uses shared truthful fetch utility for standardized semantics.
 */
export function useArcStatus(arcName: string) {
  return useTruthfulFetch<ArcStatus>(`/api/arc/${arcName}/status`, {
    transform: (data: any) => ({
      name: data.name || arcName,
      status: data.status || "unknown",
      lastSeen: data.lastSeen,
      version: data.version,
      health: data.health,
      message: data.message,
    }),
  });
}
