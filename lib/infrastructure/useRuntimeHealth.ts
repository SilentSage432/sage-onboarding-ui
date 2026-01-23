"use client";

import { create } from "zustand";

/**
 * Runtime Health Observation Store
 * 
 * Session-only observation of service health and readiness state.
 * This is passive observation infrastructure - no authority, no persistence, no behavior change.
 * Tracks the last observed health/readiness status from /api/health and /api/ready endpoints.
 * 
 * Session-only: All state is cleared on page refresh.
 * Observation only: Does not affect application behavior or functionality.
 */

export type HealthStatus = "ok" | "unknown";
export type ReadinessStatus = "ready" | "not_ready" | "unknown";

export type RuntimeHealthState = {
  /**
   * Timestamp of last health check (liveness probe).
   * null if health has never been checked.
   */
  lastHealthCheckAt: number | null;
  
  /**
   * Timestamp of last readiness check.
   * null if readiness has never been checked.
   */
  lastReadyCheckAt: number | null;
  
  /**
   * Current health status from /api/health.
   * "ok" if last check returned 200, "unknown" if never checked or check failed.
   */
  healthStatus: HealthStatus;
  
  /**
   * Current readiness status from /api/ready.
   * "ready" if last check returned 200, "not_ready" if 503, "unknown" if never checked or check failed.
   */
  readinessStatus: ReadinessStatus;
  
  /**
   * Last error message from health/readiness checks (sanitized, optional).
   * Only set if a check failed. Does not expose credentials or sensitive data.
   */
  lastError?: string;
  
  /**
   * Observe health check result (passive recording only).
   * Records the health status from /api/health endpoint.
   * Does not affect behavior or functionality.
   */
  observeHealthCheck: (status: HealthStatus, error?: string) => void;
  
  /**
   * Observe readiness check result (passive recording only).
   * Records the readiness status from /api/ready endpoint.
   * Does not affect behavior or functionality.
   */
  observeReadyCheck: (status: ReadinessStatus, error?: string) => void;
  
  /**
   * Clear all observations (for testing/development).
   */
  clear: () => void;
};

const initialState = {
  lastHealthCheckAt: null,
  lastReadyCheckAt: null,
  healthStatus: "unknown" as HealthStatus,
  readinessStatus: "unknown" as ReadinessStatus,
  lastError: undefined,
};

export const useRuntimeHealth = create<RuntimeHealthState>((set) => ({
  ...initialState,
  
  observeHealthCheck: (status: HealthStatus, error?: string) => {
    set({
      lastHealthCheckAt: Date.now(),
      healthStatus: status,
      lastError: error,
    });
  },
  
  observeReadyCheck: (status: ReadinessStatus, error?: string) => {
    set({
      lastReadyCheckAt: Date.now(),
      readinessStatus: status,
      lastError: error,
    });
  },
  
  clear: () => {
    set(initialState);
  },
}));

/**
 * Observe runtime health and readiness.
 * 
 * Performs a single observation cycle:
 * - GET /api/health (liveness check)
 * - GET /api/ready (readiness check)
 * 
 * Updates the runtime health store based on responses.
 * 
 * This function is passive and side-effect minimal:
 * - No retries
 * - No polling
 * - No timers
 * - Must be manually invoked
 * - Errors are captured but not thrown
 * - No console logs
 * 
 * @returns Promise that resolves when observation is complete (or failed silently)
 */
export async function observeRuntimeHealth(): Promise<void> {
  const { observeHealthCheck, observeReadyCheck } = useRuntimeHealth.getState();
  
  // Observe health (liveness)
  try {
    const healthResponse = await fetch("/api/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (healthResponse.ok) {
      observeHealthCheck("ok");
    } else {
      observeHealthCheck("unknown", `Health check returned ${healthResponse.status}`);
    }
  } catch (error) {
    // Capture error but don't throw - passive observation only
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown health check error";
    observeHealthCheck("unknown", errorMessage);
  }
  
  // Observe readiness
  try {
    const readyResponse = await fetch("/api/ready", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (readyResponse.ok) {
      observeReadyCheck("ready");
    } else if (readyResponse.status === 503) {
      // Try to get error details from response body
      try {
        const data = await readyResponse.json();
        const errorMsg = data.checks 
          ? `Readiness check failed: ${JSON.stringify(data.checks)}`
          : "Readiness check returned 503";
        observeReadyCheck("not_ready", errorMsg);
      } catch {
        observeReadyCheck("not_ready", "Readiness check returned 503");
      }
    } else {
      observeReadyCheck("unknown", `Readiness check returned ${readyResponse.status}`);
    }
  } catch (error) {
    // Capture error but don't throw - passive observation only
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown readiness check error";
    observeReadyCheck("unknown", errorMessage);
  }
}
