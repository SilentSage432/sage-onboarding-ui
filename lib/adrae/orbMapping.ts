// lib/adrae/orbMapping.ts
// ADRAE → HADRA-01 Orb Mapping
// Pure function mapping ADRAE inferred states to HADRA-01 orb visual properties

import { AdraeInferredState } from "./telemetry";
import { OrbStatus } from "@/lib/hadra/orbPulse";

/**
 * Orb Color Mapping
 * Maps ADRAE state to orb color (CSS gradient classes)
 */
export type OrbColorMapping = {
  /** Gradient classes for the orb core */
  gradient: string;
  /** Optional glow color override */
  glowColor?: string;
};

/**
 * Map ADRAE inferred state to HADRA-01 orb status
 * 
 * When ADRAE is unavailable, returns null (orb uses default state)
 * When ADRAE is available, returns the corresponding OrbStatus
 */
export function mapAdraeStateToOrbStatus(
  adraeState: AdraeInferredState
): OrbStatus | null {
  switch (adraeState) {
    case "connected":
      return "insight"; // ADRAE rhythm detected - show as insight
    case "idle":
      return "idle"; // ADRAE present but no rhythm - neutral idle
    case "unavailable":
      return null; // ADRAE unavailable - don't override orb state
    default:
      return null;
  }
}

/**
 * Map ADRAE inferred state to orb color properties
 * Returns color mapping for visual feedback
 */
export function mapAdraeStateToOrbColor(
  adraeState: AdraeInferredState
): OrbColorMapping | null {
  switch (adraeState) {
    case "connected":
      // ADRAE rhythm active - subtle indigo/cyan gradient
      return {
        gradient: "bg-gradient-to-br from-indigo-400 via-cyan-500 to-indigo-600",
        glowColor: "rgba(99, 102, 241, 0.4)", // indigo glow
      };
    case "idle":
      // ADRAE present but idle - neutral purple
      return {
        gradient: "bg-gradient-to-br from-purple-400 to-indigo-600",
        glowColor: undefined, // use default
      };
    case "unavailable":
      // ADRAE unavailable - no override
      return null;
    default:
      return null;
  }
}

/**
 * Get glow intensity multiplier based on ADRAE state
 * Returns a multiplier (0-1) for glow intensity adjustment
 */
export function getAdraeGlowIntensity(
  adraeState: AdraeInferredState
): number {
  switch (adraeState) {
    case "connected":
      return 1.2; // Slightly brighter when ADRAE rhythm is active
    case "idle":
      return 1.0; // Normal intensity
    case "unavailable":
      return 1.0; // No change when unavailable
    default:
      return 1.0;
  }
}
