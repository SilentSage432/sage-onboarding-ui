/**
 * Readiness Check Endpoint
 * 
 * Truthful readiness check that validates application dependencies.
 * Returns HTTP 200 when the app is ready to serve requests correctly,
 * otherwise returns HTTP 503 (Service Unavailable).
 * 
 * Used by container orchestration systems (Kubernetes, Docker, etc.) for readiness probes.
 * 
 * Validates:
 * - Required environment variables
 * - Database connectivity (if DATABASE_URL is present)
 * 
 * Fail-closed: Returns 503 if required dependencies are missing or unreachable.
 */

import { NextResponse } from 'next/server';
import { runStartupValidation } from '@/lib/infrastructure/startupValidation';

export async function GET() {
  try {
    const validation = await runStartupValidation();

    if (validation.ready) {
      return NextResponse.json(
        {
          status: 'ready',
          checks: {
            env: validation.env,
            db: validation.db,
          },
          ts: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      // Fail closed: return 503 if not ready
      return NextResponse.json(
        {
          status: 'not_ready',
          checks: {
            env: validation.env,
            db: validation.db,
          },
          ts: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    // If validation itself fails, we're not ready
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown validation error';
    
    return NextResponse.json(
      {
        status: 'not_ready',
        checks: {
          env: { ok: false, missing: [] },
          db: { ok: false, error: errorMessage },
        },
        ts: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
