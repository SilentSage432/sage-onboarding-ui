/**
 * Temporal Framing System
 * 
 * This file provides passive temporal organization for observations.
 * It does NOT:
 * - Interpret temporal patterns
 * - Make decisions based on time
 * - Detect anomalies over time
 * - Add intelligence
 * 
 * It ONLY:
 * - Organizes observations by time windows
 * - Provides temporal boundaries (sessions, windows)
 * - Enables querying "when" without interpreting "what it means"
 * 
 * Temporal framing precedes temporal analysis. This is structure, not intelligence.
 */

import type { ObservationEvent } from "./observationVocabulary";

/**
 * Temporal Window Types
 * 
 * Predefined time windows for organizing observations.
 * These are descriptive boundaries, not interpretive categories.
 */
export type TemporalWindow =
  | 'last_hour'
  | 'today'
  | 'this_week'
  | 'session'
  | 'all_time';

/**
 * Time Range
 * 
 * A custom time range with explicit start and end boundaries.
 */
export type TimeRange = {
  start: number; // timestamp
  end: number;   // timestamp
};

/**
 * Temporal Summary
 * 
 * A passive summary of observations organized by temporal windows.
 * This is descriptive counting only - no interpretation.
 */
export type TemporalSummary = {
  allTime: number;
  thisWeek: number;
  today: number;
  lastHour: number;
  thisSession: number;
};

/**
 * Passive Temporal Query Utilities
 * 
 * These functions organize observations by time without interpretation.
 * They are read-only, pure functions with no side effects.
 */

/**
 * Get the start of today (midnight in local time)
 */
function getTodayStart(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return start.getTime();
}

/**
 * Get the start of this week (Monday at midnight)
 */
function getWeekStart(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

/**
 * Get events within a specific time window
 * 
 * @param events - Array of observation events
 * @param window - Temporal window type
 * @param sessionStartTime - Optional session start time for 'session' window
 * @returns Filtered events within the window
 */
export function getEventsInWindow(
  events: ObservationEvent[],
  window: TemporalWindow,
  sessionStartTime?: number
): ObservationEvent[] {
  const now = Date.now();
  let startTime: number;

  switch (window) {
    case 'last_hour':
      startTime = now - 60 * 60 * 1000; // 1 hour ago
      break;
    case 'today':
      startTime = getTodayStart();
      break;
    case 'this_week':
      startTime = getWeekStart();
      break;
    case 'session':
      if (!sessionStartTime) {
        return []; // No session start time, return empty
      }
      startTime = sessionStartTime;
      break;
    case 'all_time':
      return events; // Return all events
    default:
      return [];
  }

  return events.filter((event) => event.timestamp >= startTime && event.timestamp <= now);
}

/**
 * Get events since a specific timestamp
 * 
 * @param events - Array of observation events
 * @param sinceTimestamp - Timestamp to filter from (inclusive)
 * @returns Events with timestamp >= sinceTimestamp
 */
export function getEventsSince(
  events: ObservationEvent[],
  sinceTimestamp: number
): ObservationEvent[] {
  return events.filter((event) => event.timestamp >= sinceTimestamp);
}

/**
 * Get events within a custom time range
 * 
 * @param events - Array of observation events
 * @param range - Time range with start and end
 * @returns Events within the range (inclusive)
 */
export function getEventsInRange(
  events: ObservationEvent[],
  range: TimeRange
): ObservationEvent[] {
  return events.filter(
    (event) => event.timestamp >= range.start && event.timestamp <= range.end
  );
}

/**
 * Get events for the current session
 * 
 * @param events - Array of observation events
 * @param sessionStartTime - Session start timestamp
 * @returns Events that occurred during this session
 */
export function getSessionEvents(
  events: ObservationEvent[],
  sessionStartTime: number
): ObservationEvent[] {
  return getEventsSince(events, sessionStartTime);
}

/**
 * Get a temporal summary of observations
 * 
 * Groups observations by common temporal windows.
 * This is descriptive counting only - no interpretation.
 * 
 * @param events - Array of observation events
 * @param sessionStartTime - Optional session start time
 * @returns Summary with counts for each temporal window
 */
export function getTemporalSummary(
  events: ObservationEvent[],
  sessionStartTime?: number
): TemporalSummary {
  const now = Date.now();
  const todayStart = getTodayStart();
  const weekStart = getWeekStart();
  const lastHourStart = now - 60 * 60 * 1000;

  return {
    allTime: events.length,
    thisWeek: events.filter((e) => e.timestamp >= weekStart).length,
    today: events.filter((e) => e.timestamp >= todayStart).length,
    lastHour: events.filter((e) => e.timestamp >= lastHourStart).length,
    thisSession: sessionStartTime
      ? events.filter((e) => e.timestamp >= sessionStartTime).length
      : 0,
  };
}

/**
 * Get the most recent N events
 * 
 * @param events - Array of observation events
 * @param count - Number of recent events to return
 * @returns Most recent N events (sorted by timestamp, descending)
 */
export function getRecentEvents(
  events: ObservationEvent[],
  count: number
): ObservationEvent[] {
  return [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, count);
}

/**
 * Get events ordered by time (oldest first)
 */
export function getEventsChronological(events: ObservationEvent[]): ObservationEvent[] {
  return [...events].sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Get events ordered by time (newest first)
 */
export function getEventsReverseChronological(events: ObservationEvent[]): ObservationEvent[] {
  return [...events].sort((a, b) => b.timestamp - a.timestamp);
}
