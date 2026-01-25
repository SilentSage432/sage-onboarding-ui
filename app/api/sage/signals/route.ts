/**
 * SAGE Signals Endpoint
 * 
 * Returns SAGE-emitted signals for HADRA orb observation.
 * Signals are aggregated by SAGE from various sources (including ADRAE indirectly).
 * 
 * Returns empty array if SAGE backend is unavailable or has no signals.
 * No errors thrown - graceful degradation only.
 */

import { NextResponse } from 'next/server';
import type { SignalEmitter } from '@/lib/signals/types';

export async function GET() {
  // TODO: Fetch from SAGE backend service when available
  // For now, return empty array (graceful degradation)
  // UI will handle empty array and display orb as idle
  
  const signals: SignalEmitter[] = [];
  
  return NextResponse.json(signals, { status: 200 });
}
