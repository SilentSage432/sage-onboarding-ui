/**
 * HADRA Event Bus
 * Central event system for HADRA-01 communication
 * 
 * Handles:
 * - Insight events
 * - Status changes
 * - Action requests
 * - Console messages
 */

import type { HadraInsight, HadraStatus, HadraActionRequest, HadraConsoleMessage } from "@/types/hadra";

type EventMap = {
  insight: (payload: HadraInsight) => void;
  status: (payload: HadraStatus) => void;
  actionRequest: (payload: HadraActionRequest) => void;
  consoleMessage: (payload: HadraConsoleMessage) => void;
};

class HadraEventBus {
  private listeners: Map<keyof EventMap, Set<Function>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: EventMap[K]): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  emit<K extends keyof EventMap>(event: K, payload: Parameters<EventMap[K]>[0]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in HADRA event handler for ${event}:`, error);
        }
      });
    }
  }

  off<K extends keyof EventMap>(event: K, handler: EventMap[K]): void {
    this.listeners.get(event)?.delete(handler);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const hadraBus = new HadraEventBus();

