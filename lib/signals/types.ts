// lib/signals/types.ts
// Generic Signal Emitter Interface
// Defines the structure for passive signal observations from various sources

/**
 * Signal Severity
 * Standardized severity levels for signal prioritization
 */
export type SignalSeverity =
  | "info"         // Informational, lowest priority
  | "notice"       // Noticeable but non-urgent
  | "warning"      // Requires attention
  | "critical"     // Highest priority, urgent
  | "unavailable"; // Signal source unavailable

/**
 * Signal Emitter
 * Generic interface for passive signal observations
 * 
 * All signal sources (ADRAE, SAGE, system, etc.) emit signals
 * conforming to this interface for unified aggregation.
 */
export interface SignalEmitter {
  /** Unique identifier for this signal instance */
  id: string;
  /** Source identifier (e.g., "adrae", "sage", "system") */
  source: string;
  /** Source-specific state string */
  state: string;
  /** Standardized severity level */
  severity: SignalSeverity;
  /** ISO timestamp of the signal */
  timestamp: string;
  /** Optional opaque metadata */
  metadata?: Record<string, unknown>;
}
