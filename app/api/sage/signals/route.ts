/**
 * SAGE Signals Endpoint
 * 
 * Returns SAGE-emitted signals for HADRA orb observation.
 * Signals are aggregated by SAGE from various sources (including ADRAE indirectly).
 * 
 * Returns empty array if SAGE backend is unavailable or has no signals.
 * No errors thrown - graceful degradation only.
 */

import { NextResponse } from "next/server";
import type { SignalEmitter } from "@/lib/signals/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveNodeIdentifier(): string {
  // Keep this intentionally minimal: an opaque node identifier only.
  return (
    process.env.HOSTNAME ||
    process.env.NODE_NAME ||
    process.env.VERCEL_URL ||
    "unknown-node"
  );
}

export async function GET() {
  const now = new Date();
  const node = resolveNodeIdentifier();

  // ARC Χ (Chi) — minimal, passive heartbeat signal.
  // Envelope: arc="chi", type="heartbeat" (carried as `state`), payload: timestamp + node identifier.
  // No persistence, no interpretation, no mutation.
  const chiHeartbeat: SignalEmitter = {
    id: "arc.chi.heartbeat",
    source: "chi",
    state: "heartbeat",
    // Mark unavailable so global aggregation remains untouched by this observer-only signal.
    severity: "unavailable",
    timestamp: now.toISOString(),
    metadata: {
      arc: "chi",
      node,
    },
  };

  const signals: SignalEmitter[] = [chiHeartbeat];

  return NextResponse.json(signals, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
