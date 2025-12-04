/**
 * HADRA Conversational Engine
 * Main unified message processor that combines:
 * - Severity grammar
 * - Persona formatting
 * - Etiquette rules
 * - Context resolution
 * 
 * This is HADRA's official voice generator.
 * All messages pass through this pipeline to ensure consistency.
 */

import { severityGrammar } from "./severityGrammar";
import { personaFormatter } from "./personaFormatter";
import { etiquetteWrapper } from "./etiquette";
import { contextResolver, type HadraEvent } from "./contextResolver";

export interface HadraMessage {
  text: string;
  severity: "info" | "anomaly" | "warning" | "critical";
  timestamp: number;
  context?: string;
  subsystem?: string;
}

/**
 * Main HADRA voice generation function
 * Processes raw events through the complete conversation pipeline
 */
export function hadraSpeak(event: HadraEvent): HadraMessage {
  // Step 1: Resolve context
  const resolved = contextResolver(event);

  // Step 2: Apply severity grammar
  let output = severityGrammar(resolved.severity, resolved.message);

  // Step 3: Apply persona formatting
  output = personaFormatter(output);

  // Step 4: Apply etiquette wrapper
  output = etiquetteWrapper(output);

  return {
    text: output,
    severity: resolved.severity,
    timestamp: Date.now(),
    context: resolved.context,
    subsystem: resolved.subsystem,
  };
}

/**
 * Batch processor for multiple events
 * Useful when processing multiple insights or events at once
 */
export function hadraSpeakBatch(events: HadraEvent[]): HadraMessage[] {
  return events.map(hadraSpeak);
}

