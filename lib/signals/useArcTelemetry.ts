"use client";

import { useMemo } from "react";
import { useSageSignal } from "./useSageSignal";
import type { SignalEmitter } from "./types";

export type ArcTelemetryMatcher = {
  arc: string;
  slug: string;
  namespace?: string;
};

export type ArcTelemetryState = {
  status: "awaiting_signal" | "signal_present";
  signal: SignalEmitter | null;
};

function parseSignalTimestamp(ts: string): number {
  const parsed = Date.parse(ts);
  return Number.isFinite(parsed) ? parsed : 0;
}

function matchesArcTelemetry(signal: SignalEmitter, matcher: ArcTelemetryMatcher): boolean {
  const metadata = signal.metadata;
  if (!metadata || typeof metadata !== "object") return false;

  const arc = (metadata as Record<string, unknown>).arc;
  if (typeof arc === "string" && arc.toLowerCase() === matcher.arc.toLowerCase()) {
    return true;
  }

  const arcSlug = (metadata as Record<string, unknown>).arcSlug;
  if (typeof arcSlug === "string" && arcSlug === matcher.slug) {
    return true;
  }

  if (matcher.namespace) {
    const namespace = (metadata as Record<string, unknown>).namespace;
    if (typeof namespace === "string" && namespace === matcher.namespace) {
      return true;
    }
  }

  return false;
}

/**
 * useArcTelemetry
 * Passive, read-only telemetry intake for Arc panels.
 *
 * - No schema invention: only best-effort matching on common metadata keys if present.
 * - Fail-silent: missing telemetry endpoint yields empty signals => awaiting_signal.
 * - No mutations, no commands.
 */
export function useArcTelemetry(matcher: ArcTelemetryMatcher): ArcTelemetryState {
  const signals = useSageSignal();

  return useMemo(() => {
    const matched = signals.filter((s) => matchesArcTelemetry(s, matcher));
    if (matched.length === 0) {
      return { status: "awaiting_signal", signal: null };
    }

    const latest = matched
      .slice()
      .sort((a, b) => parseSignalTimestamp(b.timestamp) - parseSignalTimestamp(a.timestamp))[0];

    return { status: "signal_present", signal: latest || null };
  }, [signals, matcher.arc, matcher.namespace, matcher.slug]);
}

