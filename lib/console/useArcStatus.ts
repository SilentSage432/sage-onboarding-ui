"use client";

import { useTruthfulFetch } from "./useTruthfulFetch";

export type ArcStatus = {
  name: string;
  status: "active" | "inactive" | "unknown";
  lastSeen?: string;
  version?: string;
  health?: "healthy" | "degraded" | "unhealthy";
  message?: string;
  // Extended observation data for Chi panel
  namespace?: string;
  mode?: string;
  role?: string;
  // Kubernetes pod observation
  pod?: {
    name?: string;
    status?: string;
    restartCount?: number;
    nodeName?: string;
    age?: string;
    startTime?: string;
  };
  // Network posture observation
  network?: {
    ciliumPolicyPresent?: boolean;
    policyNames?: string[];
    defaultDeny?: boolean;
  };
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
      namespace: data.namespace,
      mode: data.mode,
      role: data.role,
      pod: data.pod ? {
        name: data.pod.name,
        status: data.pod.status,
        restartCount: data.pod.restartCount,
        nodeName: data.pod.nodeName,
        age: data.pod.age,
        startTime: data.pod.startTime,
      } : undefined,
      network: data.network ? {
        ciliumPolicyPresent: data.network.ciliumPolicyPresent,
        policyNames: data.network.policyNames,
        defaultDeny: data.network.defaultDeny,
      } : undefined,
    }),
  });
}
