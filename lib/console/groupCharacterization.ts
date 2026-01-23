/**
 * Group Characterization System
 * 
 * This file provides structural characterization utilities for observation groups.
 * It computes descriptive metadata about groups without interpretation.
 * 
 * It does NOT:
 * - Interpret group characteristics
 * - Rank or prioritize groups
 * - Detect patterns or anomalies
 * - Make decisions based on characterization
 * - Add intelligence or reasoning
 * 
 * It ONLY:
 * - Computes temporal metadata (first seen, last seen, span)
 * - Computes dimensional profiles (vocabulary/provenance distribution)
 * - Computes structural properties (density, concentration, diversity)
 * - Provides descriptive characterization, not semantic analysis
 * 
 * Characterization precedes pattern recognition. This is description, not intelligence.
 */

import type { ObservationEvent } from "./observationVocabulary";
import type {
  ObservationEventType,
  ObservationSubsystem,
  ObservationSeverity,
} from "./observationVocabulary";
import type { ObservationSource } from "./observationProvenance";
import type { ObservationGroup } from "./observationAggregation";

/**
 * Temporal Metadata
 * 
 * Structural temporal properties of a group.
 * This is descriptive timing information only - no interpretation.
 */
export type GroupTemporalMetadata = {
  /**
   * Timestamp of the first event in the group.
   * When this group first appeared.
   */
  firstEventTimestamp: number | null;
  
  /**
   * Timestamp of the last event in the group.
   * Most recent event in this group.
   */
  lastEventTimestamp: number | null;
  
  /**
   * Temporal span in milliseconds.
   * Duration between first and last event.
   * null if group has fewer than 2 events.
   */
  temporalSpan: number | null;
  
  /**
   * Events per hour (descriptive density).
   * Computed as count / (span in hours).
   * null if span is null or zero.
   */
  eventsPerHour: number | null;
};

/**
 * Dimensional Profile
 * 
 * Structural distribution of dimensions within a group.
 * This is descriptive counting only - no interpretation or ranking.
 */
export type GroupDimensionalProfile = {
  /**
   * Distribution of event types within the group.
   * Count of each type present in the group.
   */
  byType: Record<ObservationEventType, number>;
  
  /**
   * Distribution of subsystems within the group.
   * Count of each subsystem present in the group.
   */
  bySubsystem: Record<ObservationSubsystem | 'unknown', number>;
  
  /**
   * Distribution of severities within the group.
   * Count of each severity present in the group.
   */
  bySeverity: Record<ObservationSeverity | 'unknown', number>;
  
  /**
   * Distribution of sources within the group.
   * Count of each source present in the group.
   */
  bySource: Record<ObservationSource, number>;
  
  /**
   * Number of distinct types in the group.
   * Descriptive diversity measure.
   */
  distinctTypes: number;
  
  /**
   * Number of distinct subsystems in the group.
   * Descriptive diversity measure.
   */
  distinctSubsystems: number;
  
  /**
   * Number of distinct severities in the group.
   * Descriptive diversity measure.
   */
  distinctSeverities: number;
  
  /**
   * Number of distinct sources in the group.
   * Descriptive diversity measure.
   */
  distinctSources: number;
};

/**
 * Structural Properties
 * 
 * Structural characteristics of a group's organization.
 * This is descriptive geometry only - no interpretation.
 */
export type GroupStructuralProperties = {
  /**
   * Temporal density: events per hour.
   * Descriptive measure of event frequency.
   * null if temporal span is null or zero.
   */
  temporalDensity: number | null;
  
  /**
   * Concentration measure: whether events cluster temporally.
   * Computed as: (actual span) / (theoretical max span if evenly distributed).
   * Lower values indicate more clustering (structural only, no interpretation).
   * null if span is null or count < 2.
   */
  temporalConcentration: number | null;
  
  /**
   * Dimensional diversity: how many distinct values exist across dimensions.
   * Sum of distinct types, subsystems, severities, sources.
   * Descriptive measure only - no interpretation.
   */
  dimensionalDiversity: number;
};

/**
 * Group Characterization
 * 
 * Complete structural characterization of an observation group.
 * This is descriptive metadata only - no interpretation or ranking.
 */
export type GroupCharacterization = {
  /**
   * Temporal metadata about the group.
   */
  temporal: GroupTemporalMetadata;
  
  /**
   * Dimensional profile of the group.
   */
  dimensional: GroupDimensionalProfile;
  
  /**
   * Structural properties of the group.
   */
  structural: GroupStructuralProperties;
};

/**
 * Compute temporal metadata for a group
 * 
 * Calculates first event, last event, span, and density.
 * This is descriptive computation only - no interpretation.
 * 
 * @param group - Observation group to characterize
 * @returns Temporal metadata for the group
 */
export function computeGroupTemporalMetadata(
  group: ObservationGroup
): GroupTemporalMetadata {
  if (group.events.length === 0) {
    return {
      firstEventTimestamp: null,
      lastEventTimestamp: null,
      temporalSpan: null,
      eventsPerHour: null,
    };
  }

  const timestamps = group.events.map((e) => e.timestamp).sort((a, b) => a - b);
  const firstTimestamp = timestamps[0];
  const lastTimestamp = timestamps[timestamps.length - 1];
  const span = timestamps.length > 1 ? lastTimestamp - firstTimestamp : null;
  
  // Events per hour: count / (span in hours)
  const eventsPerHour = span && span > 0
    ? (group.count / (span / (1000 * 60 * 60)))
    : null;

  return {
    firstEventTimestamp: firstTimestamp,
    lastEventTimestamp: lastTimestamp,
    temporalSpan: span,
    eventsPerHour,
  };
}

/**
 * Compute dimensional profile for a group
 * 
 * Calculates distribution of vocabulary and provenance dimensions within the group.
 * This is descriptive counting only - no interpretation.
 * 
 * @param group - Observation group to characterize
 * @returns Dimensional profile of the group
 */
export function computeGroupDimensionalProfile(
  group: ObservationGroup
): GroupDimensionalProfile {
  // Initialize counts
  const byType: Record<ObservationEventType, number> = {
    hadra_insight: 0,
    console_message: 0,
  };
  
  const bySubsystem: Record<ObservationSubsystem | 'unknown', number> = {
    mesh: 0,
    agents: 0,
    rho2: 0,
    system: 0,
    console: 0,
    unknown: 0,
  };
  
  const bySeverity: Record<ObservationSeverity | 'unknown', number> = {
    info: 0,
    anomaly: 0,
    warning: 0,
    critical: 0,
    unknown: 0,
  };
  
  const bySource: Record<ObservationSource, number> = {
    hadra: 0,
    ui: 0,
    console: 0,
    system: 0,
    mesh: 0,
    agent: 0,
    unknown: 0,
  };

  // Count dimensions
  const distinctTypes = new Set<ObservationEventType>();
  const distinctSubsystems = new Set<ObservationSubsystem | 'unknown'>();
  const distinctSeverities = new Set<ObservationSeverity | 'unknown'>();
  const distinctSources = new Set<ObservationSource>();

  group.events.forEach((event) => {
    // Count by type
    if (event.type in byType) {
      byType[event.type]++;
      distinctTypes.add(event.type);
    }

    // Count by subsystem
    const subsystem = event.data?.subsystem || 'unknown';
    if (subsystem in bySubsystem) {
      bySubsystem[subsystem]++;
      distinctSubsystems.add(subsystem);
    }

    // Count by severity
    const severity = event.data?.severity || 'unknown';
    if (severity in bySeverity) {
      bySeverity[severity]++;
      distinctSeverities.add(severity);
    }

    // Count by source
    if (event.source in bySource) {
      bySource[event.source]++;
      distinctSources.add(event.source);
    }
  });

  return {
    byType,
    bySubsystem,
    bySeverity,
    bySource,
    distinctTypes: distinctTypes.size,
    distinctSubsystems: distinctSubsystems.size,
    distinctSeverities: distinctSeverities.size,
    distinctSources: distinctSources.size,
  };
}

/**
 * Compute structural properties for a group
 * 
 * Calculates density, concentration, and diversity measures.
 * This is descriptive geometry only - no interpretation.
 * 
 * @param group - Observation group to characterize
 * @param temporalMetadata - Pre-computed temporal metadata (optional, will compute if not provided)
 * @param dimensionalProfile - Pre-computed dimensional profile (optional, will compute if not provided)
 * @returns Structural properties of the group
 */
export function computeGroupStructuralProperties(
  group: ObservationGroup,
  temporalMetadata?: GroupTemporalMetadata,
  dimensionalProfile?: GroupDimensionalProfile
): GroupStructuralProperties {
  const temporal = temporalMetadata || computeGroupTemporalMetadata(group);
  const dimensional = dimensionalProfile || computeGroupDimensionalProfile(group);

  // Temporal density (events per hour)
  const temporalDensity = temporal.eventsPerHour;

  // Temporal concentration: how clustered are events?
  // Computed as: (actual span) / (theoretical max span if evenly distributed)
  // Lower values = more clustering (structural only, no interpretation)
  let temporalConcentration: number | null = null;
  if (temporal.temporalSpan !== null && group.count > 1) {
    // Theoretical max span: if events were evenly distributed, span would be:
    // (count - 1) * averageInterval
    // But we use actual span, so concentration = actualSpan / (count - 1) / averageInterval
    // Simplified: concentration = actualSpan / (count - 1) / (actualSpan / (count - 1))
    // Actually, let's use a simpler measure: actualSpan / (count - 1) normalized
    // For evenly distributed: each event would be span/(count-1) apart
    // Concentration = 1.0 means evenly distributed, < 1.0 means clustered
    const averageInterval = temporal.temporalSpan / (group.count - 1);
    const theoreticalMaxSpan = averageInterval * (group.count - 1);
    temporalConcentration = theoreticalMaxSpan > 0
      ? temporal.temporalSpan / theoreticalMaxSpan
      : null;
  }

  // Dimensional diversity: sum of distinct values across dimensions
  const dimensionalDiversity =
    dimensional.distinctTypes +
    dimensional.distinctSubsystems +
    dimensional.distinctSeverities +
    dimensional.distinctSources;

  return {
    temporalDensity,
    temporalConcentration,
    dimensionalDiversity,
  };
}

/**
 * Characterize an observation group
 * 
 * Computes complete structural characterization (temporal, dimensional, structural).
 * This is descriptive metadata only - no interpretation.
 * 
 * @param group - Observation group to characterize
 * @returns Complete characterization of the group
 */
export function characterizeGroup(
  group: ObservationGroup
): GroupCharacterization {
  const temporal = computeGroupTemporalMetadata(group);
  const dimensional = computeGroupDimensionalProfile(group);
  const structural = computeGroupStructuralProperties(group, temporal, dimensional);

  return {
    temporal,
    dimensional,
    structural,
  };
}

/**
 * Characterize multiple groups
 * 
 * Computes characterization for all groups in a collection.
 * This is descriptive computation only - no interpretation.
 * 
 * @param groups - Array of observation groups
 * @returns Map of group key to characterization
 */
export function characterizeGroups(
  groups: ObservationGroup[]
): Map<string, GroupCharacterization> {
  const characterizations = new Map<string, GroupCharacterization>();
  
  groups.forEach((group) => {
    characterizations.set(group.key, characterizeGroup(group));
  });
  
  return characterizations;
}

/**
 * Get temporal summary across groups
 * 
 * Computes aggregate temporal properties across multiple groups.
 * This is descriptive aggregation only - no interpretation.
 * 
 * @param groups - Array of observation groups
 * @returns Aggregate temporal summary
 */
export function getGroupsTemporalSummary(
  groups: ObservationGroup[]
): {
  earliestFirstEvent: number | null;
  latestLastEvent: number | null;
  totalSpan: number | null;
  averageGroupSpan: number | null;
} {
  if (groups.length === 0) {
    return {
      earliestFirstEvent: null,
      latestLastEvent: null,
      totalSpan: null,
      averageGroupSpan: null,
    };
  }

  const characterizations = characterizeGroups(groups);
  const firstTimestamps: number[] = [];
  const lastTimestamps: number[] = [];
  const spans: number[] = [];

  characterizations.forEach((char) => {
    if (char.temporal.firstEventTimestamp !== null) {
      firstTimestamps.push(char.temporal.firstEventTimestamp);
    }
    if (char.temporal.lastEventTimestamp !== null) {
      lastTimestamps.push(char.temporal.lastEventTimestamp);
    }
    if (char.temporal.temporalSpan !== null) {
      spans.push(char.temporal.temporalSpan);
    }
  });

  const earliestFirstEvent =
    firstTimestamps.length > 0 ? Math.min(...firstTimestamps) : null;
  const latestLastEvent =
    lastTimestamps.length > 0 ? Math.max(...lastTimestamps) : null;
  const totalSpan =
    earliestFirstEvent !== null && latestLastEvent !== null
      ? latestLastEvent - earliestFirstEvent
      : null;
  const averageGroupSpan =
    spans.length > 0 ? spans.reduce((a, b) => a + b, 0) / spans.length : null;

  return {
    earliestFirstEvent,
    latestLastEvent,
    totalSpan,
    averageGroupSpan,
  };
}
