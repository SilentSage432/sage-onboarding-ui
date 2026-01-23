/**
 * Observation Provenance System
 * 
 * This file defines the vocabulary for tracking where observations originate.
 * It does NOT:
 * - Interpret source reliability
 * - Weight observations by source
 * - Make trust decisions
 * - Add authority or ranking
 * 
 * It ONLY:
 * - Names where observations come from
 * - Provides source attribution
 * - Enables querying "where did this come from?"
 * 
 * Provenance is descriptive metadata only. This is naming, not meaning.
 */

/**
 * Observation Source
 * 
 * The source or origin of an observation event.
 * This is an identifier only - no semantics, trust, or weighting attached.
 */
export type ObservationSource =
  | 'hadra'      // HADRA-01 diagnostic insights
  | 'ui'         // UI interactions or state changes
  | 'console'    // Console messages (operator input, HADRA responses)
  | 'system'     // System-level events
  | 'mesh'       // Mesh network events
  | 'agent'      // Agent activity events
  | 'unknown';   // Source not identified (default when uncertain)

/**
 * Provenance Metadata
 * 
 * Additional metadata about observation origin.
 * This is descriptive only - no interpretation or trust scoring.
 */
export type ProvenanceMetadata = {
  source: ObservationSource;
  sourceId?: string;      // Optional identifier for the specific source instance
  sourceVersion?: string; // Optional version identifier
  [key: string]: unknown; // Allow additional fields without breaking
};
