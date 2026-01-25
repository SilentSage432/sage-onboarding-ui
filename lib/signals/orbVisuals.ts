// lib/signals/orbVisuals.ts
// Signal-based Orb Visual Properties
// Maps signal severity to subtle visual adjustments.
//
// LOCKED (Phase C): Severity → glowIntensity; source+state → gradient/glowColor override.
// No flashing, no escalation. Visual interpretation only.

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
 * Get orb visual properties from signal severity.
 * LOCKED: critical 1.3 | warning 1.2 | notice 1.1 | info 1.0 | unavailable 1.0.
 */
export function getOrbVisualsFromSeverity(
  severity: SignalSeverity
): OrbVisualProperties {
  switch (severity) {
    case "critical":
      return { glowIntensity: 1.3 };
    case "warning":
      return { glowIntensity: 1.2 };
    case "notice":
      return { glowIntensity: 1.1 };
    case "info":
      return { glowIntensity: 1.0 };
    case "unavailable":
    default:
      return { glowIntensity: 1.0 };
  }
}

/**
 * Get source-specific color mapping.
 * Source-specific visual overrides for aggregated signals.
 */
export function getSourceColorMapping(
  source: string,
  state: string
): Partial<OrbVisualProperties> | null {
  // Source-specific color mappings can be added here as needed
  // Example: if (source === "sage") { ... }
  return null;
}
