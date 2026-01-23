/**
 * Multi-Dimensional Query Composition System
 * 
 * This file provides passive query composition utilities that allow filtering
 * observations by multiple dimensions simultaneously.
 * 
 * It does NOT:
 * - Interpret query results
 * - Make decisions based on queries
 * - Add intelligence or reasoning
 * - Prioritize or rank results
 * 
 * It ONLY:
 * - Composes filters across dimensions (vocabulary + temporal + provenance)
 * - Enables multi-dimensional queries
 * - Provides structural query composition, not semantic analysis
 * 
 * Query composition precedes pattern recognition. This is structure, not intelligence.
 */

import type { ObservationEvent } from "./observationVocabulary";
import type {
  ObservationEventType,
  ObservationSubsystem,
  ObservationSeverity,
} from "./observationVocabulary";
import type { ObservationSource } from "./observationProvenance";
import type { TemporalWindow, TimeRange } from "./temporalFraming";
import {
  getEventsInWindow,
  getEventsSince,
  getEventsInRange,
} from "./temporalFraming";

/**
 * Multi-Dimensional Query Filters
 * 
 * Optional filters for each dimension. All filters are AND-ed together.
 * If a filter is not specified, that dimension is not filtered.
 */
export type ObservationFilters = {
  // Vocabulary filters
  type?: ObservationEventType;
  subsystem?: ObservationSubsystem;
  severity?: ObservationSeverity;
  
  // Provenance filters
  source?: ObservationSource;
  
  // Temporal filters (mutually exclusive - only one can be specified)
  window?: TemporalWindow;
  since?: number; // timestamp
  range?: TimeRange;
  sessionStartTime?: number; // for 'session' window
};

/**
 * Get events filtered by multiple dimensions
 * 
 * Composes filters across vocabulary, provenance, and temporal dimensions.
 * All specified filters are AND-ed together (must match all).
 * 
 * This is pure filtering - no interpretation or ranking.
 * 
 * @param events - Array of observation events
 * @param filters - Multi-dimensional filter criteria
 * @returns Filtered events matching all specified criteria
 */
export function getEventsByDimensions(
  events: ObservationEvent[],
  filters: ObservationFilters
): ObservationEvent[] {
  let result = events;

  // Apply vocabulary filters
  if (filters.type !== undefined) {
    result = result.filter((event) => event.type === filters.type);
  }

  if (filters.subsystem !== undefined) {
    result = result.filter(
      (event) => event.data?.subsystem === filters.subsystem
    );
  }

  if (filters.severity !== undefined) {
    result = result.filter(
      (event) => event.data?.severity === filters.severity
    );
  }

  // Apply provenance filter
  if (filters.source !== undefined) {
    result = result.filter((event) => event.source === filters.source);
  }

  // Apply temporal filter (only one can be active)
  if (filters.window !== undefined) {
    result = getEventsInWindow(
      result,
      filters.window,
      filters.sessionStartTime
    );
  } else if (filters.since !== undefined) {
    result = getEventsSince(result, filters.since);
  } else if (filters.range !== undefined) {
    result = getEventsInRange(result, filters.range);
  }

  return result;
}

/**
 * Get events filtered by type and subsystem (vocabulary composition)
 * 
 * @param events - Array of observation events
 * @param type - Event type filter
 * @param subsystem - Subsystem filter
 * @returns Events matching both type and subsystem
 */
export function getEventsByTypeAndSubsystem(
  events: ObservationEvent[],
  type: ObservationEventType,
  subsystem: ObservationSubsystem
): ObservationEvent[] {
  return getEventsByDimensions(events, { type, subsystem });
}

/**
 * Get events filtered by source and temporal window (provenance + temporal composition)
 * 
 * @param events - Array of observation events
 * @param source - Source filter
 * @param window - Temporal window filter
 * @param sessionStartTime - Optional session start time for 'session' window
 * @returns Events matching source and temporal window
 */
export function getEventsBySourceAndWindow(
  events: ObservationEvent[],
  source: ObservationSource,
  window: TemporalWindow,
  sessionStartTime?: number
): ObservationEvent[] {
  return getEventsByDimensions(events, { source, window, sessionStartTime });
}

/**
 * Get events filtered by type, subsystem, and temporal window
 * (vocabulary + temporal composition)
 * 
 * @param events - Array of observation events
 * @param type - Event type filter
 * @param subsystem - Subsystem filter
 * @param window - Temporal window filter
 * @param sessionStartTime - Optional session start time for 'session' window
 * @returns Events matching type, subsystem, and temporal window
 */
export function getEventsByTypeSubsystemAndWindow(
  events: ObservationEvent[],
  type: ObservationEventType,
  subsystem: ObservationSubsystem,
  window: TemporalWindow,
  sessionStartTime?: number
): ObservationEvent[] {
  return getEventsByDimensions(events, {
    type,
    subsystem,
    window,
    sessionStartTime,
  });
}

/**
 * Compose multiple filter functions
 * 
 * Takes an array of filter functions and composes them sequentially.
 * Each filter further narrows the result set.
 * 
 * This is pure function composition - no interpretation.
 * 
 * @param events - Array of observation events
 * @param filters - Array of filter functions to apply sequentially
 * @returns Events that pass all filters
 */
export function composeFilters(
  events: ObservationEvent[],
  filters: Array<(events: ObservationEvent[]) => ObservationEvent[]>
): ObservationEvent[] {
  return filters.reduce((result, filter) => filter(result), events);
}

/**
 * Complete Observation Summary
 * 
 * A comprehensive summary including all dimensions:
 * - Vocabulary (type, subsystem, severity)
 * - Provenance (source)
 * - Temporal (optional - can be computed separately)
 * 
 * This is descriptive counting only - no interpretation.
 */
export type CompleteObservationSummary = {
  total: number;
  byType: Record<ObservationEventType, number>;
  bySubsystem: Record<ObservationSubsystem, number>;
  bySeverity: Record<ObservationSeverity, number>;
  bySource: Record<ObservationSource, number>;
};

/**
 * Get a complete multi-dimensional summary
 * 
 * Groups observations by all dimensions simultaneously.
 * This is descriptive counting only - no interpretation or ranking.
 * 
 * @param events - Array of observation events
 * @returns Complete summary with counts for all dimensions
 */
export function getMultiDimensionalSummary(
  events: ObservationEvent[]
): CompleteObservationSummary {
  const summary: CompleteObservationSummary = {
    total: events.length,
    byType: {
      hadra_insight: 0,
      console_message: 0,
    },
    bySubsystem: {
      mesh: 0,
      agents: 0,
      rho2: 0,
      system: 0,
      console: 0,
    },
    bySeverity: {
      info: 0,
      anomaly: 0,
      warning: 0,
      critical: 0,
    },
    bySource: {
      hadra: 0,
      ui: 0,
      console: 0,
      system: 0,
      mesh: 0,
      agent: 0,
      unknown: 0,
    },
  };

  // Count by all dimensions
  events.forEach((event) => {
    // Count by type
    if (event.type in summary.byType) {
      summary.byType[event.type]++;
    }

    // Count by subsystem
    const subsystem = event.data?.subsystem;
    if (subsystem && subsystem in summary.bySubsystem) {
      summary.bySubsystem[subsystem]++;
    }

    // Count by severity
    const severity = event.data?.severity;
    if (severity && severity in summary.bySeverity) {
      summary.bySeverity[severity]++;
    }

    // Count by source
    if (event.source in summary.bySource) {
      summary.bySource[event.source]++;
    }
  });

  return summary;
}
