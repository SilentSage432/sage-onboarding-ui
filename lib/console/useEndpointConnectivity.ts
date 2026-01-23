"use client";

import { create } from "zustand";

/**
 * Endpoint Connectivity Store
 * 
 * Session-only awareness of API endpoint availability.
 * This is passive observation infrastructure - no authority, no persistence, no behavior change.
 * Tracks which endpoints have been tested and their availability state.
 */

export type EndpointAvailability = {
  endpoint: string;
  available: boolean;
  lastChecked: number;
  lastError?: string;
};

type EndpointConnectivityState = {
  /**
   * Map of endpoint paths to their availability observations.
   * Session-only - cleared on page refresh.
   */
  endpointAvailability: Map<string, EndpointAvailability>;
  
  /**
   * Observe endpoint availability (passive recording only).
   * Records connectivity state for system awareness.
   * Does not affect behavior or functionality.
   */
  observeEndpointAvailability: (
    endpoint: string,
    available: boolean,
    error?: string
  ) => void;
  
  /**
   * Get observed availability for an endpoint.
   * Returns undefined if endpoint has not been observed yet.
   */
  getEndpointAvailability: (endpoint: string) => EndpointAvailability | undefined;
  
  /**
   * Clear all observations (for testing/development).
   */
  clear: () => void;
};

export const useEndpointConnectivity = create<EndpointConnectivityState>((set, get) => ({
  endpointAvailability: new Map(),
  
  observeEndpointAvailability: (endpoint: string, available: boolean, error?: string) => {
    set((state) => {
      const newMap = new Map(state.endpointAvailability);
      newMap.set(endpoint, {
        endpoint,
        available,
        lastChecked: Date.now(),
        lastError: error,
      });
      return { endpointAvailability: newMap };
    });
  },
  
  getEndpointAvailability: (endpoint: string) => {
    return get().endpointAvailability.get(endpoint);
  },
  
  clear: () => {
    set({ endpointAvailability: new Map() });
  },
}));
