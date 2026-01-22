import { moduleRegistry } from "./moduleRegistry";
import { SystemPerspective } from "@/app/(os)/console/store/useReadinessStore";

/**
 * Readiness Utilities
 * 
 * Helper functions for checking module readiness state.
 * These are READ-ONLY checks - they do not enforce unlocking.
 */

/**
 * Determine if a module is visible to the current system perspective.
 * This checks existence, not readiness. If a module is not visible,
 * it should not appear in the UI at all (not locked, just nonexistent).
 * 
 * @param module - The module definition to check
 * @param perspective - Current system perspective
 * @returns true if the module exists for this perspective, false otherwise
 */
export function isModuleVisibleToPerspective(
  module: typeof moduleRegistry[0],
  perspective: SystemPerspective
): boolean {
  // If no visibleTo restriction, module is visible to all perspectives
  if (!module.visibleTo || module.visibleTo.length === 0) {
    return true;
  }
  // Check if current perspective is in the allowed list
  return module.visibleTo.includes(perspective);
}

/**
 * Determine if a module is unlocked based on its layer and unlocked capabilities list.
 * 
 * Rules:
 * - orientation layer: always unlocked (always visible)
 * - governance layer: always unlocked (always accessible)
 * - capability layer: unlocked if in unlockedCapabilities list
 * 
 * Note: This function assumes the module is already visible to the perspective.
 * Call isModuleVisibleToPerspective() first to check existence.
 * 
 * @param module - The module definition to check
 * @param unlockedCapabilities - List of unlocked capability slugs
 * @returns true if the module is unlocked, false otherwise
 */
export function isModuleUnlocked(
  module: typeof moduleRegistry[0],
  unlockedCapabilities: string[]
): boolean {
  if (module.layer === 'orientation' || module.layer === 'governance') {
    return true;
  }
  if (module.layer === 'capability') {
    return unlockedCapabilities.includes(module.slug);
  }
  // Default: assume locked if not explicitly unlocked
  return false;
}
