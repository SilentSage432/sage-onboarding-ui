/**
 * Observation Aggregation System
 * 
 * This file provides structural grouping utilities for organizing observations
 * into collections based on shared characteristics.
 * 
 * It does NOT:
 * - Interpret groups or collections
 * - Rank or prioritize groups
 * - Detect patterns in groups
 * - Make decisions based on groups
 * - Add intelligence or reasoning
 * 
 * It ONLY:
 * - Groups events by shared characteristics (vocabulary, provenance, temporal)
 * - Creates structural collections without interpretation
 * - Organizes observations into named groups
 * - Enables structural understanding of accumulated observations
 * 
 * Aggregation precedes pattern recognition. This is organization, not intelligence.
 */

import type { ObservationEvent } from "./observationVocabulary";
import type {
  ObservationEventType,
  ObservationSubsystem,
  ObservationSeverity,
} from "./observationVocabulary";
import type { ObservationSource } from "./observationProvenance";
import type { TemporalWindow } from "./temporalFraming";
import { getEventsInWindow } from "./temporalFraming";

/**
 * Observation Group
 * 
 * A structural collection of events that share a common characteristic.
 * This is descriptive organization only - no interpretation or ranking.
 */
export type ObservationGroup = {
  /**
   * The characteristic that defines this group.
   * This is a label only - no semantics attached.
   */
  key: string;
  
  /**
   * The events that belong to this group.
   * Ordered by timestamp (oldest first) unless otherwise specified.
   */
  events: ObservationEvent[];
  
  /**
   * Count of events in this group.
   * Derived from events.length - no calculation needed.
   */
  count: number;
  
  /**
   * Optional metadata about the grouping dimension.
   * This is descriptive only - no interpretation.
   */
  dimension?: 'vocabulary' | 'provenance' | 'temporal' | 'composite';
};

/**
 * Observation Groups Collection
 * 
 * A collection of groups organized by a common dimension.
 * This is structural organization only - no interpretation.
 */
export type ObservationGroups = {
  /**
   * The dimension by which events are grouped.
   */
  dimension: 'vocabulary' | 'provenance' | 'temporal' | 'composite';
  
  /**
   * The groups within this collection.
   * Each group contains events sharing a common characteristic.
   */
  groups: ObservationGroup[];
  
  /**
   * Total number of events across all groups.
   * Derived from sum of group counts - no calculation needed.
   */
  totalEvents: number;
  
  /**
   * Total number of groups.
   * Derived from groups.length - no calculation needed.
   */
  totalGroups: number;
};

/**
 * Group events by type (vocabulary dimension)
 * 
 * Creates groups where each group contains events of the same type.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @returns Groups organized by event type
 */
export function groupEventsByType(
  events: ObservationEvent[]
): ObservationGroups {
  const groupsByType = new Map<ObservationEventType, ObservationEvent[]>();

  // Group events by type
  events.forEach((event) => {
    const existing = groupsByType.get(event.type) || [];
    groupsByType.set(event.type, [...existing, event]);
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsByType.entries()).map(
    ([type, groupEvents]) => ({
      key: type,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'vocabulary',
    })
  );

  return {
    dimension: 'vocabulary',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Group events by subsystem (vocabulary dimension)
 * 
 * Creates groups where each group contains events from the same subsystem.
 * Events without a subsystem are grouped under 'unknown'.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @returns Groups organized by subsystem
 */
export function groupEventsBySubsystem(
  events: ObservationEvent[]
): ObservationGroups {
  const groupsBySubsystem = new Map<ObservationSubsystem | 'unknown', ObservationEvent[]>();

  // Group events by subsystem
  events.forEach((event) => {
    const subsystem = event.data?.subsystem || 'unknown';
    const existing = groupsBySubsystem.get(subsystem) || [];
    groupsBySubsystem.set(subsystem, [...existing, event]);
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsBySubsystem.entries()).map(
    ([subsystem, groupEvents]) => ({
      key: subsystem,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'vocabulary',
    })
  );

  return {
    dimension: 'vocabulary',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Group events by severity (vocabulary dimension)
 * 
 * Creates groups where each group contains events of the same severity.
 * Events without a severity are grouped under 'unknown'.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @returns Groups organized by severity
 */
export function groupEventsBySeverity(
  events: ObservationEvent[]
): ObservationGroups {
  const groupsBySeverity = new Map<ObservationSeverity | 'unknown', ObservationEvent[]>();

  // Group events by severity
  events.forEach((event) => {
    const severity = event.data?.severity || 'unknown';
    const existing = groupsBySeverity.get(severity) || [];
    groupsBySeverity.set(severity, [...existing, event]);
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsBySeverity.entries()).map(
    ([severity, groupEvents]) => ({
      key: severity,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'vocabulary',
    })
  );

  return {
    dimension: 'vocabulary',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Group events by source (provenance dimension)
 * 
 * Creates groups where each group contains events from the same source.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @returns Groups organized by source
 */
export function groupEventsBySource(
  events: ObservationEvent[]
): ObservationGroups {
  const groupsBySource = new Map<ObservationSource, ObservationEvent[]>();

  // Group events by source
  events.forEach((event) => {
    const existing = groupsBySource.get(event.source) || [];
    groupsBySource.set(event.source, [...existing, event]);
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsBySource.entries()).map(
    ([source, groupEvents]) => ({
      key: source,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'provenance',
    })
  );

  return {
    dimension: 'provenance',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Group events by temporal window (temporal dimension)
 * 
 * Creates groups where each group contains events within the same temporal window.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @param sessionStartTime - Optional session start time for 'session' window
 * @returns Groups organized by temporal window
 */
export function groupEventsByTemporalWindow(
  events: ObservationEvent[],
  sessionStartTime?: number
): ObservationGroups {
  const windows: TemporalWindow[] = ['last_hour', 'today', 'this_week', 'session', 'all_time'];
  const groupsByWindow = new Map<TemporalWindow, ObservationEvent[]>();

  // Group events by temporal window
  windows.forEach((window) => {
    const windowEvents = getEventsInWindow(events, window, sessionStartTime);
    if (windowEvents.length > 0) {
      groupsByWindow.set(window, windowEvents);
    }
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsByWindow.entries()).map(
    ([window, groupEvents]) => ({
      key: window,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'temporal',
    })
  );

  return {
    dimension: 'temporal',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Group events by type and subsystem (composite dimension)
 * 
 * Creates groups where each group contains events sharing the same type AND subsystem.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @returns Groups organized by type and subsystem combination
 */
export function groupEventsByTypeAndSubsystem(
  events: ObservationEvent[]
): ObservationGroups {
  const groupsByComposite = new Map<string, ObservationEvent[]>();

  // Group events by type + subsystem combination
  events.forEach((event) => {
    const subsystem = event.data?.subsystem || 'unknown';
    const compositeKey = `${event.type}:${subsystem}`;
    const existing = groupsByComposite.get(compositeKey) || [];
    groupsByComposite.set(compositeKey, [...existing, event]);
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsByComposite.entries()).map(
    ([compositeKey, groupEvents]) => ({
      key: compositeKey,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'composite',
    })
  );

  return {
    dimension: 'composite',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Group events by source and type (composite dimension)
 * 
 * Creates groups where each group contains events sharing the same source AND type.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @returns Groups organized by source and type combination
 */
export function groupEventsBySourceAndType(
  events: ObservationEvent[]
): ObservationGroups {
  const groupsByComposite = new Map<string, ObservationEvent[]>();

  // Group events by source + type combination
  events.forEach((event) => {
    const compositeKey = `${event.source}:${event.type}`;
    const existing = groupsByComposite.get(compositeKey) || [];
    groupsByComposite.set(compositeKey, [...existing, event]);
  });

  // Convert to ObservationGroup array
  const groups: ObservationGroup[] = Array.from(groupsByComposite.entries()).map(
    ([compositeKey, groupEvents]) => ({
      key: compositeKey,
      events: groupEvents.sort((a, b) => a.timestamp - b.timestamp), // Chronological order
      count: groupEvents.length,
      dimension: 'composite',
    })
  );

  return {
    dimension: 'composite',
    groups,
    totalEvents: events.length,
    totalGroups: groups.length,
  };
}

/**
 * Get all groups for a given dimension
 * 
 * Convenience function to get groups organized by a specific dimension.
 * This is structural organization only - no interpretation.
 * 
 * @param events - Array of observation events
 * @param dimension - The dimension to group by
 * @param sessionStartTime - Optional session start time for temporal grouping
 * @returns Groups organized by the specified dimension
 */
export function getGroupsByDimension(
  events: ObservationEvent[],
  dimension: 'type' | 'subsystem' | 'severity' | 'source' | 'temporal' | 'type+subsystem' | 'source+type',
  sessionStartTime?: number
): ObservationGroups {
  switch (dimension) {
    case 'type':
      return groupEventsByType(events);
    case 'subsystem':
      return groupEventsBySubsystem(events);
    case 'severity':
      return groupEventsBySeverity(events);
    case 'source':
      return groupEventsBySource(events);
    case 'temporal':
      return groupEventsByTemporalWindow(events, sessionStartTime);
    case 'type+subsystem':
      return groupEventsByTypeAndSubsystem(events);
    case 'source+type':
      return groupEventsBySourceAndType(events);
    default:
      // Fallback: return empty groups
      return {
        dimension: 'vocabulary',
        groups: [],
        totalEvents: 0,
        totalGroups: 0,
      };
  }
}

/**
 * Get a specific group by key
 * 
 * Finds a group within a collection by its key.
 * This is structural lookup only - no interpretation.
 * 
 * @param groups - Observation groups collection
 * @param key - The key of the group to find
 * @returns The group with the matching key, or undefined if not found
 */
export function getGroupByKey(
  groups: ObservationGroups,
  key: string
): ObservationGroup | undefined {
  return groups.groups.find((group) => group.key === key);
}

/**
 * Get groups sorted by count (descending)
 * 
 * Returns groups sorted by the number of events they contain.
 * This is structural ordering only - no interpretation or ranking.
 * 
 * @param groups - Observation groups collection
 * @returns Groups sorted by count (largest first)
 */
export function getGroupsSortedByCount(
  groups: ObservationGroups
): ObservationGroup[] {
  return [...groups.groups].sort((a, b) => b.count - a.count);
}

/**
 * Get groups sorted by count (ascending)
 * 
 * Returns groups sorted by the number of events they contain.
 * This is structural ordering only - no interpretation or ranking.
 * 
 * @param groups - Observation groups collection
 * @returns Groups sorted by count (smallest first)
 */
export function getGroupsSortedByCountAscending(
  groups: ObservationGroups
): ObservationGroup[] {
  return [...groups.groups].sort((a, b) => a.count - b.count);
}

/**
 * Get groups with non-empty events only
 * 
 * Filters out groups that have no events.
 * This is structural filtering only - no interpretation.
 * 
 * @param groups - Observation groups collection
 * @returns Groups collection with only non-empty groups
 */
export function getNonEmptyGroups(
  groups: ObservationGroups
): ObservationGroups {
  const nonEmptyGroups = groups.groups.filter((group) => group.count > 0);
  return {
    ...groups,
    groups: nonEmptyGroups,
    totalGroups: nonEmptyGroups.length,
  };
}
