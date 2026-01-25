// lib/signals/orbVisuals.ts
// Signal-based Orb Visual Properties
// Maps signal severity to subtle visual adjustments

import { SignalSeverity } from "./types";

/**
 * Orb Visual Properties
 * Visual adjustments based on signal severity
 */
export type OrbVisualProperties = {
  /** Glow intensity multiplier (1.0 = normal, >1.0 = brighter) */
  glowIntensity: number;
  /** Optional color gradient override */
  gradient?: string;
  /** Optional glow color override */
  glowColor?: string;
};

/**
 * Get orb visual properties from signal severity
 * Subtle adjustments that don't escalate urgency
 * 
 * Characteristics:
 * - No flashing, no animation escalation
 * - Subtle glow intensity changes only
 * - Preserves existing color logic when no override
 */
export function getOrbVisualsFromSeverity(
  severity: SignalSeverity
): OrbVisualProperties {
  switch (severity) {
    case "critical":
      return {
        glowIntensity: 1.3, // Slightly brighter for critical
        // No color override - use existing critical styling
      };
    case "warning":
      return {
        glowIntensity: 1.2, // Subtle brightness increase
        // No color override - use existing warning styling
      };
    case "notice":
      return {
        glowIntensity: 1.1, // Very subtle increase
        // No color override
      };
    case "info":
      return {
        glowIntensity: 1.0, // Normal intensity
        // No color override
      };
    case "unavailable":
    default:
      return {
        glowIntensity: 1.0, // Normal intensity
      };
  }
}

/**
 * Get source-specific color mapping
 * Allows individual signal sources to provide color overrides
 * 
 * @param source - Signal source identifier
 * @param state - Source-specific state string
 * @returns Optional color mapping override (gradient and/or glow color)
 */
export function getSourceColorMapping(
  source: string,
  state: string
): Partial<OrbVisualProperties> | null {
  // ADRAE-specific color mapping
  if (source === "adrae") {
    if (state === "connected") {
      return {
        gradient: "bg-gradient-to-br from-indigo-400 via-cyan-500 to-indigo-600",
        glowColor: "rgba(99, 102, 241, 0.4)", // indigo glow
      };
    }
    if (state === "idle") {
      return {
        gradient: "bg-gradient-to-br from-purple-400 to-indigo-600",
        // No glow color override for idle - use default
      };
    }
  }

  // Other sources can be added here
  // SAGE, system, etc.

  return null;
}
