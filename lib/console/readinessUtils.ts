import { moduleRegistry } from "./moduleRegistry";

/**
 * Readiness Utilities
 * 
 * Helper functions for checking module readiness state.
 * These are READ-ONLY checks - they do not enforce unlocking.
 */

/**
 * Determine if a module is unlocked based on its layer and unlocked capabilities list.
 * 
 * Rules:
 * - orientation layer: always unlocked (always visible)
 * - governance layer: always unlocked (always accessible)
 * - capability layer: unlocked if in unlockedCapabilities list
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
