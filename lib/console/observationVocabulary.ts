/**
 * Observational Vocabulary System
 * 
 * This file defines the shared vocabulary for naming what the system observes.
 * It does NOT:
 * - Interpret observations
 * - Make decisions
 * - Add intelligence
 * - Create meaning
 * 
 * It ONLY:
 * - Names what exists
 * - Provides structure for querying
 * - Enables the system to describe what it remembers
 * 
 * Vocabulary precedes inference. This is naming, not judging.
 */

import type { ObservationSource } from "./observationProvenance";

/**
 * Observation Event Types
 * 
 * The types of events that can be observed and recorded.
 * These are formalized from what already exists in the system.
 */
export type ObservationEventType =
  | 'hadra_insight'
  | 'console_message';

/**
 * Observation Subsystems
 * 
 * The subsystems that can be observed.
 * These are formalized from HADRA's existing subsystem vocabulary.
 */
export type ObservationSubsystem =
  | 'mesh'
  | 'agents'
  | 'rho2'
  | 'system'
  | 'console';

/**
 * Observation Severity Levels
 * 
 * The severity levels that can be associated with observations.
 * These are formalized from HADRA's existing severity vocabulary.
 */
export type ObservationSeverity =
  | 'info'
  | 'anomaly'
  | 'warning'
  | 'critical';

/**
 * Observation Event Data Structure
 * 
 * The structured data that accompanies an observation event.
 * Uses vocabulary types instead of raw strings.
 */
export type ObservationEventData = {
  subsystem?: ObservationSubsystem;
  severity?: ObservationSeverity;
  content?: string;
  role?: string;
  [key: string]: unknown; // Allow additional fields without breaking
};

/**
 * Observation Event
 * 
 * A single observation event with vocabulary-typed fields.
 * Includes provenance (source) as first-class metadata.
 */
export type ObservationEvent = {
  id: string;
  type: ObservationEventType;
  timestamp: number;
  source: ObservationSource; // Provenance - where the observation originated
  data?: ObservationEventData;
};

/**
 * Observation Summary
 * 
 * A passive summary of observations grouped by vocabulary dimensions.
 * This is descriptive only - no interpretation or decisions.
 */
export type ObservationSummary = {
  total: number;
  byType: Record<ObservationEventType, number>;
  bySubsystem: Record<ObservationSubsystem, number>;
  bySeverity: Record<ObservationSeverity, number>;
};

/**
 * Passive Query Utilities
 * 
 * These functions organize existing observations without interpretation.
 * They are read-only, pure functions with no side effects.
 */

/**
 * Get events filtered by type
 */
export function getEventsByType(
  events: ObservationEvent[],
  type: ObservationEventType
): ObservationEvent[] {
  return events.filter((event) => event.type === type);
}

/**
 * Get events filtered by subsystem
 */
export function getEventsBySubsystem(
  events: ObservationEvent[],
  subsystem: ObservationSubsystem
): ObservationEvent[] {
  return events.filter(
    (event) => event.data?.subsystem === subsystem
  );
}

/**
 * Get events filtered by severity
 */
export function getEventsBySeverity(
  events: ObservationEvent[],
  severity: ObservationSeverity
): ObservationEvent[] {
  return events.filter(
    (event) => event.data?.severity === severity
  );
}

/**
 * Get a passive summary of observations
 * 
 * Groups observations by type, subsystem, and severity.
 * This is descriptive counting only - no interpretation.
 */
export function getObservationSummary(
  events: ObservationEvent[]
): ObservationSummary {
  const summary: ObservationSummary = {
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
  };

  // Count by type
  events.forEach((event) => {
    if (event.type in summary.byType) {
      summary.byType[event.type]++;
    }
  });

  // Count by subsystem
  events.forEach((event) => {
    const subsystem = event.data?.subsystem;
    if (subsystem && subsystem in summary.bySubsystem) {
      summary.bySubsystem[subsystem]++;
    }
  });

  // Count by severity
  events.forEach((event) => {
    const severity = event.data?.severity;
    if (severity && severity in summary.bySeverity) {
      summary.bySeverity[severity]++;
    }
  });

  return summary;
}

/**
 * Get unique subsystems that have been observed
 */
export function getObservedSubsystems(
  events: ObservationEvent[]
): ObservationSubsystem[] {
  const subsystems = new Set<ObservationSubsystem>();
  events.forEach((event) => {
    if (event.data?.subsystem) {
      subsystems.add(event.data.subsystem);
    }
  });
  return Array.from(subsystems);
}

/**
 * Get events filtered by source (provenance)
 */
export function getEventsBySource(
  events: ObservationEvent[],
  source: ObservationSource
): ObservationEvent[] {
  return events.filter((event) => event.source === source);
}

/**
 * Get unique sources that have been observed
 */
export function getObservedSources(
  events: ObservationEvent[]
): ObservationSource[] {
  const sources = new Set<ObservationSource>();
  events.forEach((event) => {
    sources.add(event.source);
  });
  return Array.from(sources);
}

/**
 * Get unique event types that have been observed
 */
export function getObservedEventTypes(
  events: ObservationEvent[]
): ObservationEventType[] {
  const types = new Set<ObservationEventType>();
  events.forEach((event) => {
    types.add(event.type);
  });
  return Array.from(types);
}
