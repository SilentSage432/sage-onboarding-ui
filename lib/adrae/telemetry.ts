// lib/adrae/telemetry.ts
// ADRAE Rhythm Telemetry Schema
// Defines the structure of ADRAE rhythm data and inferred state types

/**
 * ADRAE Rhythm Telemetry
 * Raw telemetry data from the ADRAE rhythm endpoint
 */
export type AdraeRhythmTelemetry = {
  /** Timestamp of the rhythm reading */
  timestamp: string;
  /** Rhythm phase (0-1 normalized) */
  phase: number;
  /** Rhythm amplitude (0-1 normalized) */
  amplitude: number;
  /** Rhythm frequency (Hz) */
  frequency: number;
  /** Optional metadata */
  metadata?: {
    source?: string;
    confidence?: number;
    [key: string]: unknown;
  };
};

/**
 * ADRAE Inferred State
 * Derived state from rhythm telemetry analysis
 */
export type AdraeInferredState =
  | "idle"           // No significant rhythm detected
  | "connected"      // Rhythm detected and stable
  | "unavailable";   // Endpoint unavailable or no data

/**
 * ADRAE Rhythm State
 * Complete state object returned by the hook
 */
export type AdraeRhythmState = {
  /** Current inferred state */
  state: AdraeInferredState;
  /** Raw telemetry data (null if unavailable) */
  telemetry: AdraeRhythmTelemetry | null;
  /** Whether the endpoint is available */
  available: boolean;
  /** Last successful fetch timestamp */
  lastFetched: number | null;
};
